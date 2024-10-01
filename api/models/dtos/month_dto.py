from typing import List

from pydantic import BaseModel

from models.dtos.month_record_dto import MonthRecordDto
from models.dtos.month_stat_dto import MonthStatDto


class MonthDto(BaseModel):
    id: int
    month_name: str
    monthRecords: list[MonthRecordDto]
    monthStats: list[MonthStatDto]

    class Config:
        orm_mode = True
        allow_population_by_field_name = True


class MonthDtoList(BaseModel):
    months: List[MonthDto]
