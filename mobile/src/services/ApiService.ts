import axios from 'axios';

export async function setRecordCategories(token: string, data: any[]) {
    const response = await axios.post(
        process.env.BUDGET_API_URL + `/month-records-uncategorized`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          timeout: 5000 
        });
      console.log(`response: ${response}`);
}

export async function getMonthRecordsUncat(token: string) {
    const response = await axios.get(
        process.env.BUDGET_API_URL + `/month-records-uncategorized`,
        {
          timeout: 8000,
          headers:{
           'Authorization': `Bearer ${token}`  
          }
        },
      );
      console.log(`response: ${response}`);
      return response;
}

//TODO: implement this
export async function ignoreMonthRecord(token: string, data: number[]){
    const response =  await axios.post(
        process.env.BUDGET_API_URL + `/ignore-uncategorized-items`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          timeout: 5000 
        });
         console.log(`response: ${response}`);
}