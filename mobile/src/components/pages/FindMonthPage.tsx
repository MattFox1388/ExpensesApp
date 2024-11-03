import React, { useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import { useMonthStats } from "../../hooks/useMonthStats";
import { MonthStats } from "./MonthStats";
import { SelectList } from "react-native-dropdown-select-list";

export const FindMonthPage: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const { monthStatData, selectListData, isLoading } = useMonthStats();

  const renderMonthStats = () => {
    if (selected == null) return null;
    const selectedMonthStat = monthStatData[selected];
    return (
      <View>
        <Text style={styles.monthLabel}>
          Month: {selectedMonthStat.month_id} Year: {selectedMonthStat.year_num}
        </Text>
        <MonthStats selectedMonthStats={selectedMonthStat} />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerLabel}>Select Month: </Text>
        {!isLoading ? (
          <SelectList
            data={selectListData}
            save="key"
            onSelect={() => console.log(selected)}
            setSelected={(val: React.SetStateAction<number | null>) => setSelected(val)}

            defaultOption={{key: null, value: null}}
            dropdownTextStyles={styles.inputStyles}
            inputStyles={styles.inputStyles}
          />
        ) : (
          <ActivityIndicator size="large" />
        )}
      </View>
      <View style={styles.monthContainer}>
        {renderMonthStats()}
      </View>
      {isLoading && (
        <View>
          <ActivityIndicator size="large" />
        </View>

      )}
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
