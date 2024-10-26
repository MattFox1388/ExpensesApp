/**
 * @format
 */
import * as React from 'react';
import {AppRegistry} from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import App from './App';
import { registerRootComponent } from 'expo'
import {UsersProvider} from '../mobile/src/contexts/UsersContext'

export default function Main() {
    return (
      <PaperProvider>
        <UsersProvider>
          <App />
        </UsersProvider>
      </PaperProvider>
    );
  }

registerRootComponent(Main);
