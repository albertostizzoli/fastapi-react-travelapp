from pydantic import BaseModel # importo BaseModel per la validazione dei dati
from typing import List, Optional  # Importo i tipi List e Optional per annotare funzioni e variabili

# creo una classe Day per rappresentare i dati dei giorni di viaggio
class Day(BaseModel):
    id: Optional[int] = None
    date: str  # data
    title: str # titolo giornata
    address: str # indirizzo 
    description: str # descrizione giornata
    photo: List[str] = [] # foto
    lat: Optional[float] = None  # latitiudine
    lng: Optional[float] = None  # longitudine

# creo una classe Travel per rappresentare i dati dei dettagli del viaggio
class Travel(BaseModel):
    id: Optional[int] = None
    town: str  # paese
    city: str  # città
    year: int  # anno
    start_date: str  # data inizio
    end_date: str  # data fine
    general_vote: Optional[float] = None # voto generale
    votes: Optional[dict] = None # voti
    days: List[Day] = [] # giorni