import React, { useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import { useMonthStats } from "../../hooks/useMonthStats";
import { MonthStats } from "./MonthStats";
import { SelectList } from "react-native-dropdown-select-list";

export const FindMonthPage: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const { monthStatData, selectListData, isLoading } = useMonthStats();

  const handleSelect = (value: number | null) => {
    setSelected(value);
    console.log(value);
  };

  const selectedMonthStat = selected !== null ? monthStatData[selected] : null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerLabel}>Select Month:</Text>
        {isLoading ? (
          <ActivityIndicator size="large" />
        ) : (
          <SelectList
            data={selectListData}
            save="key"
            setSelected={handleSelect}
            dropdownTextStyles={styles.inputStyles}
            inputStyles={styles.inputStyles}
          />
        )}
      </View>

      <View style={styles.monthContainer}>
        {selectedMonthStat ? (
          <>
            <Text style={styles.monthLabel}>
              Month: {selectedMonthStat.month_id} Year: {selectedMonthStat.year_num}
            </Text>
            <MonthStats selectedMonthStats={selectedMonthStat} />
          </>
        ) : (
          !isLoading && <Text style={styles.placeholderText}>Please select a month to view details.</Text>
        )}
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
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
    flexDirection: "row",
    alignItems: "center",
    marginTop: 60,
    paddingHorizontal: 16,
  },
  headerLabel: {
    marginRight: 8,
    fontSize: 16,
    color: "black",
  },
  monthContainer: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 16,
  },
  monthLabel: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    marginBottom: 12,
  },
  placeholderText: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
  },
  inputStyles: {
    color: "black",
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: "center",
  },
});