from sqlalchemy import Column, Integer, String, Float, JSON
from sqlalchemy.orm import relationship
from app.database import Base  # Importa la base ORM da cui derivano tutti i modelli

# Modello per la tabella "travels" (viaggi)
class TravelDB(Base):
    __tablename__ = "travels"  # Nome della tabella nel database

    # Colonne della tabella
    id = Column(Integer, primary_key=True, index=True)  # ID univoco del viaggio
    town = Column(String, nullable=False)              # Paese del viaggio
    city = Column(String, nullable=False)              # Città del viaggio
    year = Column(Integer, nullable=False)             # Anno del viaggio
    start_date = Column(String, nullable=False)        # Data di inizio del viaggio
    end_date = Column(String, nullable=False)          # Data di fine del viaggio
    general_vote = Column(Float, nullable=True)        # Voto generale del viaggio, opzionale
    votes = Column(JSON, nullable=True)                # Dettaglio voti o valutazioni, opzionale

    # Relazione ORM con la tabella "days"
    # back_populates="travel" crea una relazione bidirezionale con DayDB
    # cascade="all, delete" fa sì che se un viaggio viene cancellato, anche i giorni associati vengano rimossi
    days = relationship("DayDB", back_populates="travel", cascade="all, delete")
