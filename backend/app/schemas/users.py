from pydantic import BaseModel # importo la classe base di Pydantic per creare modelli di dati con validazione
from typing import List, Optional # importo List per array tipizzati e Optional per valori facoltativi
from app.schemas.travels import Travel # importo la classe Travel per i viaggi
from datetime import datetime # importo datetime per la data di registrazione

# classe che rappresenta i dati di un utente
class UserBase(BaseModel):
    name: str                                   # nome
    surname: str                                # cognome
    email: str                                  # email
    experiences: Optional[List[str]] = None     # esperienze 
    photo: Optional[str] = None                 # foto profilo
    registration_date: datetime                 # data di registrazione

# classe per creare un nuovo utente, eredita da UserBase
class UserCreate(UserBase):
    password: str        # password

# classe per restituire i dati degli utenti dal database nel frontend, eredita da UserBase, ti occorre se vuoi fare response_model=User
class User(UserBase):
    id: int                     # ID univoco dell'utente
    travels: List[Travel] = []  # un utente ha una lista di viaggi

    # classe Config per permettere a Pydantic di leggere dati direttamente da oggetti SQLAlchemy
    class Config:
        from_attributes = True

