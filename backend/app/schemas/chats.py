from pydantic import BaseModel # definire schemi di dati con controlli di validazione
from typing import List, Optional # tipi generici: Optional per valori facoltativi

class Messages(BaseModel):
    role: str          # ruolo del messaggio (es. "user" o "ai")
    content: str       # contenuto del messaggio

# classe base per il modello Chat
# definisce i campi comuni a tutti i modelli Pydantic relativi alle chat
class ChatBase(BaseModel):
    messages: List[Messages]           # messaggi 
    title: Optional[str] = None        # titolo della chat
    user_id: Optional[int] = None

# modello per creare una nuova chat
class ChatCreate(ChatBase):
    pass

# modello per leggere una chat dal database
class Chat(ChatBase):
    id: int              # ID univoco della chat

    class Config:
        # permette a Pydantic di leggere dati direttamente da oggetti SQLAlchemy
        from_attributes = True