from sqlalchemy import Column, Integer, String, Float, ForeignKey, JSON  # definisco le colonne e tipi di dato per i modelli ORM
from sqlalchemy.orm import relationship # per poter gestire la relazione ORM bidirezionale
from app.database import Base  # importo la base ORM da cui derivano tutti i modelli

# Modello per la tabella "days" (giorni del viaggio)
class DayDB(Base):
    __tablename__ = "days"  # Nome della tabella nel database

    # Colonne della tabella
    id = Column(Integer, primary_key=True, index=True)  # ID univoco del giorno
    date = Column(String, nullable=False)               # data
    title = Column(String, nullable=False)              # titolo
    description = Column(String, nullable=True)         # descrizione
    tags = Column(JSON, nullable=True)                  # tags
    photo = Column(JSON, nullable=True)                 # foto
    lat = Column(Float, nullable=True)                  # latitudine
    lng = Column(Float, nullable=True)                  # longitudine

    # Colonna per la relazione con la tabella "travels"
    travel_id = Column(Integer, ForeignKey("travels.id"))  # Chiave esterna verso TravelDB
    travel = relationship("TravelDB", back_populates="days")  # Relazione con la classe TravelDB che si trova nel file travel_db.py
