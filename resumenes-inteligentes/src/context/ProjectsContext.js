// src/context/ProjectsContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getProjects as getProjectsService, createProject as createProjectService } from '../services/projectService';

const ProjectsContext = createContext();

const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsData = await getProjectsService();
        setProjects(projectsData);
      } catch (error) {
        console.error(error);
        // Manejar el error, por ejemplo, mostrar un mensaje al usuario
      }
    };
    fetchProjects();
  }, []);

  const getProjects = async () => { // Esta función ahora se llama "refreshProjects"
    try {
      const projectsData = await getProjectsService();
      setProjects(projectsData);
    } catch (error) {
      console.error(error);
      // Manejar el error, por ejemplo, mostrar un mensaje al usuario
    }
  };

  const createProject = async (projectName, projectDescription) => {
    try {
      await createProjectService(projectName, projectDescription);
      // No llames automáticamente a `getProjects` aquí si el formulario ya gestiona la lista.
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      // Llama a `getProjects` aquí si el formulario ya gestiona la lista.
      // Por ejemplo, si el formulario maneja la lista de proyectos.
      getProjects();
    }
  };

  // ... otras funciones para manejar proyectos (editar, eliminar, etc.)

  return (
    <ProjectsContext.Provider value={{ projects, refreshProjects: getProjects, createProject }}>
      {children}
    </ProjectsContext.Provider>
  );
};

// Define la función useProjects
const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
};


export { ProjectsContext, ProjectsProvider, useProjects };