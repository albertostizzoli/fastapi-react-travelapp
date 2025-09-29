from sqlalchemy import Column, Integer, String, Float, ForeignKey, JSON  # definisco le colonne e tipi di dato per i modelli ORM
from sqlalchemy.orm import relationship # per poter gestire la relazione ORM bidirezionale
from app.database import Base  # Importa la base ORM da cui derivano tutti i modelli

# Modello per la tabella "travels" (viaggi)
class TravelDB(Base):
    __tablename__ = "travels"  # Nome della tabella nel database

    # Colonne della tabella
    id = Column(Integer, primary_key=True, index=True)  # ID univoco del viaggio
    town = Column(String, nullable=False)              # paese
    city = Column(String, nullable=False)              # città 
    year = Column(Integer, nullable=False)             # anno 
    start_date = Column(String, nullable=False)        # data inizio
    end_date = Column(String, nullable=False)          # data fine
    general_vote = Column(Float, nullable=True)        # media dei voti
    votes = Column(JSON, nullable=True)                # # voti (giorno, paesaggio, attività relax, prezzo)

    # Relazione ORM con la tabella "days"
    # back_populates="travel" crea una relazione bidirezionale con DayDB
    # cascade="all, delete" fa sì che se un viaggio viene cancellato, anche i giorni associati vengano rimossi
    days = relationship("DayDB", back_populates="travel", cascade="all, delete")

    user_id = Column(Integer, ForeignKey("users.id")) # Chiave esterna
    user = relationship("UserDB", back_populates="travels") # Relazione con la tabella users
