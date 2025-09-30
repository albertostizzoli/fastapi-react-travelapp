from sqlalchemy import create_engine # per gestire la connessione con il database
from sqlalchemy.ext.declarative import declarative_base # per poter creare la base per i modelli ORM
from sqlalchemy.orm import sessionmaker # per generare sessioni per interagire con il DB

# URL del database MySQL
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:root@localhost:8889/travelapp_db" 

# engine serve per gestire la connessione con il database
engine = create_engine(SQLALCHEMY_DATABASE_URL) 

# autocommit=False → le modifiche devono essere confermate con commit()
# autoflush=False → le modifiche non vengono inviate automaticamente al DB finché non fai commit()
# bind=engine → lega la sessione all'engine creato sopra
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Tutti i modelli (classi che rappresentano le tabelle) dovranno ereditare da Base
Base = declarative_base()
