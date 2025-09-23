from sqlalchemy import Column, Integer, String, Float, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class TravelDB(Base):
    __tablename__ = "travels"

    id = Column(Integer, primary_key=True, index=True)
    town = Column(String, nullable=False)
    city = Column(String, nullable=False)
    year = Column(Integer, nullable=False)
    start_date = Column(String, nullable=False)
    end_date = Column(String, nullable=False)
    general_vote = Column(Float, nullable=True)
    votes = Column(JSON, nullable=True)

    days = relationship("DayDB", back_populates="travel", cascade="all, delete")
