from pydantic import BaseModel # importo BaseModel per la validazione dei dati
from typing import List, Optional  # Importo i tipi List e Optional per annotare funzioni e variabili

# creo una classe Day per rappresentare i dati dei giorni di viaggio
class Day(BaseModel):
    id: Optional[int] = None
    date: str  # data
    title: str # titolo giornata
    description: str # descrizione giornata
    photo: List[str] = [] # foto
    lat: Optional[float] = None  # latitiudine
    lng: Optional[float] = None  # longitudine