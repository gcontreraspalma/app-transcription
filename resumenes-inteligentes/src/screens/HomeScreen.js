import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Button, Text, Title, useTheme } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';

const HomeScreen = ({ navigation }) => {
  const { logout, user } = useContext(AuthContext);
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.frame, { backgroundColor: colors.surface }]}>
        <Avatar.Image
          size={80}
          source={{ uri: user?.photoURL || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' }}
          style={styles.avatar}
        />
        <Title style={styles.title}>¡Hola!</Title>
        <Text style={styles.subtitle}>Bienvenido a Resúmenes Inteligentes</Text>

        <Button
          mode="contained"
          onPress={() => navigation.navigate('Projects')}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Ver proyectos
        </Button>

        <Button
          mode="contained"
          onPress={logout}
          style={[styles.button, { backgroundColor: 'red' }]}
          labelStyle={styles.buttonLabel}
        >
          Cerrar sesión
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  frame: {
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    alignItems: 'center',
  },
  avatar: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  button: {
    marginTop: 10, 
  },
  buttonLabel: {
    color: 'white',
  },
});

export default HomeScreen;