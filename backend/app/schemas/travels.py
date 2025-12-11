from pydantic import BaseModel # definire schemi di dati con controlli di validazione
from typing import List, Optional # tipi generici: List per array tipizzati, Optional per valori facoltativi
from app.schemas.days import Day  # importo il modello Pydantic Day per i giorni

# modello Pydantic che rappresenta la tabella travels
class TravelBase(BaseModel):
    town: str               # paese 
    year: int               # anno 
    start_date: str         # data di inizio 
    end_date: str           # data di fine 
    general_vote: Optional[float] = None  # media dei voti da votes
    votes: Optional[dict] = None            # voti (giorno, paesaggio, attività relax, prezzo)
    user_id: Optional[int] = None  

# modello Pydantic per creare un nuovo viaggio
class TravelCreate(TravelBase):
    days: List[Day] = []  # lista delle tappe del viaggio, default vuota

# modello Pydantic per restituire i viaggi e le loro tappe dal database. Necessario se vuoi fare response_model=Travel
class Travel(TravelBase):
    id: int              # ID univoco del viaggio
    days: List[Day] = [] # Lista delle tappe associate al viaggio

    class Config:
        # permette a Pydantic di leggere dati direttamente da oggetti SQLAlchemy
        from_attributes = True
