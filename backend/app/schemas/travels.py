from pydantic import BaseModel # definire schemi di dati con controlli di validazione
from typing import List, Optional # tipi generici: List per array tipizzati, Optional per valori facoltativi
from app.schemas.days import Day  # importo il modello Pydantic Day per i giorni

# classe base per il modello Travel
# definisce i campi comuni a tutti i modelli Pydantic relativi ai viaggi
class TravelBase(BaseModel):
    town: str               # paese 
    city: str               # città 
    year: int               # anno 
    start_date: str         # data di inizio 
    end_date: str           # data di fine 
    general_vote: Optional[float] = None  # media dei voti da votes
    votes: Optional[dict] = None          # voti (giorno, paesaggio, attività relax, prezzo)

# modello per creare un nuovo viaggio
# aggiunge il campo 'days', lista di oggetti Day
class TravelCreate(TravelBase):
    days: List[Day] = []  # lista delle tappe del viaggio, default vuota

# modello per leggere un viaggio dal database
# aggiunge il campo 'id' generato dal DB
class Travel(TravelBase):
    id: int              # ID univoco del viaggio
    days: List[Day] = [] # Lista delle tappe associate al viaggio

    class Config:
        # permette a Pydantic di leggere dati direttamente da oggetti SQLAlchemy
        from_attributes = True
