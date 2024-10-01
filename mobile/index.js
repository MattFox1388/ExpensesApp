/**
 * @format
 */
import * as React from 'react';
import {AppRegistry} from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import App from './App';
import {name as appName} from './app.json';
import { registerRootComponent } from 'expo'


export default function Main() {
    return (
      <PaperProvider>
        <App />
      </PaperProvider>
    );
  }

registerRootComponent(Main);
