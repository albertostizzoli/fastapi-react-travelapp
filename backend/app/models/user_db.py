from sqlalchemy import Column, Integer, String, JSON, DateTime, func  # definisco le colonne e tipi di dato per i modelli ORM
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
    experiences = Column(JSON, nullable=True)             # interessi
    photo = Column(String, nullable=True)               # foto profilo
    registration_date = Column(DateTime(timezone=True), server_default=func.now())   # data di registrazione

    travels = relationship("TravelDB", back_populates="user")  # Relazione con la classe TravelDB che si trova nel file travel_db.py