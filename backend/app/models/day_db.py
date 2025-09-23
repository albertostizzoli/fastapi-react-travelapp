from sqlalchemy import Column, Integer, String, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class DayDB(Base):
    __tablename__ = "days"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    photo = Column(JSON, nullable=True)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)

    travel_id = Column(Integer, ForeignKey("travels.id"))
    travel = relationship("TravelDB", back_populates="days")
