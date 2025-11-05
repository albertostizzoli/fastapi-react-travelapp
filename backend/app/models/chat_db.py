from sqlalchemy import Column, Integer, String, JSON, ForeignKey  # definisco le colonne e tipi di dato per i modelli ORM
from sqlalchemy.orm import relationship # per poter gestire la relazione ORM bidirezionale
from app.database import Base  # Importa la base ORM da cui derivano tutti i modelli

class ChatDB(Base):
    __tablename__ = 'chats' # nome tabella del database

    # colonne della tabella
    id = Column(Integer, primary_key=True, index=True)  # ID univoco della chat
    title = Column(String(255), nullable=True)          # titolo della chat
    messages = Column(JSON, nullable=False)             # messaggi 

    user_id = Column(Integer, ForeignKey("users.id")) # Chiave esterna
    user = relationship("UserDB", back_populates="chats") # Relazione con la tabella chats
