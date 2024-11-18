import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  Dimensions, 
  StyleSheet, 
  Pressable 
} from "react-native";
import { useUsersContext } from "../../contexts/UsersContext";
import { getYearStats } from "../../services/YearStatService";
import { isValidYear } from "../../shared/StatsUtility";
import { YearStats } from "./YearStats";

export const YtdStatsPage: React.FC = () => {
  const { state: usersState } = useUsersContext();
  const [year, setYear] = useState<string>('');
  const [yearStats, setYearStats] = useState(null);

  const handleChangeText = (inputText: string) => {
    setYear(inputText);
  };

  const onSubmit = async () => {
    if (isValidYear(year)) {
      const response = await getYearStats(year, usersState.username ?? "");
      setYearStats(response.data);
    } else {
      console.log("Invalid year format.");
    }
  };

  const screenWidth = Dimensions.get('window').width;

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Yearly Statistics</Text>
        <View style={styles.inputGroup}>
          <View>
            <Text style={styles.label}>Enter year:</Text>
            <TextInput
              style={[styles.textInput, { width: screenWidth * 0.4 }]}
              placeholder="e.g., 2023"
              placeholderTextColor="#888"
              keyboardType="numeric"
              onChangeText={handleChangeText}
              value={year}
              onSubmitEditing={onSubmit}
            />
          </View>
          <Pressable style={styles.submitButton} onPress={onSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </Pressable>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.contentContainer}>
        {yearStats !== null && <YearStats selectedYearStats={yearStats} />}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  headerContainer: {
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    color: "#444",
    marginRight: 10,
  },
  textInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: "#333",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginLeft: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 20,
  },
});
