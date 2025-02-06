import auth from '@react-native-firebase/auth';
import {Alert} from 'react-native';
import {CustomAlert} from '../../components/CustomAlert';

export const AuthService = {
  register: async (email: string, password: string) => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      await userCredential.user.sendEmailVerification();
      await auth().signOut();
      return userCredential.user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  login: async (email: string, password: string) => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );

      if (!userCredential.user.emailVerified) {
        CustomAlert.show({
          title: 'E-posta Doğrulaması Gerekli',
          message:
            'Lütfen e-posta adresinize gönderilen doğrulama kodunu kullanın.',
          icon: 'email-alert-outline',
          buttons: [
            {
              text: 'Tekrar Gönder',
              onPress: async () => {
                try {
                  await userCredential.user.sendEmailVerification();
                  CustomAlert.show({
                    title: 'Mail Gönderildi',
                    message:
                      'Doğrulama maili tekrar gönderildi. Lütfen mail kutunuzu kontrol edin.',
                    icon: 'email-check-outline',
                    buttons: [
                      {
                        text: 'Tamam',
                        style: 'primary',
                        icon: 'check',
                        onPress: async () => {
                          CustomAlert.hide();
                          await auth().signOut();
                        },
                      },
                    ],
                  });
                } catch (error) {
                  throw new Error('Doğrulama maili gönderilemedi.');
                }
              },
              style: 'primary',
              icon: 'email-send',
            },
            {
              text: 'Çıkış Yap',
              style: 'cancel',
              onPress: async () => {
                CustomAlert.hide();
                setTimeout(async () => {
                  await auth().signOut();
                }, 100);
              },
            },
          ],
        });
        await auth().signOut();
        throw new Error('email-not-verified');
      }

      return userCredential.user;
    } catch (error: any) {
      if (error.message === 'email-not-verified') {
        throw new Error('E-posta doğrulaması gerekli.');
      }
      throw new Error(error.message);
    }
  },

  logout: async () => {
    try {
      await auth().signOut();
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  sendVerificationEmail: async () => {
    try {
      const user = auth().currentUser;
      if (user) {
        await user.sendEmailVerification();
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};
