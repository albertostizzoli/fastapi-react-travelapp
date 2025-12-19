from fastapi import APIRouter, Form, UploadFile, Depends, HTTPException  # strumenti di FastAPI: routing, injection delle dipendenze, gestione errori
from sqlalchemy.orm import Session  # sessione ORM per interagire con il database
from typing import List, Optional
from app.database import SessionLocal  # connessione locale al DB (crea le sessioni)
from app.models.travel_db import TravelDB  # modello ORM per la tabella dei viaggi
from app.models.day_db import DayDB  # modello ORM per la tabella dei giorni
from app.schemas.days import Day # classe Pydantic per i giorni
from app.utils.travels import format_date, get_coordinates  # funzioni di utilità per formattare date e ottenere coordinate
from app.config import cloudinary   # importo la configurazione di Cloudinary
import cloudinary.uploader  # per caricare immagini su Cloudinary
from app.auth import get_current_user # importo la funzione per ottenere l'utente in base al token fornito
import asyncio

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


# Funzione che mi permette di fare l'upload delle foto in modo asincrono
async def upload_photo(photo):
    # Upload su Cloudinary in thread separato
    return await asyncio.to_thread(cloudinary.uploader.upload, photo.file)


#  POST: aggiunge un giorno a un viaggio esistente
@router.post("/{travel_id}/days", response_model=Day)
async def add_day_travel(
    travel_id: int,
    city: str = Form(...),
    date: str = Form(...),
    title: str = Form(...),
    description: str = Form(...),
    experiences: Optional[List[str]] = Form(None),
    photos: List[UploadFile] = None,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user) 
):
    user_id = current_user["id"]
    # controllo che il viaggio esista
    travel = db.query(TravelDB).filter(TravelDB.id == travel_id, TravelDB.user_id == user_id).first()
    if not travel:
        raise HTTPException(status_code=404, detail="Viaggio non trovato")

    # ottengo le coordinate geografiche per il giorno
    lat, lng = await get_coordinates(title, city, travel.town)

    # carico le foto su Cloudinary in parallelo
    photo_urls = []
    if photos:
        upload_tasks = [upload_photo(photo) for photo in photos]
        results = await asyncio.gather(*upload_tasks)
        photo_urls = [res["secure_url"] for res in results]

    # carico le esperienze
    experiences_data = experiences or []

    # creo il giorno nel DB
    db_day = DayDB(
        city=city,
        date=format_date(date),
        title=title,
        description=description,
        experiences=experiences_data,
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
async def update_day_travel(
    travel_id: int,
    day_id: int,
    city: str = Form(...),
    date: str = Form(...),
    title: str = Form(...),
    description: str = Form(...),
    experiences: Optional[List[str]] = Form(None),
    photos: List[UploadFile] = None,
    existing_photos: List[str] = Form([]),  # URL foto già presenti
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["id"]

    # controllo che il viaggio appartenga all'utente
    travel = db.query(TravelDB).filter(
        TravelDB.id == travel_id,
        TravelDB.user_id == user_id
    ).first()
    if not travel:
        raise HTTPException(status_code=404, detail="Viaggio non trovato")

    # controllo che il giorno esista
    db_day = db.query(DayDB).filter(
        DayDB.id == day_id,
        DayDB.travel_id == travel_id
    ).first()
    if not db_day:
        raise HTTPException(status_code=404, detail="Giorno non trovato")
    
    # carico le esperienze
    experiences_data = experiences or []

    # aggiorno i campi
    db_day.city = city
    db_day.date = format_date(date)
    db_day.title = title
    db_day.description = description
    db_day.experiences = experiences_data

    # gestisco le foto: mantieni quelle esistenti + nuove caricate
    photo_urls = existing_photos or []
    if photos:
        # upload in parallelo
        upload_tasks = [upload_photo(photo) for photo in photos]
        results = await asyncio.gather(*upload_tasks)
        photo_urls += [res["secure_url"] for res in results]

    db_day.photo = photo_urls

    # aggiorno lat/lng
    db_day.lat, db_day.lng = await get_coordinates(title, city, travel.town)

    db.commit()
    db.refresh(db_day)
    return db_day


#  DELETE: elimina un giorno da un viaggio
@router.delete("/{travel_id}/days/{day_id}")
def delete_day_travel(travel_id: int, day_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    # trovo il giorno da eliminare
    day = db.query(DayDB).join(TravelDB).filter(
        DayDB.id == day_id,
        TravelDB.id == travel_id,
        TravelDB.user_id == user_id
    ).first()
    
    if not day:
        raise HTTPException(status_code=404, detail="Giorno non trovato")

    db.delete(day)     # elimina il giorno
    db.commit()        # conferma le modifiche nel DB
    return {"messaggio": f"Giorno {day_id} eliminato dal viaggio {travel_id}"}
