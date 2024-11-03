from datetime import date
from typing import List, Optional

from pydantic import BaseModel


class MonthStatDto(BaseModel):
    id: int
    year_num: int
    date_val: date
    paycheck_planned: Optional[float]
    other_planned: Optional[float]
    expenses_planned: Optional[float]
    needs_planned: Optional[float]
    wants_planned: Optional[float]
    savings_planned: Optional[float]
    paycheck_actual: Optional[float]
    other_actual: Optional[float]
    expenses_actual: Optional[float]
    needs_actual: Optional[float]
    wants_actual: Optional[float]
    savings_actual: Optional[float]
    month_id: int
    username: str

    class Config:
        orm_mode = True
        allow_population_by_field_name = True


class MonthStatDtoList(BaseModel):
    month_stats: List[MonthStatDto]
