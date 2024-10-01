import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {SelectList} from 'react-native-dropdown-select-list';
import {MonthStatResponse} from '../../../types/MonthStatResponse';
import {MonthStats} from './MonthStats';
import axios from 'axios';
import {AxiosError} from 'axios';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const FindMonthPage: React.FC = () => {
  const [monthStatData, setMonthStatData] = useState<MonthStatResponse[]>([]);
  const [selectListData, setSelectListData] = useState<
    {key: number; value: string}[]
  >([]);
  const [selected, setSelected] = React.useState<number | null>(null);
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    const getMonthStat = async () => {
      console.log('getMonthStat() called');
      const token = await AsyncStorage.getItem('login_token');

      try {
        //axios get request with 
        setShowSpinner(true);
        const response = await axios.get(process.env.BUDGET_API_URL + '/get_month_stats', {
          params: {token: token},
          timeout: 8000,
        });
        const data: MonthStatResponse[] = response.data['month_stats'];
        console.log('data len: ' + response.data['month_stats'].length);
        setMonthStatData(data);
        setSelectListData(
          data.map((row, index) => {
            console.log(`data: ${data}`);
            return {key: index, value: row.month_id + '/' + row.year_num};
          }),
        );
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          console.log('axios error: ' + axiosError);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: "Are you sure you're logged in?"
          });
        }
      }
      setShowSpinner(false);
    };

    getMonthStat();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerLabel}>Select Month: </Text>
        {monthStatData ? (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          <SelectList
            data={selectListData}
            save="key"
            onSelect={() => console.log(selected)}
            setSelected={(val: React.SetStateAction<number | null>) =>
              setSelected(val)
            }
            defaultOption={{key: null, value: null}}
            dropdownTextStyles={styles.inputStyles}
            inputStyles={styles.inputStyles}
          />
        ) : (
          <ActivityIndicator size="large" />
        )}
      </View>
      <View style={styles.monthContainer}>
        {selected != null ? (
          <View>
            <Text style={styles.monthLabel}>
              Month: {monthStatData[selected].month_id.toString()} Year:{' '}
              {monthStatData[selected].year_num.toString()}
            </Text>
            <MonthStats selectedMonthStats={monthStatData[selected]} />
          </View>
        ) : null}
      </View>
      <View style={{flex: 6}}>
        {showSpinner && <ActivityIndicator size="large" />}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: 60,
  },
  headerLabel: {
    alignSelf: 'center',
    marginRight: 5,
    color: 'black',
  },
  monthContainer: {
    flex: 8,
  },
  monthLabel: {
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: 10,
    color: 'black',
  },
  inputStyles: {
    color: 'black',
  },
});
