from pydantic import BaseModel # BaseModel per creare modelli Pydantic
from typing import List # tipi generici: List per array tipizzati

# modello Pydantic per i messaggi di chat
class ChatBase(BaseModel):
     messages: List[dict] = []  # {role: str, text: str}


class ChatCreate(ChatBase):
    pass # schema per la creazione di una nuova chat (eredita da ChatBase)

class Chat(ChatBase):
    id: int              # ID univoco della chat
    user_id: int        # ID dell'utente associato

    class Config:
        # permette a Pydantic di leggere dati direttamente da oggetti SQLAlchemy
        from_attributes = True