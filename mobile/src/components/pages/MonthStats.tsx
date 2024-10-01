import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-elements';
import {VictoryPie} from 'victory-native';
import {MonthStatResponse} from '../../../types/MonthStatResponse';
import {List} from 'react-native-paper';

interface MonthStatsProps {
  selectedMonthStats: MonthStatResponse;
}

function currencyFormat(num: number) {
  return '$' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

export const MonthStats: React.FC<MonthStatsProps> = ({selectedMonthStats}) => {
  const [actualChart, setActualChart] = useState<
    {x: string; y: number | undefined | null}[]
  >([]);

  useEffect(() => {
    console.log(`month stats: ${selectedMonthStats.savings_actual}`);
    setActualChart([
      {x: 'needs', y: selectedMonthStats.needs_actual ?? 0},
      {x: 'wants', y: selectedMonthStats.wants_actual ?? 0},
      {x: 'savings', y: selectedMonthStats.savings_actual ?? 0},
      {x: 'paycheck', y: selectedMonthStats.paycheck_actual ?? 0},
      {x: 'other', y: selectedMonthStats.other_actual ?? 0},
    ]);
  }, []);

  const getLeftover = () => {
    let income = 0;
    let expenses = 0;
    if (selectedMonthStats.needs_actual)
      expenses += selectedMonthStats.needs_actual;
    if (selectedMonthStats.wants_actual)
      expenses += selectedMonthStats.wants_actual;
    if (selectedMonthStats.savings_actual)
      expenses += selectedMonthStats.savings_actual;
    if (selectedMonthStats.paycheck_actual)
      income += selectedMonthStats.paycheck_actual;
    if (selectedMonthStats.other_actual)
      income += selectedMonthStats.other_actual;

    return income - expenses;
  };

  return (
    <View style={styles.containerStyle}>
      <ScrollView>
        <Text style={styles.pieChartLabel}>Chart: </Text>
        <VictoryPie
          data={actualChart}
          width={250}
          height={250}
          innerRadius={50}
          colorScale="cool"
          style={{
            labels: {
              fill: 'black',
              fontSize: 11,
              padding: 7,
            },
          }}
        />
        <Text style={styles.pieChartLabel}>Numbers: </Text>
        <View>
          <List.Item
            title="needs"
            description={currencyFormat(selectedMonthStats.needs_actual ?? 0)}
          />
          <List.Item
            title="wants"
            description={currencyFormat(selectedMonthStats.wants_actual ?? 0)}
          />
          <List.Item
            title="savings"
            description={currencyFormat(selectedMonthStats.savings_actual ?? 0)}
          />
          <List.Item
            title="paycheck"
            description={currencyFormat(
              selectedMonthStats.paycheck_actual ?? 0,
            )}
          />
          <List.Item
            title="other"
            description={currencyFormat(selectedMonthStats.other_actual ?? 0)}
          />
          <List.Item
            title="leftover"
            description={currencyFormat(getLeftover())}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  pieChartLabel: {
    fontSize: 15,
  },
  containerStyle: {
    paddingLeft: 10,
  },
  victoryPieStyle: {
    paddingLeft: 5,
  },
  listStyle: {
    fontWeight: 'normal',
  },
});
