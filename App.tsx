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
import {store} from './src/store';
import Navigation from './src/navigation';
import {COLORS} from './src/theme';

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
          <Navigation />
        </SafeAreaProvider>
      </PaperProvider>
    </StoreProvider>
  );
}

export default App;
