from fastapi import FastAPI # importo FastAPI
from pydantic import BaseModel # importo BaseModel per la validazione dei dati
from typing import List 
import json # per gestire i dati in formato json
import os # per gestire i percorsi dei file

app = FastAPI() # creo l'istanza di FastAPI

# creo una classe Day per rappresentare i dati dei giorni di viaggio
class Day(BaseModel):
    date: str  # data
    notes: str # note
    photo: List[str] = [] # foto

# creo una classe Travel per rappresentare i dati dei dettagli del viaggio
class Travel(BaseModel):
    town: str  # paese
    city: str  # città
    year: int  # anno
    start_date: str  # data inizio
    end_date: str  # data fine
    general_vote: List[int] = None  # voto generale
    votes: List[dict] = None  # voti
    days: List[Day] = [] # giorni

TRAVELS_FILE = "travels.json" # file dove verrano salvati i dati

# creo una funzione per caricare i viaggi
def load_travels():
    if not os.path(TRAVELS_FILE): # controllo se il file esiste
        return []
    with open(TRAVELS_FILE, "r", encoding="utf-8") as f: # file aperto in modalità lettura
        return json.load(f) # dati caricati
    
# creo una funzione per scrivere i dati dei viaggi
def write_data(data):
    with open(TRAVELS_FILE, "w", encoding="utf-8") as f: # file aperto in modalità scrittura
        json.dump(data, f, indent=4, ensure_ascii=False) #salvo i dati in formato JSON


# FUNZIONE DI DEFAULT
@app.get("/")
def home():
    return {"messaggio": "Ciao da FastAPI!"}

