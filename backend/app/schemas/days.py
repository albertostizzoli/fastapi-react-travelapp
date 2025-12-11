from pydantic import BaseModel # definire schemi di dati con controlli di validazione
from typing import List, Optional # tipi generici: List per array tipizzati, Optional per valori facoltativi

# modello Pydantic che raprresenta  la tabella days
class DayBase(BaseModel):
    city: str                       # città 
    date: str                       # data
    title: str                      # titolo
    description: str                # descrizione
    experiences: List[str] = []     # esperienze
    lat: Optional[float] = None     # latitudine
    lng: Optional[float] = None     # longitudine

# modello Pydantic per creare un nuovo giorno
class DayCreate(DayBase):
    pass

# modello Pydantic per restituire un giorno dal database. Necessario se vuoi fare response_model=Day
class Day(DayBase):
    id: int                       # ID tappa
    photo: List[str] = []         # foto


    class Config:
        # permette a Pydantic di leggere dati direttamente da oggetti SQLAlchemy
        from_attributes = True
