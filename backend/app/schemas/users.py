from pydantic import BaseModel # definire schemi di dati con controlli di validazione
from typing import List, Optional # tipi generici: List per array tipizzati, Optional per valori facoltativi
from app.schemas.travels import Travel
from datetime import datetime

# classe base per il modello User
# serve a definire i campi comuni a tutti i modelli Pydantic relativi agli utenti
class UserBase(BaseModel):
    name: str                              # nome
    surname: str                           # cognome
    email: str                             # email
    experiences: Optional[List[str]] = None  # esperienze 
    photo: Optional[str] = None            # foto profilo
    registration_date: datetime                 # data di registrazione

# modello per creare un nuovo utente
# eredita da UserBase, nessuna modifica aggiuntiva
class UserCreate(UserBase):
    password: str        # password

# modello per leggere un'utente già presente nel database
# aggiunge il campo 'id' che viene generato automaticamente dal DB
class User(UserBase):
    id: int            # ID univoco dell'utente
    travels: List[Travel] = []  # un utente ha una lista di viaggi

    class Config:
        # permette a Pydantic di leggere dati direttamente da oggetti SQLAlchemy
        from_attributes = True

