from pydantic import BaseModel # BaseModel per creare modelli Pydantic
from typing import List # tipi generici: List per array tipizzati

# classe che serve quando l’utente manda un messaggio singolo alla rotta
class UserMessage(BaseModel):
    message: str
    mode: str = "chat" 
    chat_id: int | None = None

# modello Pydantic che rappresenta una chat completa con messaggi già salvati o da salvare.
class ChatBase(BaseModel):
     messages: List[dict] = []  # {role: str, text: str}

# modello Pydantic pper restituire la chat dal database. Necessario se vuoi fare response_model=Chat
class Chat(ChatBase):
    id: int              # ID univoco della chat
    user_id: int        # ID dell'utente associato

    class Config:
        # permette a Pydantic di leggere dati direttamente da oggetti SQLAlchemy
        from_attributes = True