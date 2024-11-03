import { useState, useEffect } from 'react';
import { MonthStatResponse } from '../../types/MonthStatResponse';
import { getMonthStats } from '../services/MonthStatService';
import { useUsersContext } from '../contexts/UsersContext';
import { handleAxiosError } from '../shared/AxiosErrorUtility';
import axios from 'axios';

export const useMonthStats = () => {
  const [monthStatData, setMonthStatData] = useState<MonthStatResponse[]>([]);
  const [selectListData, setSelectListData] = useState<{key: number; value: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { state: usersState, dispatch: usersDispatch } = useUsersContext();

  useEffect(() => {
    const fetchMonthStats = async () => {
      setIsLoading(true);
      try {
        const data = await getMonthStats(usersState.username || "");
        setMonthStatData(data);
        setSelectListData(
          data.map((row, index) => ({
            key: index,
            value: `${row.month_id}/${row.year_num}`
          }))
        );
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          handleAxiosError(error, usersDispatch);
        } else {
          console.error(error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMonthStats();
  }, [usersState.username, usersDispatch]);

  return { monthStatData, selectListData, isLoading };
};