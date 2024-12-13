import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const getProjects = async () => {
  try {
    const token = await SecureStore.getItemAsync('token');
    const response = await axios.get(`${API_URL}/projects`, {
      headers: { authorization: `Bearer ${token}` },
    });
    return response.data.projects;
  } catch (error) {
    console.error(error);
    throw new Error('Error al obtener proyectos');
  }
};

const createProject = async (projectName, projectDescription) => {
  try {
    const token = await SecureStore.getItemAsync('token');
    await axios.post(
      `${API_URL}/projects`,
      { title: projectName, description: projectDescription},
      {
        headers: { authorization: `Bearer ${token}` },
      }
    );
  } catch (error) {
    console.error(error);
    throw new Error('Error al crear proyecto');
  }
};

const deleteProject = async (projectId) => {
  try {
    console.log("projectId", projectId)
    const token = await SecureStore.getItemAsync('token');
    await axios.delete(`${API_URL}/projects?projectId=${projectId}`, {
      headers: { authorization: `Bearer ${token}` },
    });

  } catch (error) {
    console.error(error);
    throw new Error('Error al eliminar proyecto');
  }
};
// ... otras funciones para manejar proyectos

export { getProjects, createProject, deleteProject};