from sqlalchemy import Column, Integer, String, JSON  # definisco le colonne e tipi di dato per i modelli ORM
from sqlalchemy.orm import relationship # per poter gestire la relazione ORM bidirezionale
from app.database import Base  # Importa la base ORM da cui derivano tutti i modelli

class UserDB(Base):
    __tablename__ = 'users' # nome tabella del database

    # colonne della tabella
    id = Column(Integer, primary_key=True, index=True)  # ID univoco dell'utente
    name = Column(String, nullable=False)               # nome 
    surname = Column(String, nullable=False)            # cognome
    email = Column(String, nullable=False)              # email
    password = Column(String, nullable=False)           # password
    interests = Column(JSON, nullable=True)             # interessi

    travels = relationship("TravelDB", back_populates="user")  # Relazione con la classe TravelDB che si trova nel file travel_db.py