// src/App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './context/AuthContext';
import { ProjectsProvider } from './context/ProjectsContext'; // Importa ProjectsProvider
import { Provider as PaperProvider } from 'react-native-paper';

import AppNavigator from './AppNavigator'; // Tu componente de navegación principal
const theme = {
};
const App = () => {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <ProjectsProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </ProjectsProvider>
      </AuthProvider>
    </PaperProvider>

  );
};

export default App;