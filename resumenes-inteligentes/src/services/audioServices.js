// src/services/audioService.js

import { Audio } from 'expo-av';

import * as FileSystem from 'expo-file-system'; // Asegúrate de que esta línea esté presente

import { Alert } from 'react-native'





const recordingsDirectory = `${FileSystem.documentDirectory}recordings/`;



// Función para iniciar la grabación

export const startRecording = async (

  setRecording,

  setIsRecording,

  startTimer,

) => {

  try {

    console.log("Requesting permissions..");

    const { status } = await Audio.requestPermissionsAsync();

    if (status !== "granted") {

      console.error("Permissions not granted!");

      return;

    }



    await Audio.setAudioModeAsync({

      allowsRecordingIOS: true,

      playsInSilentModeIOS: true,

    });

    console.log("Starting recording..");

    const { recording } = await Audio.Recording.createAsync(

      Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY,

    );

    setRecording(recording);

    setIsRecording(true);

    startTimer();

    console.log("Recording started");

  } catch (err) {

    console.error("Failed to start recording", err);

    // Mostrar un mensaje de error al usuario

  }

};



// Función para detener la grabación

export const stopRecording = async (

  recording,

  setIsRecording,

  stopTimer,

  setRecordings,

  recordings,

  projectId, // Agrega el ID del proyecto

) => {

  try {

    console.log("Stopping recording..");

    stopTimer();

    setIsRecording(false);



    const uri = recording.getURI();

    console.log("Recording stopped and stored at", uri);



    await recording.stopAndUnloadAsync();



    // Obtener el audio en formato base64

    const base64 = await FileSystem.readAsStringAsync(uri, {

      encoding: FileSystem.EncodingType.base64,

    });



    // Asegurar que el directorio de grabaciones del proyecto exista

    await ensureProjectRecordingsDirectoryExists(projectId);



    // Generar el nombre del archivo

    const filename = `${getProjectRecordingsDirectory(projectId)}${Date.now()}.m4a`;



    // Guardar el archivo en la carpeta del proyecto

    await FileSystem.writeAsStringAsync(filename, base64, {

      encoding: FileSystem.EncodingType.Base64,

    });



    // Actualizar la lista de grabaciones

    setRecordings([...recordings, filename]);



    Alert.alert(

      "Grabación guardada",

      `La grabación se ha guardado en ${filename}`,

    );

  } catch (error) {

    console.error("Error al detener la grabación:", error);

  }

};



// Función para reproducir el sonido

export const playSound = async (recording, setSound, setIsSoundPlaying) => {

  if (!recording) {

    console.warn('No hay grabación disponible para reproducir');

    return;

  }



  try {

    console.log('Loading sound');

    const { sound } = await Audio.Sound.createAsync({

      uri: recording.getURI(),

    });

    setSound(sound);

    setIsSoundPlaying(true);



    console.log('Playing sound');

    await sound.playAsync();

  } catch (error) {

    console.error('Error playing sound', error);

  }

};



// Función para detener la reproducción

export const stopSound = async (sound, setIsSoundPlaying) => {

  try {

    console.log('Stopping sound');

    await sound.stopAsync();

    setIsSoundPlaying(false);

  } catch (error) {

    console.error('Error stopping sound', error);

  }

};



export const deleteRecording = async (

  filename,

  setRecordings,

  recordings,

) => {

  try {

    console.log("Eliminando archivo:", filename);

    await FileSystem.deleteAsync(filename);

    setRecordings(recordings.filter((item) => item !== filename));

    Alert.alert(

      "Grabación eliminada",

      `La grabación ${filename} ha sido eliminada.`,

    );

  } catch (error) {

    console.error("Error al eliminar la grabación:", error);

    Alert.alert("Error", "No se pudo eliminar la grabación.");

  }

};





const ensureRecordingDirectoryExists = async () => {

  const dirInfo = await FileSystem.getInfoAsync(recordingsDirectory);

  if (!dirInfo.exists) {

    console.log(`Creating recordings directory at ${recordingsDirectory}`);

    await FileSystem.makeDirectoryAsync(recordingsDirectory, { intermediates: true });

  }

};

// Función para obtener la ruta del directorio de grabaciones para un proyecto

export const getProjectRecordingsDirectory = (projectId) => {

  return `${FileSystem.documentDirectory}recordings/${projectId}/`;

};

// Función para asegurar que el directorio de grabaciones del proyecto exista

export const ensureProjectRecordingsDirectoryExists = async (projectId) => {

  const projectRecordingsDirectory = getProjectRecordingsDirectory(projectId);

  const dirInfo = await FileSystem.getInfoAsync(projectRecordingsDirectory);

  if (!dirInfo.exists) {

    console.log(

      `Creating project recordings directory at ${projectRecordingsDirectory}`,

    );

    await FileSystem.makeDirectoryAsync(projectRecordingsDirectory, {

      intermediates: true,

    });

  }

};