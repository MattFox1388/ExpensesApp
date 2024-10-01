from typing import List

from pydantic import BaseModel

from models.dtos.month_record_dto import MonthRecordDto


class CategoryDto(BaseModel):
    id: int
    cat_type: str
    monthRecords: List[MonthRecordDto]

    class Config:
        orm_mode = True
