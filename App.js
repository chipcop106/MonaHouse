import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import RootStack from './src/routes';
import { Provider as AuthProvider } from './src/context/AuthContext';
import { Provider as MotelProvider } from './src/context/MotelContext';
import { default as mapping } from './custom-mapping.json';
const App = () => (
  <RootStack />
);


export default () => (
  <>
    <IconRegistry icons={EvaIconsPack} />
    <ApplicationProvider 
    {...eva} 
    theme={eva.light}
    customMapping={mapping}
    >
      <AuthProvider>
        <MotelProvider>
          <App />
        </MotelProvider>
      </AuthProvider>
    </ApplicationProvider>
  </>
);
