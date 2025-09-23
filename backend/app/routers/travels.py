from fastapi import APIRouter, Depends, HTTPException # strumenti di FastAPI: routing, injection delle dipendenze, gestione errori
from sqlalchemy.orm import Session # sessione ORM per interagire con il database
from app.database import SessionLocal # connessione locale al DB (crea le sessioni)
from app.models.travel_db import TravelDB # modello ORM per la tabella dei viaggi
from app.models.day_db import DayDB # modello ORM per la tabella dei giorni
from app.schemas.travels import Travel, TravelCreate # schemi Pydantic per validare input/output
from app.utils.travels import format_date # funzioni di utilità per formattare date 

# creo il router per il modulo "travels"
router = APIRouter(prefix="/travels", tags=["travels"])

# Dependency: fornisce una sessione di database a ogni richiesta API.
# La sessione viene creata all'inizio, resa disponibile tramite yield,
# e chiusa automaticamente alla fine della richiesta (pattern try/finally).
def get_db():
    db = SessionLocal()
    try:
        yield db  # restituisce la sessione da usare nelle query
    finally:
        db.close()  # chiude la sessione per evitare memory leak


# GET: per ottenere tutti i viaggi
@router.get("/", response_model=list[Travel])
def get_travels(db: Session = Depends(get_db)):
    return db.query(TravelDB).all()


#  GET: per ottenere un viaggio singolo tramite ID
@router.get("/{travel_id}", response_model=Travel)
def get_travel(travel_id: int, db: Session = Depends(get_db)): # ID del nuovo viaggio, , Sessione DB iniettata come dipendenza (Depends)
    travel = db.query(TravelDB).filter(TravelDB.id == travel_id).first() # ottengo il viaggio
    if not travel:
        raise HTTPException(status_code=404, detail="Viaggio non trovato")
    return travel


#  POST: per aggiungere un nuovo viaggio con eventuali giorni
@router.post("/", response_model=Travel)
def add_travel(travel: TravelCreate, db: Session = Depends(get_db)):
    # creo il record del viaggio
    db_travel = TravelDB(
        town=travel.town,
        city=travel.city,
        year=travel.year,
        start_date=format_date(travel.start_date),
        end_date=format_date(travel.end_date),
        general_vote=travel.general_vote,
        votes=travel.votes
    )
    db.add(db_travel)     # il viaggio viene salvato
    db.commit()           # salva le modifiche
    db.refresh(db_travel) # database aggiornato

    # aggiungo i giorni associati al viaggio
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
        db.add(db_day)  # giorno salvato

    db.commit() # modifiche salvate
    db.refresh(db_travel) # database aggiornato
    return db_travel


# PUT: modifica un viaggio esistente e i suoi giorni
@router.put("/{travel_id}", response_model=Travel)
def update_travel(travel_id: int, updated_travel: TravelCreate, db: Session = Depends(get_db)):
    travel = db.query(TravelDB).filter(TravelDB.id == travel_id).first() # Modifica l'id del viaggio selezionato
    if not travel:
        raise HTTPException(status_code=404, detail="Viaggio non trovato")

    # aggiorno i campi del viaggio
    travel.town = updated_travel.town
    travel.city = updated_travel.city
    travel.year = updated_travel.year
    travel.start_date = format_date(updated_travel.start_date)
    travel.end_date = format_date(updated_travel.end_date)
    travel.general_vote = updated_travel.general_vote
    travel.votes = updated_travel.votes

    # rimuovo i vecchi giorni e inserisco quelli nuovi
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


# DELETE: elimina un viaggio e tutti i giorni associati
@router.delete("/{travel_id}")
def delete_travel(travel_id: int, db: Session = Depends(get_db)):
    travel = db.query(TravelDB).filter(TravelDB.id == travel_id).first()
    if not travel:
        raise HTTPException(status_code=404, detail="Viaggio non trovato")

    db.delete(travel)  # elimina il viaggio
    db.commit()         # conferma le modifiche nel DB
    return {"messaggio": f"Viaggio {travel_id} eliminato con successo"}
