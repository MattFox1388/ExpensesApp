import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import * as RootNavigation from '../navigation/RootNavigation';
import { View } from 'react-native';

const LoginIcon: React.FC = () => {
  const navigateToLogin = () => {
    RootNavigation.navigate('LoginPage', {});
  };
  return (
    <View>
        <AntDesign name="login" size={24} color="white" onPress={navigateToLogin}/>
    </View>
  );
};

export default LoginIcon;
