from typing import Optional

from pydantic import BaseModel


class UncategorizedItemDto(BaseModel):
    id: Optional[int]
    month_record_id: Optional[int]
    is_want_or_expense: Optional[bool]
    is_need_want_saving: Optional[bool]
    is_should_be_ignored: Optional[bool]
    is_expense_or_ignore: Optional[bool]

    class Config:
        orm_mode = True
        allow_population_by_field_name = True
