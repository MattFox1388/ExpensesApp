from datetime import datetime, date
from typing import List, Optional

from pydantic import BaseModel

from models.dtos.uncategorized_item_dto import UncategorizedItemDto


class MonthRecordDto(BaseModel):
    id: Optional[int]
    year_num: int
    date_val: date
    amount: float
    descr: str
    is_positive: bool
    month_id: int
    username: str
    cat_id: Optional[int]
    uncategorizedItems: Optional[List[UncategorizedItemDto]]

    class Config:
        orm_mode = True
        allow_population_by_field_name = True


class MonthRecordDtoList(BaseModel):
    month_records: List[MonthRecordDto]
