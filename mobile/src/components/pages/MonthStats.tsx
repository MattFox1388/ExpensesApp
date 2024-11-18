import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-elements";
import { VictoryPie } from "victory-native";
import { MonthStatResponse } from "../../../types/MonthStatResponse";
import { List } from "react-native-paper";
import { useStatsChart } from "../../hooks/useStatsChart";
import { currencyFormat } from "../../shared/StatsUtility";

interface MonthStatsProps {
  selectedMonthStats: MonthStatResponse;
}

export const MonthStats: React.FC<MonthStatsProps> = ({ selectedMonthStats }) => {
  const {chartData, getLeftover} = useStatsChart({response: selectedMonthStats}, "month")

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
    { label: "Needs", value: selectedMonthStats.needs_actual },
    { label: "Wants", value: selectedMonthStats.wants_actual },
    { label: "Savings", value: selectedMonthStats.savings_actual },
    { label: "Paycheck", value: selectedMonthStats.paycheck_actual, isIncome: true },
    { label: "Other", value: selectedMonthStats.other_actual, isIncome: true },
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
  
// import React, {useEffect, useState} from 'react';
// import {ScrollView, StyleSheet, View} from 'react-native';
// import {Text} from 'react-native-elements';
// import {VictoryPie} from 'victory-native';
// import {MonthStatResponse} from '../../../types/MonthStatResponse';
// import {List} from 'react-native-paper';

// interface MonthStatsProps {
//   selectedMonthStats: MonthStatResponse;
// }

// function currencyFormat(num: number) {
//   return '$' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
// }

// export const MonthStats: React.FC<MonthStatsProps> = ({selectedMonthStats}) => {
//   const [actualChart, setActualChart] = useState<
//     {x: string; y: number | undefined | null}[]
//   >([]);

//   useEffect(() => {
//     setActualChart([
//       {x: 'needs', y: selectedMonthStats.needs_actual ?? 0},
//       {x: 'wants', y: selectedMonthStats.wants_actual ?? 0},
//       {x: 'savings', y: selectedMonthStats.savings_actual ?? 0},
//       {x: 'paycheck', y: selectedMonthStats.paycheck_actual ?? 0},
//       {x: 'other', y: selectedMonthStats.other_actual ?? 0},
//     ]);
//   }, [selectedMonthStats]);

//   const getLeftover = () => {
//     let income = 0;
//     let expenses = 0;
//     if (selectedMonthStats.needs_actual)
//       expenses += selectedMonthStats.needs_actual;
//     if (selectedMonthStats.wants_actual)
//       expenses += selectedMonthStats.wants_actual;
//     if (selectedMonthStats.savings_actual)
//       expenses += selectedMonthStats.savings_actual;
//     if (selectedMonthStats.paycheck_actual)
//       income += selectedMonthStats.paycheck_actual;
//     if (selectedMonthStats.other_actual)
//       income += selectedMonthStats.other_actual;

//     return income - expenses;
//   };

//   return (
//     <View style={styles.containerStyle}>
//       <ScrollView>
//         <Text style={styles.pieChartLabel}>Chart: </Text>
//         <VictoryPie
//           data={actualChart}
//           labels={({datum}) => {
//             const jsonPretty = JSON.stringify(datum, null, 2); 
//             if (datum['y'] > 0) {
//               return datum.x
//             }
//             return "" 
//           }}
//           width={250}
//           height={250}
//           innerRadius={50}
//           colorScale="cool"
//           style={{
//             labels: {
//               fill: 'black',
//               fontSize: 11,
//               padding: 7,
//             },
//           }}
//         />
//         <Text style={styles.pieChartLabel}>Numbers: </Text>
//         <View>
//           <List.Item
//             title="needs"
//             description={currencyFormat(selectedMonthStats.needs_actual ?? 0)}
//           />
//           <List.Item
//             title="wants"
//             description={currencyFormat(selectedMonthStats.wants_actual ?? 0)}
//           />
//           <List.Item
//             title="savings"
//             description={currencyFormat(selectedMonthStats.savings_actual ?? 0)}
//           />
//           <List.Item
//             title="paycheck"
//             description={currencyFormat(
//               selectedMonthStats.paycheck_actual ?? 0,
//             )}
//           />
//           <List.Item
//             title="other"
//             description={currencyFormat(selectedMonthStats.other_actual ?? 0)}
//           />
//           <List.Item
//             title="leftover"
//             description={currencyFormat(getLeftover())}
//           />
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   pieChartLabel: {
//     fontSize: 15,
//   },
//   containerStyle: {
//     paddingLeft: 10,
//   },
//   victoryPieStyle: {
//     paddingLeft: 5,
//   },
//   listStyle: {
//     fontWeight: 'normal',
//   },
// });
