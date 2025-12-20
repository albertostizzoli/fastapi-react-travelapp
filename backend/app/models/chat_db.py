from sqlalchemy import Column, String, JSON, Integer, ForeignKey  # definisco le colonne e tipi di dato per i modelli ORM
from sqlalchemy.orm import relationship # per poter gestire la relazione ORM bidirezionale
from app.database import Base  # Importa la base ORM da cui derivano tutti i modelli

# Modello per la tabella "chats"
class ChatDB(Base):
    __tablename__ = "chats"  # Nome della tabella nel database

    # Colonne della tabella
    id = Column(Integer, primary_key=True, index=True)    # ID univoco della chat
    title = Column(String, nullable=False)                # titolo della chat
    messages = Column(JSON, nullable=False)               # messaggi della chat in formato JSON

    user_id = Column(Integer, ForeignKey("users.id"))     # Chiave esterna
    user = relationship("UserDB", back_populates="chats") # Relazione con la tabella users