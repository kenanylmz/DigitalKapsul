import React from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import {Provider as StoreProvider} from 'react-redux';
import {store} from './store';
import Navigation from './navigation';
import {theme} from './theme';

const App = () => {
  return (
    <StoreProvider store={store}>
      <PaperProvider theme={theme}>
        <Navigation />
      </PaperProvider>
    </StoreProvider>
  );
};

export default App; 