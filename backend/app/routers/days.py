from fastapi import APIRouter, Form, UploadFile, Depends, HTTPException  # strumenti di FastAPI: routing, injection delle dipendenze, gestione errori
from sqlalchemy.orm import Session  # sessione ORM per interagire con il database
from typing import List
import cloudinary.uploader

from app.database import SessionLocal  # connessione locale al DB (crea le sessioni)
from app.models.travel_db import TravelDB  # modello ORM per la tabella dei viaggi
from app.models.day_db import DayDB  # modello ORM per la tabella dei giorni
from app.schemas.days import Day, DayCreate  # schemi Pydantic per validare input/output
from app.utils.travels import format_date, get_coordinates  # funzioni di utilità per formattare date e ottenere coordinate
from app.config import cloudinary 

# creo il router per i giorni, con prefisso e tag
router = APIRouter(prefix="/travels", tags=["days"])

# Dependency: fornisce una sessione di database a ogni richiesta API.
# La sessione viene creata all'inizio, resa disponibile tramite yield,
# e chiusa automaticamente alla fine della richiesta (pattern try/finally).
def get_db():
    db = SessionLocal()
    try:
        yield db  # restituisce la sessione da usare nelle query
    finally:
        db.close()  # chiude la sessione per evitare memory leak


#  POST: aggiunge un giorno a un viaggio esistente
@router.post("/{travel_id}/days", response_model=Day)
async def add_day_travel(
    travel_id: int,
    date: str = Form(...),
    title: str = Form(...),
    description: str = Form(...),
    photos: List[UploadFile] = None,
    db: Session = Depends(get_db)
):
    # controllo che il viaggio esista
    travel = db.query(TravelDB).filter(TravelDB.id == travel_id).first()
    if not travel:
        raise HTTPException(status_code=404, detail="Viaggio non trovato")

    # ottengo le coordinate geografiche per il giorno
    lat, lng = get_coordinates(title, travel.city, travel.town)

    # carico le foto su Cloudinary
    photo_urls = []
    if photos:
        for photo in photos:
            result = cloudinary.uploader.upload(photo.file)
            photo_urls.append(result["secure_url"])

    # creo il giorno nel DB
    db_day = DayDB(
        date=format_date(date),
        title=title,
        description=description,
        photo=photo_urls,
        lat=lat,
        lng=lng,
        travel_id=travel_id
    )
    db.add(db_day)       # il giorno viene salvato
    db.commit()          # salva le modifiche
    db.refresh(db_day)   # database aggiornato
    return db_day


#  PUT: modifica un giorno esistente
@router.put("/{travel_id}/days/{day_id}", response_model=Day)
async def update_day(
    travel_id: int, 
    day_id: int,
    date: str = Form(...),
    title: str = Form(...),
    description: str = Form(...),
    existing_photos: List[str] = Form([]),   # URL delle foto da mantenere
    photos: List[UploadFile] = None,         # nuove foto caricate
    db: Session = Depends(get_db)
):
    day = db.query(DayDB).filter(DayDB.id == day_id, DayDB.travel_id == travel_id).first()
    if not day:
        raise HTTPException(status_code=404, detail="Giorno non trovato")

    # aggiorna i campi base
    day.date = format_date(date)
    day.title = title
    day.description = description

    # inizializza l'elenco con quelle già esistenti
    final_photos = existing_photos.copy()

    # carico nuove foto su Cloudinary
    if photos:
        for photo in photos:
            result = cloudinary.uploader.upload(photo.file)
            final_photos.append(result["secure_url"])

    # salvo nel DB
    day.photo = final_photos

    # aggiorna coordinate
    lat, lng = get_coordinates(title, day.travel.city, day.travel.town)
    if lat and lng:
        day.lat, day.lng = lat, lng

    db.commit()
    db.refresh(day)
    return day



#  DELETE: elimina un giorno da un viaggio
@router.delete("/{travel_id}/days/{day_id}")
def delete_day_travel(travel_id: int, day_id: int, db: Session = Depends(get_db)):
    # trovo il giorno da eliminare
    day = db.query(DayDB).filter(DayDB.id == day_id, DayDB.travel_id == travel_id).first()
    if not day:
        raise HTTPException(status_code=404, detail="Giorno non trovato")

    db.delete(day)     # elimina il giorno
    db.commit()        # conferma le modifiche nel DB
    return {"messaggio": f"Giorno {day_id} eliminato dal viaggio {travel_id}"}
