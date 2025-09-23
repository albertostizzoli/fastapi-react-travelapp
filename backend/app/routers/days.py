from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.travel_db import TravelDB
from app.models.day_db import DayDB
from app.schemas.days import Day, DayCreate
from app.utils.travels import format_date, get_coordinates

router = APIRouter(prefix="/travels", tags=["days"])

# Dependency per avere una sessione DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 📌 POST aggiungi giorno
@router.post("/{travel_id}/days", response_model=Day)
def add_day_travel(travel_id: int, day: DayCreate, db: Session = Depends(get_db)):
    travel = db.query(TravelDB).filter(TravelDB.id == travel_id).first()
    if not travel:
        raise HTTPException(status_code=404, detail="Viaggio non trovato")

    lat, lng = get_coordinates(day.title, travel.city, travel.town)

    db_day = DayDB(
        date=format_date(day.date),
        title=day.title,
        description=day.description,
        photo=day.photo,
        lat=lat,
        lng=lng,
        travel_id=travel_id
    )
    db.add(db_day)
    db.commit()
    db.refresh(db_day)
    return db_day


# 📌 PUT modifica giorno
@router.put("/{travel_id}/days/{day_id}", response_model=Day)
def update_day(travel_id: int, day_id: int, updated_day: DayCreate, db: Session = Depends(get_db)):
    day = db.query(DayDB).filter(DayDB.id == day_id, DayDB.travel_id == travel_id).first()
    if not day:
        raise HTTPException(status_code=404, detail="Giorno non trovato")

    day.date = format_date(updated_day.date)
    day.title = updated_day.title
    day.description = updated_day.description
    day.photo = updated_day.photo

    lat, lng = get_coordinates(updated_day.title, day.travel.city, day.travel.town)
    if lat and lng:
        day.lat, day.lng = lat, lng

    db.commit()
    db.refresh(day)
    return day


# 📌 DELETE elimina giorno
@router.delete("/{travel_id}/days/{day_id}")
def delete_day_travel(travel_id: int, day_id: int, db: Session = Depends(get_db)):
    day = db.query(DayDB).filter(DayDB.id == day_id, DayDB.travel_id == travel_id).first()
    if not day:
        raise HTTPException(status_code=404, detail="Giorno non trovato")

    db.delete(day)
    db.commit()
    return {"messaggio": f"Giorno {day_id} eliminato dal viaggio {travel_id}"}

