// src/services/summaryService.js
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const getSummary = async (projectId) => { // Asumiendo que necesitas un audioId para obtener el resumen
  try {
    const token = await SecureStore.getItemAsync('token');
    
    console.log("url", `${API_URL}/summary?projectId=${projectId}`)
    const response = await axios.get(`${API_URL}/summary?projectId=${projectId}`, {
      headers: { authorization: `Bearer ${token}` },
    });
    console.log("response.data", response.data)
    return response.data.summary; 
  } catch (error) {
    console.error(error);
    console.error(error.data);
    throw new Error('Error al obtener el resumen');
  }
};

export { getSummary };