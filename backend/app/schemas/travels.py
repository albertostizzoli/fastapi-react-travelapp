from pydantic import BaseModel
from typing import List, Optional
from app.schemas.days import Day

class TravelBase(BaseModel):
    town: str
    city: str
    year: int
    start_date: str
    end_date: str
    general_vote: Optional[float] = None
    votes: Optional[dict] = None

class TravelCreate(TravelBase):
    days: List[Day] = []

class Travel(TravelBase):
    id: int
    days: List[Day] = []

    class Config:
        orm_mode = True
