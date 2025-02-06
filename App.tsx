/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import {Provider as StoreProvider} from 'react-redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {store} from './src/store';
import Navigation from './src/navigation';
import {COLORS} from './src/theme';
import {AuthProvider} from './src/context/AuthContext';
import CustomAlertComponent from './src/components/CustomAlert';

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

function App(): React.JSX.Element {
  return (
    <StoreProvider store={store}>
      <PaperProvider theme={theme}>
        <SafeAreaProvider>
          <NavigationContainer>
            <AuthProvider>
              <Navigation />
              <CustomAlertComponent />
            </AuthProvider>
          </NavigationContainer>
        </SafeAreaProvider>
      </PaperProvider>
    </StoreProvider>
  );
}

export default App;
