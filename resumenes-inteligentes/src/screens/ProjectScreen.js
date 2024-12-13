// src/screens/ProjectScreen.js
import React from "react";
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button, Title } from 'react-native-paper';
import { deleteProject } from '../services/projectService'; // Asegúrate de que la ruta sea correcta

const ProjectScreen = ({ navigation, route }) => {
  const { project } = route.params; // Accede a la información del proyecto
  const projectName = project.title; // Accede al nombre del proyecto
  const projectId = project._id; // Accede al id del proyecto

  const handleDelete = () => {
    // Mostrar una alerta de confirmación antes de eliminar el proyecto
    Alert.alert(
      "Confirmación",
      "¿Estás seguro de que deseas eliminar este proyecto?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar", 
          onPress: async () => {
            try {
              await deleteProject(projectId); // Llamamos a la función deleteProject pasando el id
              navigation.goBack(); // Regresar a la pantalla anterior después de eliminar
            } catch (error) {
              console.error("Error al eliminar el proyecto:", error);
              Alert.alert("Error", "Hubo un problema al eliminar el proyecto.");
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Title>{projectName}</Title>
      <Button
        mode="contained"
        onPress={() => navigation.navigate("AudioRecorder", { project })}
        style={styles.button}
      >
        Grabar audio
      </Button>
      <Button
        mode="contained"
        onPress={() => navigation.navigate("Transcripción", { project })}
        style={styles.button}
      >
        Ver transcripción
      </Button>
      <Button
        mode="contained"
        onPress={() => navigation.navigate("Resumen", { project })}
        style={styles.button}
      >
        Ver resumen
      </Button>
      <Button
        mode="contained"
        onPress={handleDelete}
        style={styles.button}
      >
        Eliminar proyecto
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  button: {
    marginVertical: 5,
  },
});

export default ProjectScreen;
