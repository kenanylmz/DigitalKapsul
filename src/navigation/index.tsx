import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import CreateCapsuleScreen from '../screens/CreateCapsuleScreen';
import CapsuleDetailScreen from '../screens/CapsuleDetailScreen';
import OpenCapsuleScreen from '../screens/OpenCapsuleScreen';
import {COLORS} from '../theme';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  CreateCapsule: undefined;
  CapsuleDetail: {capsuleId: string};
  OpenCapsule: {capsule: any};
  VerificationScreen: {email: string};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(userState => {
      setUser(userState);
      if (initializing) setInitializing(false);
    });

    return () => subscriber();
  }, [initializing]);

  if (initializing) return null;

  return (
    <NavigationContainer>
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
          // Auth screens
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
          // App screens
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{title: 'Dijital Kapsül'}}
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
    </NavigationContainer>
  );
};

export default Navigation;
