// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import { login as LoginServices } from '../services/authServices';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verifica si hay un token almacenado al iniciar la aplicación
    const checkLoggedIn = async () => {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        // Si hay un token, obtén la información del usuario (puedes hacer una petición a la API)
        // ...
        setUser({ /* ... información del usuario */ });
      }
    };
    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      await LoginServices(email, password); // Llama a la función login del servicio
      // Obtén la información del usuario después de iniciar sesión
      // ...
      setUser({ /* ... información del usuario */ });
    } catch (error) {
      console.error(error);
      throw error; // Re-lanza el error para manejarlo en el componente
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
// Define la función useAuth
const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Exporta AuthContext, AuthProvider y useAuth
export { AuthContext, AuthProvider, useAuth };

