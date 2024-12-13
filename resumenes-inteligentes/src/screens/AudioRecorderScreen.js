import React from 'react';
import { View, StyleSheet } from 'react-native';
import AudioRecorder from '../components/AudioRecorder'; // Importa el componente AudioRecorder
  
const AudioRecorderScreen = ({ route }) => { // Agrega route como argumento
  return (
    <View style={styles.container}>
      <AudioRecorder route={route} />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AudioRecorderScreen;