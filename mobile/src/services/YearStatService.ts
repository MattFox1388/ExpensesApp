import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { YearStatResponse } from "../../types/YearStatResponse";

const BUDGET_API_URL = process.env.EXPO_PUBLIC_BUDGET_API_URL || '';

export const getYearStats = async (year: string, username: string)=> {
    const token = await AsyncStorage.getItem('login_token');
    const response = await axios.get(
        `${BUDGET_API_URL}/month-stats/year/${year}/user/${username}`,
        {
          timeout: 10000,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ).catch((error) => {
        // Handle Axios error
        if (axios.isAxiosError(error)) {
          console.error("Axios error:", error.response?.data || error.message);
          throw new Error(error.response?.data?.message || "An error occurred while fetching data.");
        } else {
          console.error("Unexpected error:", error);
          throw new Error("An unexpected error occurred.");
        }
      });
    return response;
}