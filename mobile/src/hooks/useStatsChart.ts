import { useEffect, useMemo, useState } from "react";
import { MonthStatResponse } from "../../types/MonthStatResponse";
import { YearStatResponse } from "../../types/YearStatResponse";

type StatsType = "month" | "year";

interface StatsResponse {
    response: MonthStatResponse | YearStatResponse
}

interface Stats {
    needs: number;
    wants: number;
    savings: number;
    paycheck: number;
    other: number;
    year: number;
}

export const useStatsChart = (selectedStats: StatsResponse, type: StatsType) => {
    const [chartData, setChartData] = useState<{ x: string; y: number | null }[]>([]);

    // Memoize currentStats to prevent unnecessary recalculations
    const currentStats: Stats | undefined = useMemo(() => {
        return type === "month"
            ? {
                needs: (selectedStats.response as MonthStatResponse).needs_actual || 0.0,
                wants: (selectedStats.response as MonthStatResponse).wants_actual || 0.0,
                savings: (selectedStats.response as MonthStatResponse).savings_actual || 0.0,
                paycheck: (selectedStats.response as MonthStatResponse).paycheck_actual || 0.0,
                other: (selectedStats.response as MonthStatResponse).other_actual || 0.0,
                year: (selectedStats.response as MonthStatResponse).year_num || 2000,
              }
            : {
                needs: (selectedStats.response as YearStatResponse).needs,
                wants: (selectedStats.response as YearStatResponse).wants,
                savings: (selectedStats.response as YearStatResponse).savings,
                paycheck: (selectedStats.response as YearStatResponse).paycheck,
                other: (selectedStats.response as YearStatResponse).other,
                year: (selectedStats.response as YearStatResponse).year,
              };
    }, [selectedStats, type]); // Only recalculate when selectedStats or type changes

    // Update chartData whenever currentStats changes
    useEffect(() => {
      if (currentStats) {
        const preparedData = [
          { x: "Needs", y: currentStats.needs ?? 0.0 },
          { x: "Wants", y: currentStats.wants ?? 0.0 },
          { x: "Savings", y: currentStats.savings ?? 0.0 },
          { x: "Paycheck", y: currentStats.paycheck ?? 0.0 },
          { x: "Other", y: currentStats.other ?? 0.0 },
        ];

        // Only update chartData if it has changed
        if (JSON.stringify(preparedData) !== JSON.stringify(chartData)) {
          setChartData(preparedData);
        }
      }
    }, [currentStats, chartData]); // Ensure this dependency is correct

    const getLeftover = () => {
      const income =
        (currentStats?.paycheck ?? 0) + (currentStats?.other ?? 0);
      const expenses =
        (currentStats?.needs ?? 0) +
        (currentStats?.wants ?? 0) +
        (currentStats?.savings ?? 0);

      return income - expenses;
    };

    return { chartData, getLeftover };
};
  