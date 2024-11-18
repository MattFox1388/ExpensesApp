import axios from 'axios';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import * as qs from 'querystringify';
import * as RootNavigation from '../../navigation/RootNavigation';
import Spinner from 'react-native-loading-spinner-overlay';
import { storeData } from '../../shared/StorageUtility';
import { useUsersContext } from '../../contexts/UsersContext';
import { MaterialIcons } from '@expo/vector-icons';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [bufferScreen, setBufferScreen] = useState(false);
  const { state: usersState, dispatch: usersDispatch } = useUsersContext();

  const showError = (error: string) => {
    Alert.alert('Login Error', error);
  };

  const onPressCreateUser = () => {
    RootNavigation.navigate('CreateUserPage', {});
  }

  const backendLogout = async () => {
    setBufferScreen(true);
    try {
      await storeData('login_token', "");
      usersDispatch({ type: 'LOGOUT_USER' });
      RootNavigation.navigate('HomePage', {});
    } catch (error: any) {
      console.log(error.message);
    }
    setBufferScreen(false);
  }

  const backendLogin = () => {
    setBufferScreen(true);
    axios
      .post(
        process.env.EXPO_PUBLIC_BUDGET_API_URL + '/login',
        qs.stringify({ username, password }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 6000 }
      )
      .then(async response => {
        try {
          await storeData('login_token', response.data.token);
          usersDispatch({ type: 'VERIFY_USER_LOGGED_IN' });
          RootNavigation.navigate('HomePage', {});
        } catch (error) {
          showError(error.message);
          setBufferScreen(false);
        }
      })
      .catch(error => {
        showError(error.message);
        setBufferScreen(false);
      });
  };

  if (usersState.username != null) {
    return (
      <View style={styles.container}>
        <Spinner textContent={'Loading...'} visible={bufferScreen} />
        <Text style={styles.welcomeText}>Welcome, {usersState.username}!</Text>
        <TouchableOpacity style={styles.button} onPress={backendLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Spinner textContent={'Loading...'} visible={bufferScreen} />
      <Text style={styles.header}>Login to Your Account</Text>
      <View style={styles.inputContainer}>
        <MaterialIcons name="person" size={24} color="#555" />
        <TextInput
          placeholder="Username"
          style={styles.input}
          onChangeText={setUsername}
          value={username}
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputContainer}>
        <MaterialIcons name="lock" size={24} color="#555" />
        <TextInput
          placeholder="Password"
          style={styles.input}
          onChangeText={setPassword}
          secureTextEntry
          value={password}
          autoCapitalize="none"
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={backendLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.createButton} onPress={onPressCreateUser}>
        <Text style={styles.createButtonText}>Create a New Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginVertical: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: '#e1f5fe',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '600',
  },
  welcomeText: {
    fontSize: 20,
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
});