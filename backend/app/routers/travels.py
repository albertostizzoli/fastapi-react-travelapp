from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.travel_db import TravelDB
from app.models.day_db import DayDB
from app.schemas.travels import Travel, TravelCreate
from app.utils.travels import format_date

router = APIRouter(prefix="/travels", tags=["travels"])

# Dependency per avere una sessione DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 📌 GET tutti i viaggi
@router.get("/", response_model=list[Travel])
def get_travels(db: Session = Depends(get_db)):
    return db.query(TravelDB).all()


# 📌 GET viaggio singolo
@router.get("/{travel_id}", response_model=Travel)
def get_travel(travel_id: int, db: Session = Depends(get_db)):
    travel = db.query(TravelDB).filter(TravelDB.id == travel_id).first()
    if not travel:
        raise HTTPException(status_code=404, detail="Viaggio non trovato")
    return travel


# 📌 POST nuovo viaggio
@router.post("/", response_model=Travel)
def add_travel(travel: TravelCreate, db: Session = Depends(get_db)):
    db_travel = TravelDB(
        town=travel.town,
        city=travel.city,
        year=travel.year,
        start_date=format_date(travel.start_date),
        end_date=format_date(travel.end_date),
        general_vote=travel.general_vote,
        votes=travel.votes
    )
    db.add(db_travel)
    db.commit()
    db.refresh(db_travel)

    # aggiungo i giorni
    for i, day in enumerate(travel.days, start=1):
        db_day = DayDB(
            date=format_date(day.date),
            title=day.title,
            description=day.description,
            photo=day.photo,
            lat=day.lat,
            lng=day.lng,
            travel_id=db_travel.id
        )
        db.add(db_day)

    db.commit()
    db.refresh(db_travel)
    return db_travel


# 📌 PUT modifica viaggio
@router.put("/{travel_id}", response_model=Travel)
def update_travel(travel_id: int, updated_travel: TravelCreate, db: Session = Depends(get_db)):
    travel = db.query(TravelDB).filter(TravelDB.id == travel_id).first()
    if not travel:
        raise HTTPException(status_code=404, detail="Viaggio non trovato")

    # aggiorno campi viaggio
    travel.town = updated_travel.town
    travel.city = updated_travel.city
    travel.year = updated_travel.year
    travel.start_date = format_date(updated_travel.start_date)
    travel.end_date = format_date(updated_travel.end_date)
    travel.general_vote = updated_travel.general_vote
    travel.votes = updated_travel.votes

    # elimino giorni vecchi e inserisco i nuovi
    db.query(DayDB).filter(DayDB.travel_id == travel_id).delete()
    for i, day in enumerate(updated_travel.days, start=1):
        db_day = DayDB(
            date=format_date(day.date),
            title=day.title,
            description=day.description,
            photo=day.photo,
            lat=day.lat,
            lng=day.lng,
            travel_id=travel_id
        )
        db.add(db_day)

    db.commit()
    db.refresh(travel)
    return travel


# 📌 DELETE elimina viaggio
@router.delete("/{travel_id}")
def delete_travel(travel_id: int, db: Session = Depends(get_db)):
    travel = db.query(TravelDB).filter(TravelDB.id == travel_id).first()
    if not travel:
        raise HTTPException(status_code=404, detail="Viaggio non trovato")

    db.delete(travel)
    db.commit()
    return {"messaggio": f"Viaggio {travel_id} eliminato con successo"}

