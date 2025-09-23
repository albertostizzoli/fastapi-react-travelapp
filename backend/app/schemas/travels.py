from pydantic import BaseModel
from typing import List, Optional
from app.schemas.days import Day  # Importa il modello Pydantic Day per i giorni

# Classe base per il modello Travel
# Definisce i campi comuni a tutti i modelli Pydantic relativi ai viaggi
class TravelBase(BaseModel):
    town: str               # Paese 
    city: str               # Città 
    year: int               # Anno 
    start_date: str         # Data di inizio 
    end_date: str           # Data di fine 
    general_vote: Optional[float] = None  # Media del voto
    votes: Optional[dict] = None          # Voti (giorno, paesaggio, attività relax, prezzo, )

# Modello per creare un nuovo viaggio
# Aggiunge il campo 'days', lista di oggetti Day
class TravelCreate(TravelBase):
    days: List[Day] = []  # Lista dei giorni del viaggio, default vuota

# Modello per leggere un viaggio dal database
# Aggiunge il campo 'id' generato dal DB
class Travel(TravelBase):
    id: int              # ID univoco del viaggio
    days: List[Day] = [] # Lista dei giorni associati al viaggio

    class Config:
        # Permette a Pydantic di leggere dati direttamente da oggetti SQLAlchemy
        from_attributes = True
