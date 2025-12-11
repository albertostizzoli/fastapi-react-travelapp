from pydantic import BaseModel # importo la classe base di Pydantic per creare modelli di dati con validazione
from typing import List # importo List per array tipizzati

# classe  che serve quando l’utente manda un messaggio singolo alla rotta
class UserMessage(BaseModel):
    message: str                  # testo del messaggio dell'utente
    mode: str = "chat"            # modalità della chat, default "chat"
    chat_id: int | None = None    # ID della chat, opzionale

# classe che serve per richiedere raccomandazioni di viaggio
class RecommendationRequest(BaseModel):
    chat_id: int | None = None   # ID della chat, opzionale

# classe che rappresenta una chat completa con messaggi già salvati
class ChatBase(BaseModel):
     messages: List[dict] = [] # lista di messaggi nella chat

# classe per restituire le chat dal database nel frontend ereditando da ChatBase, ti serve se vuoi fare response_model=Chat
class Chat(ChatBase):
    id: int              # ID univoco della chat
    user_id: int         # ID dell'utente associato

    # classe Config per permettere a Pydantic di leggere dati direttamente da oggetti SQLAlchemy
    class Config:
        from_attributes = True