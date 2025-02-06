import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

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

    await database()
      .ref(`users/${user.uid}/profile`)
      .update(profileData);
  } catch (error) {
    console.error('Profil güncellenirken hata:', error);
    throw error;
  }
}; 