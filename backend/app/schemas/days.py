from pydantic import BaseModel # importo la classe base di Pydantic per creare modelli di dati con validazione
from typing import List, Optional # importo List per array tipizzati e Optional per valori facoltativi

# classe che rappresenta i dati base di una tappa
class DayBase(BaseModel):
    city: str                       # città 
    date: str                       # data
    title: str                      # titolo
    description: str                # descrizione
    experiences: List[str] = []     # esperienze
    lat: Optional[float] = None     # latitudine
    lng: Optional[float] = None     # longitudine

# classe per creare una nuova tappa ereditando da DayBase
class DayCreate(DayBase):
    pass  # nessun campo aggiuntivo

# classe per restituire i dati delle tappe nel frontend ereditando da DayBase, ti serve se vuoi fare response_model=Day
class Day(DayBase):
    id: int                       # ID tappa
    photo: List[str] = []         # foto


    # classe Config per permettere a Pydantic di leggere dati direttamente da oggetti SQLAlchemy
    class Config:
        from_attributes = True
