import React, { useState } from 'react';
import { View, StyleSheet, Image} from 'react-native';
import { Button, TextInput } from 'react-native-paper';

import { useAuth } from '../context/AuthContext';
const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (error) {
      console.error(error);
      // Mostrar mensaje de error al usuario
    }
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/logo.webp')}  // Ruta de tu archivo en assets
        style={styles.logo}  // Estilos para la imagen
      />
      <TextInput
        style={styles.input}
        label="Correo electrónico" 
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        label="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button mode="contained" onPress={handleLogin}>
        Iniciar sesión
      </Button> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default Login;