from pydantic import BaseModel # definire schemi di dati con controlli di validazione
from typing import List, Optional # tipi generici: List per array tipizzati, Optional per valori facoltativi
from app.schemas.travels import Travel # importo il modello Pydantic Travel per i viaggi
from datetime import datetime # importo datetime per la data di registrazione

# modello Pydantic che rappresenta la tabella users
class UserBase(BaseModel):
    name: str                                   # nome
    surname: str                                # cognome
    email: str                                  # email
    experiences: Optional[List[str]] = None     # esperienze 
    photo: Optional[str] = None                 # foto profilo
    registration_date: datetime                 # data di registrazione

# modello Pydantic per creare un nuovo utente
class UserCreate(UserBase):
    password: str        # password

# modello Pydantic per restituire gli utenti e i loro viaggi dal database. Necessario se vuoi fare response_model=User
class User(UserBase):
    id: int            # ID univoco dell'utente
    travels: List[Travel] = []  # un utente ha una lista di viaggi

    class Config:
        # permette a Pydantic di leggere dati direttamente da oggetti SQLAlchemy
        from_attributes = True

