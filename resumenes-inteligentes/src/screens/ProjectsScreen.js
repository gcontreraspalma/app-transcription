// src/screens/ProjectsScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useProjects } from '../context/ProjectsContext';
import ProjectList from '../components/ProjectList';
import ProjectForm from '../components/ProjectForm';
import { FAB } from 'react-native-paper'; 

const ProjectsScreen = () => {
  const navigation = useNavigation();
  const { projects, refreshProjects, createProject, deleteProject } = useProjects(); 
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  const handleCreateProject = async (projectName) => {
    try {
      await createProject(projectName);
      refreshProjects(); 
    } catch (error) {
      console.error(error);
    }
  };

  // Recargar la lista de proyectos cuando se regrese a esta pantalla
  useFocusEffect(
    React.useCallback(() => {
      refreshProjects(); // Refrescar proyectos cuando se enfoque la pantalla
    }, [])
  );

  const handleProjectPress = (project) => {
    navigation.navigate('Project', { project });
  };

  const handleDeleteProject = async (projectId) => {
    Alert.alert(
      "Confirmación",
      "¿Estás seguro de que deseas eliminar este proyecto?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await deleteProject(projectId); // Llamar la función deleteProject desde el contexto
              refreshProjects(); // Refrescar la lista después de eliminar
              navigation.goBack(); // Regresar a la lista de proyectos
            } catch (error) {
              console.error("Error al eliminar el proyecto:", error);
              Alert.alert("Error", "Hubo un problema al eliminar el proyecto.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {isCreatingProject ? (
        <ProjectForm onClose={() => setIsCreatingProject(false)} onCreate={handleCreateProject} /> 
      ) : (
        <>
          <ProjectList 
            projects={projects} 
            onPress={handleProjectPress} 
          />
          <FAB
            style={styles.fab}
            icon="plus"
            onPress={() => setIsCreatingProject(true)}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default ProjectsScreen;
