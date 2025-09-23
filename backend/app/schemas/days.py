from pydantic import BaseModel
from typing import List, Optional

class DayBase(BaseModel):
    date: str
    title: str
    description: str
    photo: List[str] = []
    lat: Optional[float] = None
    lng: Optional[float] = None

class DayCreate(DayBase):
    pass

class Day(DayBase):
    id: int
    class Config:
        orm_mode = True
