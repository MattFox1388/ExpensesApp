import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode, JwtPayload} from 'jwt-decode';

interface CustomJwtPayload extends JwtPayload {
  user: string;
}

export const isUserLoggedIn = async (): Promise<string | null> => {
  const token = await AsyncStorage.getItem('login_token');
  if (token == null) return null;
  const tokenPayload = jwtDecode<CustomJwtPayload>(token);
  let username = null;
  if (isBearerTokenValid(tokenPayload)) {
    username = tokenPayload.user;
  }
  return username;
};

const isBearerTokenValid = (tokenPayload: JwtPayload): boolean => {
  // Returns with the JwtPayload type
  const nowInSeconds = Math.floor(Date.now() / 1000);
  if (tokenPayload.exp !== undefined && tokenPayload.exp > nowInSeconds) return true;
  return false;
};
