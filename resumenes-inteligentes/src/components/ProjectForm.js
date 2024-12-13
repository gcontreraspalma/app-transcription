// src/components/ProjectForm.js
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useProjects } from '../context/ProjectsContext';

const ProjectForm = ({ onClose }) => { // Agrega la prop onClose
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createProject } = useProjects(); 

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await createProject(projectName, projectDescription);
      setProjectName('');
      setProjectDescription('');
      onClose(); // Llama a la función onClose para cerrar el formulario
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        label="Nombre del proyecto"
        value={projectName}
        onChangeText={setProjectName}
      />
      <TextInput
        style={[styles.input, styles.descriptionInput]}
        label="Descripción (opcional)"
        value={projectDescription}
        onChangeText={setProjectDescription}
        multiline
      />
      <Button mode="contained" onPressIn={handleSubmit} disabled={isSubmitting}> {/* Usa onPressIn */}
        Crear proyecto
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    marginBottom: 10,
  },
  descriptionInput: {
    height: 80,
  },
});

export default ProjectForm;