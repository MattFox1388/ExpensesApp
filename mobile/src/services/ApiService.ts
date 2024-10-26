import axios from 'axios';

export async function setRecordCategories(token: string, data: any[]) {
  const response = await axios.post(
    `${process.env.EXPO_PUBLIC_BUDGET_API_URL}/month-records-uncategorized`,
    data,
    {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      timeout: 5000,
    },
  );
}

export async function getMonthRecordsUncat(token: string) {
  const response = await axios.get(
    `${process.env.EXPO_PUBLIC_BUDGET_API_URL}/month-records-uncategorized`,
    {
      timeout: 8000,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response;
}

export async function ignoreMonthRecord(token: string, data: number[]) {
  const response = await axios.post(
    `${process.env.EXPO_PUBLIC_BUDGET_API_URL}/ignore-uncategorized-items`,
    data,
    {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      timeout: 5000,
    },
  );
}
