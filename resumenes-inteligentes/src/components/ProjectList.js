// src/components/ProjectList.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { List } from 'react-native-paper';

const ProjectList = ({ projects, onPress }) => {
  return (
    <ScrollView>
      <List.Section>
        <List.Subheader>Proyectos</List.Subheader>
        {projects.map((project) => (
          <List.Item
            key={project._id}
            title={project.title}
            onPress={() => onPress(project)} // Navegar a la pantalla del proyecto
          />
        ))}
      </List.Section>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default ProjectList;
