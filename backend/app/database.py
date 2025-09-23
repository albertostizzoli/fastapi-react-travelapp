from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Definisce l'URL del database SQLite
# sqlite:///./travelapp.db indica un file locale chiamato travelapp.db nella stessa cartella
SQLALCHEMY_DATABASE_URL = "sqlite:///./travelapp.db"

# Crea l'engine di SQLAlchemy, che gestisce la connessione al database
# connect_args={"check_same_thread": False} è necessario per SQLite quando si usano più thread (come con FastAPI)
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Crea un oggetto "SessionLocal" che genera sessioni per interagire con il DB
# autocommit=False → le modifiche devono essere confermate con commit()
# autoflush=False → le modifiche non vengono inviate automaticamente al DB finché non fai commit()
# bind=engine → lega la sessione all'engine creato sopra
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Crea la "base" per i modelli ORM
# Tutti i modelli (classi che rappresentano le tabelle) dovranno ereditare da Base
Base = declarative_base()
