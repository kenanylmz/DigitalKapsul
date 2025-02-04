import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import CreateCapsuleScreen from '../screens/CreateCapsuleScreen';
import CapsuleDetailScreen from '../screens/CapsuleDetailScreen';
import {COLORS} from '../theme';

export type RootStackParamList = {
  Home: undefined;
  CreateCapsule: undefined;
  CapsuleDetail: {capsuleId: string};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
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
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: 'Dijital Kapsüllerim',
          headerTitleAlign: 'center',
        }}
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
    </Stack.Navigator>
  );
};

export default AppNavigator;
