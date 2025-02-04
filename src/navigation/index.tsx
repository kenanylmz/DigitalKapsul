import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import CreateCapsuleScreen from '../screens/CreateCapsuleScreen';
import CapsuleDetailScreen from '../screens/CapsuleDetailScreen';
import OpenCapsuleScreen from '../screens/OpenCapsuleScreen';
import {COLORS} from '../theme';

export type RootStackParamList = {
  Home: undefined;
  CreateCapsule: undefined;
  CapsuleDetail: {capsuleId: string};
  OpenCapsule: {capsule: any}; // TODO: Tip tanımını düzelt
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation = () => {
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation; 