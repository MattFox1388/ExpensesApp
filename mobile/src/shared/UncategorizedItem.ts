export interface UncategorizedItem {
    id: number;
    month_id: number;
    date: string;
    month_description: string;
    is_want_or_expense: boolean;
    is_need_want_saving: boolean;
    is_should_be_ignored: boolean;
    is_expense_or_ignore: boolean;
    amount: number;
  }

  export const convertToUncategorizedItem = (data: any): UncategorizedItem => {
    return {
      id: data['uncategorizedItems'][0]['id'],
      month_id: data['id'],
      date: data['date_val'],
      month_description: data['descr'],
      is_want_or_expense: data['uncategorizedItems'][0]['is_want_or_expense'],
      is_need_want_saving: data['uncategorizedItems'][0]['is_need_want_saving'],
      is_should_be_ignored: data['uncategorizedItems'][0]['is_should_be_ignored'],
      is_expense_or_ignore: data['uncategorizedItems'][0]['is_expense_or_ignore'],
      amount: data['amount']
    };
  }

  export const convertToTableFormat = (uncategorizedItems: UncategorizedItem[]): Array<Array<string>> => {
    const result: Array<Array<string>> = uncategorizedItems.map( (item: UncategorizedItem) => {
      return [item.id.toString(), item.month_id.toString(), item.date, item.month_description.toString(), ""];
    });
    console.log(`result: ${result}`);
    
    return result;
  };