import axios from 'axios';
import React, { useState} from 'react';
import {Alert, Button, StyleSheet, Text, TextInput, View} from 'react-native';
import * as qs from 'querystringify';
import * as RootNavigation from '../../navigation/RootNavigation';
import Spinner from 'react-native-loading-spinner-overlay';
import { storeData } from '../../shared/StorageUtility';
import { useUsersContext } from '../../contexts/UsersContext';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [bufferScreen, setBufferScreen] = useState(false);
  const {state: usersState, dispatch: usersDispatch} = useUsersContext();

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
      usersDispatch({type: 'LOGOUT_USER'})
      RootNavigation.navigate('HomePage', {});
    } catch (error: any) {
      console.log(error)
      console.log(error.message)
      setBufferScreen(false)
    }
    setBufferScreen(false)
  }

  const backendLogin = () => {
    setBufferScreen(true);
    axios
      .post(
        process.env.EXPO_PUBLIC_BUDGET_API_URL + '/login',
        qs.stringify({
          username: username,
          password: password,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          timeout: 6000
        },
      )
      .then(async response => {
        console.log(response.data.token);
        //store token
        try {
          await storeData('login_token', response.data.token);
          usersDispatch({type: 'VERIFY_USER_LOGGED_IN'})
          console.log(`token: ${response.data.token}`)
          RootNavigation.navigate('HomePage', {});
        } catch (error) {
          const {message} = error as Error;
          console.error('err:' + error);
          setBufferScreen(false);
          showError(message);
        }
      })
      .catch(error => {
        if (error.response) {
          const errorJson = JSON.stringify(error.response.data);
          console.log('err1: ' + errorJson);
          showError(errorJson);
        } else if (error.request) {
          const requestJSON = JSON.stringify(error.request);
          console.log(error.message)
          console.log('err2: ' + requestJSON);
          showError(requestJSON);
        } else {
          const messageJson = JSON.stringify(error.message);
          console.log('err3: ' + messageJson);
        }
        setBufferScreen(false);
      });
  };

  if (usersState.username != null) {
    return (
      <View style={styles.container}>
        <Spinner textContent={'Loading...'} visible={bufferScreen} />
        <Text style={styles.text}>You are logged in as {usersState.username}!</Text>
        <View style={styles.buttonContainer}>
          <View >
            <Button title="Logout" onPress={backendLogout} color={'#2196F3'}/>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Spinner textContent={'Loading...'} visible={bufferScreen} />
      <View style={styles.rowContainer}>
        <Text style={styles.text}>Username:</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder='Username'
            style={styles.input}
            onChangeText={setUsername}
            value={username}
            autoCapitalize='none'
          />
        </View>
      </View>
      <View style={styles.rowContainer}>
        <Text style={styles.text}>Password:</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder='Password'
            style={styles.input}
            onChangeText={setPassword}
            secureTextEntry={true}
            value={password}
            autoCapitalize='none'
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <View >
          <Button title="Login" onPress={backendLogin} color={'#2196F3'}/>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button
        onPress={onPressCreateUser}
        title="Create user"
        color="#841584"
        />
      </View>
      <View style={{flex: 4}} />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  text: {
    flex: 1,
    color: 'black',
    marginTop: 18,
    paddingLeft: 10,
    alignItems: 'center',
    alignSelf: 'center'
  },
  buttonContainer: {
    flex: 1,
    marginTop: 10,
    minWidth: 100,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  inputContainer: {
    flex: 3,
    justifyContent: 'center',
    padding: 16,
  },
  container: {
    flex: 1,
    paddingTop: 10
  } ,
  buttonStyle: {
    backgroundColor: 'blue',
    padding: 12,
    alignItems: 'center',
    borderRadius: 4,
  }
});

