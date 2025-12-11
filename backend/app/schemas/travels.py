from pydantic import BaseModel # importo la classe base di Pydantic per creare modelli di dati con validazione
from typing import List, Optional # importo List per array tipizzati e Optional per valori facoltativi
from app.schemas.days import Day  # importo la classe Day per le tappe del viaggio

# classe che rappresenta i dati di un viaggio
class TravelBase(BaseModel):
    town: str                                 # paese 
    year: int                                 # anno 
    start_date: str                           # data di inizio 
    end_date: str                             # data di fine 
    general_vote: Optional[float] = None      # media dei voti da votes
    votes: Optional[dict] = None              # voti (giorno, paesaggio, attività relax, prezzo)
    user_id: Optional[int] = None             # ID dell'utente associato al viaggio

# classe per creare un nuovo viaggio, eredita da TravelBase
class TravelCreate(TravelBase):
    days: List[Day] = []  # lista delle tappe del viaggio, default vuota

# classe per restituire i dati dei viaggi dal database nel frontend, eredita da TravelBase, ti serve se vuoi fare response_model=Travel
class Travel(TravelBase):
    id: int              # ID univoco del viaggio
    days: List[Day] = [] # Lista delle tappe associate al viaggio

    # classe Config per permettere a Pydantic di leggere dati direttamente da oggetti SQLAlchemy
    class Config:
        from_attributes = True
