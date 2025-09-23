from sqlalchemy import Column, Integer, String, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base  # Importa la base ORM da cui derivano tutti i modelli

# Modello per la tabella "days" (giorni del viaggio)
class DayDB(Base):
    __tablename__ = "days"  # Nome della tabella nel database

    # Colonne della tabella
    id = Column(Integer, primary_key=True, index=True)  # ID univoco del giorno
    date = Column(String, nullable=False)              # Data del giorno
    title = Column(String, nullable=False)             # Titolo della giornata
    description = Column(String, nullable=False)       # Descrizione della giornata
    photo = Column(JSON, nullable=True)                # Lista di foto (JSON)
    lat = Column(Float, nullable=True)                 # Latitudine
    lng = Column(Float, nullable=True)                 # Longitudine

    # Colonna per la relazione con la tabella "travels"
    travel_id = Column(Integer, ForeignKey("travels.id"))  # Chiave esterna verso TravelDB
    travel = relationship("TravelDB", back_populates="days")  # Relazione ORM bidirezionale
