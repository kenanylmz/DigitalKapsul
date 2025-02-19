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
      // E-posta boş ise false döndür
      if (!email) return false;

      // Kullanıcıları e-postaya göre sorgula
      const snapshot = await database()
        .ref('users')
        .orderByChild('profile/email')
        .equalTo(email)
        .once('value');

      const users = snapshot.val();
      console.log('Aranan e-posta:', email);
      console.log('Bulunan kullanıcılar:', users);

      // Kullanıcı bulunamadıysa false döndür
      if (!users) {
        console.log('Kullanıcı bulunamadı');
        return false;
      }

      // Kullanıcı bulunduysa true döndür
      const userExists = Object.values(users).some(
        (user: any) => user.profile && user.profile.email === email,
      );

      console.log('Kullanıcı var mı?', userExists);
      return userExists;
    } catch (error) {
      console.error('Kullanıcı kontrolü hatası:', error);
      throw error;
    }
  },

  // Kapsül oluşturma
  createCapsule: async (capsuleData: Omit<Capsule, 'id'>) => {
    try {
      const user = auth().currentUser;
      if (!user) throw new Error('Kullanıcı bulunamadı');

      // Yeni kapsül referansı oluştur
      const newCapsuleRef = database().ref('capsules').push();
      const capsuleId = newCapsuleRef.key;

      if (!capsuleId) throw new Error('Kapsül ID oluşturulamadı');

      const capsule = {
        ...capsuleData,
        id: capsuleId,
        senderId: user.uid,
        senderEmail: user.email,
      };

      // Transaction kullanarak güncelleme yap
      const updates: {[key: string]: any} = {};

      // Ana kapsül verisini kaydet
      updates[`capsules/${capsuleId}`] = capsule;

      if (capsule.capsuleType === 'self') {
        // Kendine gönderilen kapsül
        updates[`users/${user.uid}/sentCapsules/${capsuleId}`] = {
          createdAt: capsule.createdAt,
          type: capsule.type,
        };
        updates[`users/${user.uid}/receivedCapsules/${capsuleId}`] = {
          createdAt: capsule.createdAt,
          type: capsule.type,
        };
      } else if (capsule.capsuleType === 'sent' && capsule.recipientEmail) {
        // Başkasına gönderilen kapsül
        updates[`users/${user.uid}/sentCapsules/${capsuleId}`] = {
          createdAt: capsule.createdAt,
          type: capsule.type,
        };

        // Alıcıyı bul
        const recipientSnapshot = await database()
          .ref('users')
          .orderByChild('profile/email')
          .equalTo(capsule.recipientEmail)
          .once('value');

        const recipientData = recipientSnapshot.val();
        if (recipientData) {
          const recipientId = Object.keys(recipientData)[0];
          updates[`users/${recipientId}/receivedCapsules/${capsuleId}`] = {
            createdAt: capsule.createdAt,
            type: capsule.type,
          };
        }
      }

      // Tüm güncellemeleri tek seferde yap
      await database().ref().update(updates);

      return capsule;
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
