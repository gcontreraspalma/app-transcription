import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Groq from "groq-sdk";
import * as FileSystem from 'expo-file-system'; // Asegúrate de que esta línea esté presente
import { Asset } from 'expo-asset';

/* const makeTranscription = async(recordUri, projectId) => {
  try {
    // Carga el archivo estático desde la carpeta /assets/audio
    const fileUri = await resolveAsset();
    console.log("Archivo resuelto URI:", fileUri)
    console.log("Archivo estático URI:", fileUri);

    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    console.log("FileInfo", fileInfo);

    if (fileInfo.exists) {
      const formData = new FormData();  

      // Agregar el archivo al FormData
      formData.append('file', {
        uri: fileUri,
        type: 'audio/mpeg',  // Tipo MIME adecuado
        name: 'sample.m4a',  // Nombre del archivo
      });

      formData.append('model', 'whisper-large-v3');
      formData.append('prompt', 'Esta es una clase');
      formData.append('response_format', 'json');
      formData.append('language', 'es');
      formData.append('temperature', '0.0');

      const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.EXPO_PUBLIC_GROQ_API_KEY}`,
        },
        body: formData,
      });

      const transcription = await response.json();
      console.log("Transcripción", transcription);

      const resultSaveTranscription = await uploadTranscription(projectId, transcription.text);
      console.log("Resultado de la transcripción guardada", resultSaveTranscription);
    }
  } catch (error) {
    console.error("Error al hacer la transcripción:", error);
  }
}; */
const API_URL = process.env.EXPO_PUBLIC_API_URL;

const getTranscription = async (projectId) =>{
    try {
        const token = await SecureStore.getItemAsync('token');
        const response = await axios.get(`${API_URL}/transcriptions?projectId=${projectId}`, {
          headers: { authorization: `Bearer ${token}` },
        });
        return response.data.transcription.text;
      } catch (error) {
        console.error(error);
        throw new Error('Error al obtener transcripciones');
      }
};

const uploadTranscription = async (projectId, transcription) => {
    try {
        console.log("Transcription", transcription)
        console.log("ProjectId", projectId)
        const token = await SecureStore.getItemAsync('token');
        await axios.post(
          `${API_URL}/transcriptions`,
          { projectId: projectId, transcription: transcription},
          {
            headers: { authorization: `Bearer ${token}` },
          }
        );
      } catch (error) {
        console.error(error);
        throw new Error('Error al crear transcripcion');
      }
};

 const makeTranscription = async (recordUri, projectId) => {
  try {
    // Leer el archivo como un stream usando expo-file-system
    const fileUri = recordUri; // La URI del archivo que quieres transcribir (file://...)/ La URI del archivo que quieres transcribir (file://...)
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    const audioContent = await loadAudioFile(recordUri);
    if (!fileInfo.exists) {
      console.error("El archivo no existe en la ruta especificada:", fileUri);
      return;
    }
    console.log("FileInfo", fileInfo);
    console.log("projectId", projectId)
    if (fileInfo.exists) {
      const formData = new FormData();

      // Agregar el archivo al FormData
      formData.append('file', {
        uri: fileUri,
        type: 'audio/mp4',  // Tipo MIME adecuado
        name: 'audio.m4a',   // Nombre del archivo

      });


      formData.append('model', 'whisper-large-v3');
      formData.append('prompt', 'Esta es una clase');
      formData.append('response_format', 'json');
      formData.append('language', 'es');
      formData.append('temperature', '0.0');
      const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.EXPO_PUBLIC_GROQ_API_KEY}`,
        },
        body: formData,
      });

      const transcription = await response.json();
      console.log("Transcripción", transcription);

      const resultSaveTranscription = await uploadTranscription(projectId, transcription.text);
      console.log("Resultado de la transcripción guardada", resultSaveTranscription);
    }
  } catch (error) {
    console.error("Error al hacer la transcripción:", error);
  }
};


// Función para leer el archivo de audio y cargarlo en una variable
const loadAudioFile = async (fileUri) => {
  try {
    // Lee el archivo de audio en formato Base64
    const fileContent = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Puedes almacenar este contenido en una variable para usarlo más tarde
    return fileContent;
  } catch (error) {
    console.error('Error al leer el archivo de audio:', error);
  }
};
export { getTranscription, uploadTranscription, makeTranscription}
const resolveAsset = async () => {
  const asset = Asset.fromModule(require('../../assets/audio/sample.m4a'));
  await asset.downloadAsync();
  return asset.localUri || asset.uri;
};