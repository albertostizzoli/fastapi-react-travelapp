from pydantic import BaseModel # definire schemi di dati con controlli di validazione
from typing import List, Optional # tipi generici: List per array tipizzati, Optional per valori facoltativi

# classe base per il modello Day
# serve a definire i campi comuni a tutti i modelli Pydantic relativi ai giorni
class DayBase(BaseModel):
    date: str               # data
    title: str              # titolo
    description: str        # descrizione
    lat: Optional[float] = None  # latitudine
    lng: Optional[float] = None  # longitudine

# modello per creare un nuovo giorno
# eredita da DayBase, nessuna modifica aggiuntiva
class DayCreate(DayBase):
    pass

# modello per leggere un giorno già presente nel database
# aggiunge il campo 'id' che viene generato automaticamente dal DB
class Day(DayBase):
    id: int
    photo: List[str] = []   # foto

    class Config:
        # permette a Pydantic di leggere dati direttamente da oggetti SQLAlchemy
        from_attributes = True
