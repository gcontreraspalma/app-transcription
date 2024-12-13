import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    console.log(response.data);
    await SecureStore.setItemAsync('token', response.data.token); // Guarda el token
  } catch (error) {
    console.error(error);
    throw new Error('Error al iniciar sesión');
  }
};

// ... otras funciones de autenticación como logout, register, etc.

export { login };