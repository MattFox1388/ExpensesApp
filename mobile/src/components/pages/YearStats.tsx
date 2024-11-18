import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { List } from 'react-native-paper';
import { VictoryPie } from 'victory-native';
import {YearStatResponse} from '../../../types/YearStatResponse';
import { useStatsChart } from '../../hooks/useStatsChart';
import { currencyFormat } from '../../shared/StatsUtility';

interface YearStatsProp {
  selectedYearStats: YearStatResponse;
}

export const YearStats: React.FC<YearStatsProp> = ({selectedYearStats}) => {
  const {chartData, getLeftover} = useStatsChart(
    {response: selectedYearStats},
    'year',
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>Chart</Text>
        <VictoryPie
          data={chartData}
          labels={({ datum }) => (datum.y > 0 ? datum.x : "")}
          width={250}
          height={250}
          innerRadius={50}
          colorScale="cool"
          style={{
            labels: {
              fill: "black",
              fontSize: 11,
              padding: 7,
            },
          }}
        />
        <Text style={styles.header}>Numbers</Text>
        <View>
  {[
    { label: "Needs", value: selectedYearStats.needs},
    { label: "Wants", value: selectedYearStats.wants },
    { label: "Savings", value: selectedYearStats.savings },
    { label: "Paycheck", value: selectedYearStats.paycheck, isIncome: true },
    { label: "Other", value: selectedYearStats.other, isIncome: true },
    { label: "Leftover", value: getLeftover()},
  ].map(({ label, value, isIncome }) => (
    <List.Item
      key={label}
      title={label}
      description={() =>
        isIncome ? (
          <Text style={styles.incomeHighlight}>
            +{currencyFormat(value ?? 0)}
          </Text>
        ) : (
          <Text style={styles.expenseHighlight}>
            -{currencyFormat(value ?? 0)}
          </Text>
          
        )
      }
    />
  ))}
</View>
 
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      padding: 10,
    },
    header: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 10,
    },
      pieChartLabel: {
        fontSize: 15,
      },
      containerStyle: {
        paddingLeft: 10,
      },
      incomeHighlight: {
        color: 'green',
        fontWeight: 'bold',
      },
      expenseHighlight: {
        color: '#EE4B2B',
        fontWeight: 'bold',
      },
    });
