/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider as PaperProvider} from 'react-native-paper';
import {Provider as StoreProvider, useDispatch} from 'react-redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {store} from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import {COLORS} from './src/theme';
import {fetchCapsules} from './src/store/capsuleSlice';
import {AppDispatch} from './src/store';

const theme = {
  colors: {
    primary: COLORS.primary,
    accent: COLORS.secondary,
    background: COLORS.background,
    surface: COLORS.white,
    text: COLORS.text.primary,
    error: COLORS.error,
  },
};

const AppContent = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchCapsules());
  }, [dispatch]);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

function App(): React.JSX.Element {
  return (
    <StoreProvider store={store}>
      <PaperProvider theme={theme}>
        <SafeAreaProvider>
          <AppContent />
        </SafeAreaProvider>
      </PaperProvider>
    </StoreProvider>
  );
}

export default App;
