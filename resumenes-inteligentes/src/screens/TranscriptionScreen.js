import React, { useState, useEffect }  from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { getTranscription } from '../services/transcriptionServices';

const TranscriptionScreen = ({ route }) => {
  const { project: { _id: projectId} } = route.params || '';
  const [transcription, setTranscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTranscription = async () => {
      try {
        const transcriptionData = await getTranscription(projectId);
        const formattedTranscription = transcriptionData.replace(/(?<=\.\s)(?=[A-Z])/g, '\n\n') // Añadir saltos de línea después de cada punto
                                                        .replace(/(¿[A-Za-z\s]+[\?¿¡!])/g, '\n\n$1') // Añadir salto de línea antes de preguntas
                                                        .replace(/(¡[A-Za-z\s]+[!¡?])/g, '\n\n$1'); // Añadir salto de línea antes de exclamaciones
        setTranscription(formattedTranscription);
      } catch (error) {
        console.error(error);
        // Manejar el error, por ejemplo, mostrar un mensaje al usuario
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranscription();
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
      {
          transcription ? (
            <Text style={styles.transcriptionText}>{transcription}</Text>
          ) : (
            <Text>No hay transcripción disponible</Text>
          )
        }
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
  transcriptionText: {
    fontSize: 16,
    lineHeight: 24,  // Esto mejora la legibilidad
    marginVertical: 10, // Espaciado vertical entre párrafos
  },
});

export default TranscriptionScreen;