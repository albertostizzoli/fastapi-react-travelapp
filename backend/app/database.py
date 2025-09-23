from sqlalchemy import create_engine # per gestire la connessione con il database
from sqlalchemy.ext.declarative import declarative_base # per poter creare la base per i modelli ORM
from sqlalchemy.orm import sessionmaker # per generare sessioni per interagire con il DB

# URL del database SQLite
SQLALCHEMY_DATABASE_URL = "sqlite:///./travelapp.db"

# connect_args={"check_same_thread": False} è necessario per SQLite quando si usano più thread (come con FastAPI)
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# autocommit=False → le modifiche devono essere confermate con commit()
# autoflush=False → le modifiche non vengono inviate automaticamente al DB finché non fai commit()
# bind=engine → lega la sessione all'engine creato sopra
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Tutti i modelli (classi che rappresentano le tabelle) dovranno ereditare da Base
Base = declarative_base()
