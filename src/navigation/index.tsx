import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import CreateCapsuleScreen from '../screens/CreateCapsuleScreen';
import CapsuleDetailScreen from '../screens/CapsuleDetailScreen';
import OpenCapsuleScreen from '../screens/OpenCapsuleScreen';
import {COLORS} from '../theme';
import {CustomAlert} from '../components/CustomAlert';
import BottomTabs from './BottomTabs';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async userState => {
      if (userState) {
        // Kullanıcı bilgilerini yenile
        await userState.reload();

        // Doğrulanmış kullanıcıyı kaydet
        if (userState.emailVerified) {
          setUser(userState);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }

      if (initializing) {
        setInitializing(false);
      }
    });

    return () => subscriber();
  }, [initializing]);

  if (initializing) return null;

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      {!user ? (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{headerShown: false}}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="MainTabs"
            component={BottomTabs}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="CreateCapsule"
            component={CreateCapsuleScreen}
            options={{title: 'Yeni Kapsül'}}
          />
          <Stack.Screen
            name="CapsuleDetail"
            component={CapsuleDetailScreen}
            options={{title: 'Kapsül Detayı'}}
          />
          <Stack.Screen
            name="OpenCapsule"
            component={OpenCapsuleScreen}
            options={{title: 'Kapsülü Aç'}}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default Navigation;
