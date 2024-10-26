import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError } from 'axios';
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

  const validateUsername = (input: string): boolean => {
    /*
        Tests that username will have alphanumeric characters or 
        dot, dash, or underscore. Username must be 3-30 characters long.
    */
    const regex = /^[a-zA-Z0-9._-]{3,30}$/;
    return regex.test(input);
  };

  const validatePassword = (input: string): boolean => {
    /*
        Tests that password will have one uppercase character, 
        one special character, and 8+ characters total
    */
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
    return regex.test(input);
  };

  const handleCreateUser = async (): Promise<void> => {
    if (user.username.length === 0 || user.password.length === 0) {
      setError('Username and password are required');
      return;
    }

    if (!validateUsername(user.username)) {
      setError('Username must be 3-20 characters long and can only contain letters, numbers, dots, underscores, and hyphens');
      return;
    }

    if (!validatePassword(user.password)) {
      setError('Password must be at least 8 characters long, contain 1 uppercase letter, and 1 special character');
      return;
    }

    // If all validations pass, you can proceed with user creation
    // IMPORTANT: Ensure that server-side validation and parameterized queries are used
    console.log('Creating user:', user);
    const token = await AsyncStorage.getItem('login_token');
    try {
      const response = await axios({
        method: 'put',
        url: process.env.EXPO_PUBLIC_BUDGET_API_URL + '/users',
        data: {
          username: user.username,
          password: user.password
        },
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
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={user.username}
        onChangeText={handleInputChange('username')}
        autoCapitalize="none"
        maxLength={20}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={user.password}
        onChangeText={handleInputChange('password')}
        secureTextEntry
        maxLength={50}
        autoCapitalize='none'
      />
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
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: 'blue',
    padding: 12,
    alignItems: 'center',
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
  },
});