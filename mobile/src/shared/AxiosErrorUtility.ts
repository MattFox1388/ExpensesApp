import axios, {AxiosError} from 'axios';
import Toast from 'react-native-toast-message';

import {OuterAction} from '../contexts/UsersContext';

export function isForbiddenError(error: AxiosError): boolean {
  if (error.status === 403) return true;
  return false;
}

export function handleAxiosError(
  error: AxiosError,
  usersDispatch: React.Dispatch<OuterAction>,
) {
  if (isForbiddenError(error)) {
    usersDispatch({type: 'LOGOUT_USER'});
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'Please Login Again',
    });
  } else {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'Backend Api Call Failed',
    });
  }
}
