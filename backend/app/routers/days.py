from fastapi import APIRouter, Depends, HTTPException  # strumenti di FastAPI: routing, injection delle dipendenze, gestione errori
from sqlalchemy.orm import Session  # sessione ORM per interagire con il database
from app.database import SessionLocal  # connessione locale al DB (crea le sessioni)
from app.models.travel_db import TravelDB  # modello ORM per la tabella dei viaggi
from app.models.day_db import DayDB  # modello ORM per la tabella dei giorni
from app.schemas.days import Day, DayCreate  # schemi Pydantic per validare input/output
from app.utils.travels import format_date, get_coordinates  # funzioni di utilità per formattare date e ottenere coordinate


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
def add_day_travel(travel_id: int, day: DayCreate, db: Session = Depends(get_db)): # ID del viaggio a cui aggiungere il giorno, dati del nuovo giorno (DayCreate), Sessione DB iniettata come dipendenza (Depends)
    # controllo che il viaggio esista
    travel = db.query(TravelDB).filter(TravelDB.id == travel_id).first()
    if not travel:
        raise HTTPException(status_code=404, detail="Viaggio non trovato")

    # ottengo le coordinate geografiche per il giorno
    lat, lng = get_coordinates(day.title, travel.city, travel.town)

    # creo il giorno nel DB
    db_day = DayDB(
        date=format_date(day.date),
        title=day.title,
        description=day.description,
        photo=day.photo,
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
def update_day(travel_id: int, day_id: int, updated_day: DayCreate, db: Session = Depends(get_db)):
    # trovo il giorno da aggiornare
    day = db.query(DayDB).filter(DayDB.id == day_id, DayDB.travel_id == travel_id).first()
    if not day:
        raise HTTPException(status_code=404, detail="Giorno non trovato")

    # aggiorna i campi del giorno
    day.date = format_date(updated_day.date)
    day.title = updated_day.title
    day.description = updated_day.description
    day.photo = updated_day.photo

    # aggiorna le coordinate se disponibili
    lat, lng = get_coordinates(updated_day.title, day.travel.city, day.travel.town)
    if lat and lng:
        day.lat, day.lng = lat, lng

    db.commit()        # salva le modifiche
    db.refresh(day)    # database aggiornato
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
