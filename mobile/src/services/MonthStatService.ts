import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MonthStatResponse } from '../../types/MonthStatResponse';

const BUDGET_API_URL = process.env.EXPO_PUBLIC_BUDGET_API_URL || '';

export const getMonthStats = async (username: string): Promise<MonthStatResponse[]> => {
  const token = await AsyncStorage.getItem('login_token');
  const response = await axios.get(`${BUDGET_API_URL}/month-stats/user/${username}`, {
    headers: {
      'Authorization': `Bearer ${token}` 
    },
    timeout: 8000,
  });
  return response.data['month_stats'];
};