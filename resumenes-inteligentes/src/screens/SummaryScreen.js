// src/screens/SummaryScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView} from 'react-native';
import { getSummary} from '../services/summaryServices';

const SummaryScreen = ({ route }) => {
  const { project: { _id: projectId} } = route.params || '';
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const summaryData = await getSummary(projectId);
        console.log("************************")
        console.log("summaryData", summaryData.summary)
        setSummary(summaryData.summary);
      } catch (error) {
        console.error(error);
        // Manejar el error, por ejemplo, mostrar un mensaje al usuario
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, [projectId]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {summary ? (
          <Text style={styles.SummaryText}>{summary}</Text>
        ) : (
          <Text>No se encontró ningún resumen</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  scrollView: {
    paddingHorizontal: 15, // Añadir padding horizontal al ScrollView para dar margen
  },
  SummaryText: {
    fontSize: 16,
    lineHeight: 24,  // Esto mejora la legibilidad
    marginVertical: 10, // Espaciado vertical entre párrafos
  },
});

export default SummaryScreen;