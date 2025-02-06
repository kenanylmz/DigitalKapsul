import auth from '@react-native-firebase/auth';

export const AuthService = {
  register: async (email: string, password: string) => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      await userCredential.user.sendEmailVerification();
      return userCredential.user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  login: async (email: string, password: string) => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      if (!userCredential.user.emailVerified) {
        throw new Error('Lütfen e-posta adresinizi doğrulayın.');
      }
      return userCredential.user;
    } catch (error: any) {
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