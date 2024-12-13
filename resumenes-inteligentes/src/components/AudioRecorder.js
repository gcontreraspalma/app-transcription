import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme, List } from "react-native-paper";
import {
  startRecording,
  stopRecording,
  playSound,
  stopSound,
  deleteRecording,
  getProjectRecordingsDirectory,
  ensureProjectRecordingsDirectoryExists,
} from "../services/audioServices";
import * as FileSystem from "expo-file-system";
import { makeTranscription } from '../services/transcriptionServices'; // Importa la función para transcripción

const AudioRecorder = ({ route }) => {
  const { project: { _id: projectId } = {} } = route.params;
  const { colors } = useTheme();
  const [recording, setRecording] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const [sound, setSound] = useState();
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [currentPlaying, setCurrentPlaying] = useState(null); // Para controlar la reproducción actual
  const soundRef = useRef(null); // Referencia al objeto de sonido

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prevDuration) => prevDuration + 1);
      }, 1000);
    } else {
      clearInterval(interval);
      setRecordingDuration(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    return () => {
      if (recording) {
        stopRecording(
          recording,
          setIsRecording,
          stopTimer,
          setRecordings,
          recordings,
          projectId
        );
      }
    };
  }, [recording]);

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const projectRecordingsDirectory =
          getProjectRecordingsDirectory(projectId);
        await ensureProjectRecordingsDirectoryExists(projectId);
        const files = await FileSystem.readDirectoryAsync(
          projectRecordingsDirectory
        );
        const audioFiles = files.filter((file) => file.endsWith(".m4a"));
        setRecordings(audioFiles);
      } catch (error) {
        console.error("Error al obtener las grabaciones:", error);
      }
    };

    fetchRecordings();
  }, [projectId]);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        console.log("Unloading Sound");
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    };
  }, [currentPlaying]);

  const startTimer = () => {
    setIsRecording(true);
    setRecordingDuration(0);
  };

  const stopTimer = () => {
    setIsRecording(false);
    setRecordingDuration(0);
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedTime = `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
    return formattedTime;
  };

  const stopCurrentSound = async () => {
    if (soundRef.current) {
      try {
        console.log("Stopping current sound");
        await soundRef.current.stopAsync();  // Detener el sonido actual
        soundRef.current = null;  // Limpiar la referencia para evitar interferencias
        setIsSoundPlaying(false);  // Asegurarse de que el estado se actualice
      } catch (error) {
        console.error("Error al detener el sonido actual:", error);
      }
    }
  };

  const handlePlayPause = async (item) => {
    const soundUri = `${getProjectRecordingsDirectory(projectId)}${item}`;
    console.log("isSoundPlaying", isSoundPlaying);

    if (currentPlaying === item && soundRef.current) {
      // Si el mismo audio se está reproduciendo, alternar entre pausar y reanudar
      if (isSoundPlaying) {
        console.log("Pausing sound");
        await soundRef.current.pauseAsync();
        setIsSoundPlaying(false);
      } else {
        console.log("Resuming sound");
        await soundRef.current.playAsync();
        setIsSoundPlaying(true);
      }
    } else {
      // Detener el sonido actual y reproducir el nuevo
      await stopCurrentSound();

      try {
        // Si el sonido es diferente, cargar y reproducir el nuevo sonido
        console.log("Loading and playing new sound");

        // Asegurarse de que no recargue un sonido si ya está en reproducción
        if (soundRef.current) {
          await soundRef.current.stopAsync();
        }

        const newSound = await playSound(soundUri, setSound, setIsSoundPlaying);

        setCurrentPlaying(item);
        soundRef.current = newSound;  // Asignar el nuevo sonido a la referencia
      } catch (error) {
        console.error("Error al reproducir el sonido:", error);
      }
    }
  };

  const handleTranscription = async (item) => {
    const soundUri = `${getProjectRecordingsDirectory(projectId)}${item}`;
    try {
      console.log("Generating transcription for:", soundUri);
      await makeTranscription(soundUri, projectId);
      alert("Transcripción generada correctamente.");
    } catch (error) {
      console.error("Error al generar la transcripción:", error);
      alert("Error al generar la transcripción.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.recorderContainer}>
        <TouchableOpacity
          style={[
            styles.recordButton,
            { backgroundColor: isRecording ? colors.error : colors.primary },
          ]}
          onPress={
            isRecording
              ? () =>
                  stopRecording(
                    recording,
                    setIsRecording,
                    stopTimer,
                    setRecordings,
                    recordings,
                    projectId
                  )
              : () => startRecording(setRecording, setIsRecording, startTimer)
          }
        >
          <Ionicons
            name={isRecording ? "stop-circle" : "mic"}
            size={80}
            color="white"
          />
        </TouchableOpacity>
        <Text style={styles.timerText}>{formatDuration(recordingDuration)}</Text>
      </View>
      {isRecording && <Text style={styles.recordingText}>Grabando...</Text>}

      <FlatList
        data={recordings}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <List.Item
            title={item.replace(getProjectRecordingsDirectory(projectId), "")}
            right={() => (
              <>
                <TouchableOpacity
                  onPress={() => deleteRecording(item, setRecordings, recordings)}
                >
                  <Ionicons name="trash" size={24} color={colors.error} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleTranscription(item)} // Agregar botón de transcripción
                  style={{ marginLeft: 10 }}
                >
                  <Ionicons name="document-text" size={24} color={colors.primary} />
                </TouchableOpacity>
              </>
            )}
            left={() => (
              <TouchableOpacity onPress={() => handlePlayPause(item)}>
                <Ionicons
                  name={
                    currentPlaying === item && isSoundPlaying
                      ? "pause-circle"
                      : "play-circle"
                  }
                  size={24}
                  color={colors.primary}
                />
              </TouchableOpacity>
            )}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  recorderContainer: {
    alignItems: "center",
  },
  recordButton: {
    padding: 20,
    borderRadius: 100,
    marginBottom: 20,
  },
  timerText: {
    fontSize: 30,
    fontWeight: "bold",
  },
  recordingText: {
    fontSize: 16,
    color: "red",
  },
});

export default AudioRecorder;
