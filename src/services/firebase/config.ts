import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyDHE9R4lunJ8waaAWSZiqVQfZzpKoGsGOw",
  authDomain: "digital-kapsul-5d705.firebaseapp.com",
  projectId: "digital-kapsul-5d705",
  storageBucket: "digital-kapsul-5d705.appspot.com",
  messagingSenderId: "899219294135",
  appId: "1:899219294135:android:fe300902d7ae903de50a32"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export {auth, firebase}; 