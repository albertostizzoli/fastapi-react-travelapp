from pydantic import BaseModel
from typing import List, Optional

# Classe base per il modello Day
# Serve a definire i campi comuni a tutti i modelli Pydantic relativi ai giorni
class DayBase(BaseModel):
    date: str               # Data del giorno
    title: str              # Titolo della giornata
    description: str        # Descrizione del giorno
    photo: List[str] = []   # Lista di foto, default vuota
    lat: Optional[float] = None  # Latitudine, opzionale
    lng: Optional[float] = None  # Longitudine, opzionale

# Modello per creare un nuovo giorno
# Eredita da DayBase, nessuna modifica aggiuntiva
class DayCreate(DayBase):
    pass

# Modello per leggere un giorno già presente nel database
# Aggiunge il campo 'id' che viene generato automaticamente dal DB
class Day(DayBase):
    id: int

    class Config:
        # Configurazione per abilitare Pydantic a leggere dati da oggetti ORM
        from_attributes = True
