import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {Capsule} from '../../types';

export const getUserProfile = async () => {
  try {
    const user = auth().currentUser;
    if (!user) throw new Error('Kullanıcı bulunamadı');

    const snapshot = await database()
      .ref(`users/${user.uid}/profile`)
      .once('value');

    return snapshot.val();
  } catch (error) {
    console.error('Profil bilgileri alınırken hata:', error);
    throw error;
  }
};

export const updateUserProfile = async (profileData: any) => {
  try {
    const user = auth().currentUser;
    if (!user) throw new Error('Kullanıcı bulunamadı');

    await database().ref(`users/${user.uid}/profile`).update(profileData);
  } catch (error) {
    console.error('Profil güncellenirken hata:', error);
    throw error;
  }
};

export const DatabaseService = {
  // Kullanıcı kontrolü
  checkUserExists: async (email: string) => {
    try {
      const snapshot = await database()
        .ref('users')
        .orderByChild('profile/email')
        .equalTo(email)
        .once('value');

      return snapshot.exists();
    } catch (error) {
      console.error('Kullanıcı kontrolü hatası:', error);
      throw error;
    }
  },

  // Kapsül oluşturma
  createCapsule: async (capsule: Omit<Capsule, 'id'>) => {
    try {
      const user = auth().currentUser;
      if (!user) throw new Error('Kullanıcı bulunamadı');

      // Kapsül referansını oluştur
      const newCapsuleRef = database().ref('capsules').push();
      const capsuleId = newCapsuleRef.key;

      if (!capsuleId) {
        throw new Error('Kapsül ID oluşturulamadı');
      }

      // Kapsül verisini hazırla
      const capsuleData = {
        ...capsule,
        id: capsuleId,
        senderId: user.uid,
        senderEmail: user.email,
        status: 'active',
        createdAt: database.ServerValue.TIMESTAMP,
      };

      // Transaction kullanarak atomik işlem yap
      await database()
        .ref()
        .update({
          [`capsules/${capsuleId}`]: capsuleData,
          [`users/${user.uid}/sentCapsules/${capsuleId}`]: true,
        });

      // Alıcı varsa ve kendisi değilse
      if (capsule.recipientEmail && capsule.recipientEmail !== user.email) {
        const recipientSnapshot = await database()
          .ref('users')
          .orderByChild('profile/email')
          .equalTo(capsule.recipientEmail)
          .once('value');

        const recipientData = recipientSnapshot.val();
        if (recipientData) {
          const recipientId = Object.keys(recipientData)[0];
          await database()
            .ref(`users/${recipientId}/receivedCapsules/${capsuleId}`)
            .set(true);
        }
      }

      // Başarılı işlem sonrası kapsül verisini döndür
      return capsuleData;
    } catch (error) {
      console.error('Kapsül oluşturma hatası:', error);
      throw error;
    }
  },

  // Kullanıcının kapsüllerini getir
  getUserCapsules: async () => {
    try {
      const user = auth().currentUser;
      if (!user) throw new Error('Kullanıcı bulunamadı');

      // Gönderilen ve alınan kapsülleri al
      const [sentSnapshot, receivedSnapshot] = await Promise.all([
        database().ref(`users/${user.uid}/sentCapsules`).once('value'),
        database().ref(`users/${user.uid}/receivedCapsules`).once('value'),
      ]);

      const capsuleIds = new Set([
        ...Object.keys(sentSnapshot.val() || {}),
        ...Object.keys(receivedSnapshot.val() || {}),
      ]);

      const capsules = await Promise.all(
        Array.from(capsuleIds).map(async id => {
          const capsuleSnapshot = await database()
            .ref(`capsules/${id}`)
            .once('value');
          return capsuleSnapshot.val();
        }),
      );

      return capsules.filter(Boolean);
    } catch (error) {
      console.error('Kapsül getirme hatası:', error);
      throw error;
    }
  },

  // Kapsül güncelleme
  updateCapsule: async (capsule: Capsule) => {
    try {
      const user = auth().currentUser;
      if (!user) throw new Error('Kullanıcı bulunamadı');

      await database().ref(`capsules/${capsule.id}`).update(capsule);

      return capsule;
    } catch (error) {
      console.error('Kapsül güncelleme hatası:', error);
      throw error;
    }
  },

  // Kapsül silme
  deleteCapsule: async (capsuleId: string) => {
    try {
      const user = auth().currentUser;
      if (!user) throw new Error('Kullanıcı bulunamadı');

      // Kapsül bilgilerini al
      const capsuleSnapshot = await database()
        .ref(`capsules/${capsuleId}`)
        .once('value');

      const capsule = capsuleSnapshot.val();
      if (!capsule) {
        throw new Error('Kapsül bulunamadı');
      }

      // Transaction kullanarak atomik silme işlemi
      const updates: {[key: string]: null} = {
        [`capsules/${capsuleId}`]: null,
        [`users/${user.uid}/sentCapsules/${capsuleId}`]: null,
      };

      // Eğer alıcı varsa ve farklı bir kullanıcıysa
      if (capsule.recipientEmail && capsule.recipientEmail !== user.email) {
        const recipientSnapshot = await database()
          .ref('users')
          .orderByChild('profile/email')
          .equalTo(capsule.recipientEmail)
          .once('value');

        const recipientData = recipientSnapshot.val();
        if (recipientData) {
          const recipientId = Object.keys(recipientData)[0];
          updates[`users/${recipientId}/receivedCapsules/${capsuleId}`] = null;
        }
      }

      // Tüm referansları tek seferde sil
      await database().ref().update(updates);

      return capsuleId;
    } catch (error) {
      console.error('Kapsül silme hatası:', error);
      throw error;
    }
  },
};
