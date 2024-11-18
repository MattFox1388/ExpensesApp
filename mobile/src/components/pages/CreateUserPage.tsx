import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as RootNavigation from '../../navigation/RootNavigation';

interface User {
  username: string;
  password: string;
}

export const CreateUserPage: React.FC = () => {
  const [user, setUser] = useState<User>({ username: '', password: '' });
  const [error, setError] = useState<string>('');

  const validateUsername = (input: string): boolean => /^[a-zA-Z0-9._-]{3,30}$/.test(input);
  const validatePassword = (input: string): boolean => /^(?=.*[A-Z])(?=.*[!@#$%^&*=])(?=.{8,100})/.test(input);

  const handleCreateUser = async (): Promise<void> => {
    if (user.username === '' || user.password === '') {
      setError('Username and password are required');
      return;
    }

    if (!validateUsername(user.username)) {
      setError('Username must be 3-20 characters and may contain letters, numbers, dots, underscores, or hyphens');
      return;
    }

    if (!validatePassword(user.password)) {
      setError('Password must be at least 8 characters, include 1 uppercase letter, and 1 special character (!,@,#,$,%,^,&,*)');
      return;
    }

    const token = await AsyncStorage.getItem('login_token');
    try {
      const response = await axios.put(process.env.EXPO_PUBLIC_BUDGET_API_URL + '/users', {
        username: user.username,
        password: user.password
      }, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          'Authorization': `Bearer ${token}`
        }
      });
      RootNavigation.navigate('HomePage', {});
    } catch (error: any) {
      console.log(error.message);
      setError('User Could Not Be Created.');
    }
  };

  const handleInputChange = (field: keyof User) => (value: string): void => {
    setUser(prevUser => ({ ...prevUser, [field]: value }));
    if (error) setError(''); // Clear error message on input change
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create a New Account</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={user.username}
          onChangeText={handleInputChange('username')}
          autoCapitalize="none"
          maxLength={20}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={user.password}
          onChangeText={handleInputChange('password')}
          secureTextEntry
          maxLength={50}
          autoCapitalize='none'
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleCreateUser}>
        <Text style={styles.buttonText}>Create User</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
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
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  input: {
    height: 45,
    fontSize: 16,
    color: '#333',
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
  errorText: {
    color: '#D9534F',
    textAlign: 'center',
    marginVertical: 10,
  },
});