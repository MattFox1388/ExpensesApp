export interface MonthStatResponse  {
    date_val: string,
    expenses_actual: number,
    expenses_planned: number,
    id: number,
    month_id: number,
    needs_actual: number | undefined,
    needs_planned: number | undefined,
    other_actual: number | undefined,
    other_planned: number | undefined,
    paycheck_actual: number | undefined,
    paycheck_planned: number | undefined,
    savings_actual: number | undefined,
    savings_planned: number | undefined,
    wants_actual: number | undefined,
    wants_planned: number | undefined,
    year_num: number
}
