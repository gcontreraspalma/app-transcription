// src/AppNavigator.js
import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import ProjectsScreen from './screens/ProjectsScreen';
import ProjectScreen from './screens/ProjectScreen';
import { AuthContext } from './context/AuthContext';
import AudioRecorderScreen from './screens/AudioRecorderScreen'; // Importa AudioRecorderScreen
import TranscriptionScreen from './screens/TranscriptionScreen'
import SummaryScreen from './screens/SummaryScreen'
import HomeScreen from './screens/HomeScreen'; // Importa la nueva pantalla

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
          <Stack.Screen 
            name="Projects" 
            component={ProjectsScreen} 
            options={{ title: 'Lista de Proyectos' }} // Agrega opciones aquí
          />
          <Stack.Screen 
            name="Project" 
            component={ProjectScreen} 
            options={{ title: 'Proyecto' }} // Agrega opciones aquí
          />
          <Stack.Screen name="AudioRecorder" component={AudioRecorderScreen} />
          <Stack.Screen name="Transcripción" component={TranscriptionScreen} />
          <Stack.Screen name="Resumen" component={SummaryScreen} />
        </>
      ) : (
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ title: 'Iniciar Sesión' }} // Agrega opciones aquí
        />
      )}
    </Stack.Navigator>
    
  );
};

export default AppNavigator;