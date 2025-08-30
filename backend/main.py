from fastapi import FastAPI, HTTPException # importo FastAPI e HTTPException 
from pydantic import BaseModel # importo BaseModel per la validazione dei dati
from typing import List, Optional  # Importo i tipi List e Optional per annotare funzioni e variabili
import json # per gestire i dati in formato json
import os # per gestire i percorsi dei file
from datetime import datetime # importo datetime per formattare le date

from fastapi.middleware.cors import CORSMiddleware # importo e configuro il middleware CORS

app = FastAPI() # creo l'istanza di FastAPI

# Abilito CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# creo una classe Day per rappresentare i dati dei giorni di viaggio
class Day(BaseModel):
    id: Optional[int] = None
    date: str  # data
    notes: str # titolo giornata
    description: str # descrizione giornata
    photo: List[str] = [] # foto

# creo una classe Travel per rappresentare i dati dei dettagli del viaggio
class Travel(BaseModel):
    id: Optional[int] = None
    town: str  # paese
    city: str  # città
    year: int  # anno
    start_date: str  # data inizio
    end_date: str  # data fine
    general_vote: Optional[float] = None # voto generale
    votes: Optional[dict] = None # voti
    days: List[Day] = [] # giorni

TRAVELS_FILE = "travels.json" # file dove verrano salvati i dati

# creo una funzione per caricare i viaggi
def load_travels():
    if not os.path.exists(TRAVELS_FILE): # controllo se il file esiste
        return []
    with open(TRAVELS_FILE, "r", encoding="utf-8") as f: # file aperto in modalità lettura
        return json.load(f) # dati caricati


# creo una funzione per scrivere i dati dei viaggi
def write_data(data):
    with open(TRAVELS_FILE, "w", encoding="utf-8") as f: # file aperto in modalità scrittura
        json.dump(data, f, indent=4, ensure_ascii=False) #salvo i dati in formato JSON

# creo una funzione per formattare le date
def format_date(date_str: str) -> str:
    try:
        # converto da YYYY-MM-DD (ISO) → DD-MM-YYYY
        return datetime.strptime(date_str, "%Y-%m-%d").strftime("%d-%m-%Y")
    except ValueError:
        return date_str  # se già formattata o non valida, la restituisco così com'è


# creo una funzione per ottenere tutti i viaggi
@app.get("/travels")
def get_travels():
    return load_travels()


# creo una funzione che mi restituisce un solo viaggio con i suoi dettagli
@app.get("/travels/{travel_id}")
def get_travel(travel_id: int):
    travels = load_travels()
    for travel in travels:
        if travel["id"] == travel_id: # se l'id del viaggio corrisponde mi restituisce il viaggio
            return travel
    raise HTTPException(status_code=404, detail="Viaggio non trovato") # altrimenti mi da errore


# creo una funzione per aggiungere un nuovo viaggio
@app.post("/travels")
def add_travel(travel: Travel):
    travels = load_travels()
    new_id = max([t["id"] for t in travels], default=0) + 1 # genero un nuovo id per il viaggio
    travel.id = new_id

     # formatto le date
    travel.start_date = format_date(travel.start_date)
    travel.end_date = format_date(travel.end_date)

    for i, day in enumerate(travel.days, start=1): # assegno id progressivi ai giorni
        day.id = i
    travels.append(travel.dict()) # converto in dict e salvo
    write_data(travels)
    return travel


# creo una funzione per modificare i viaggi
@app.put("/travels/{travel_id}")
def update_travel(travel_id: int, updated_travel: Travel):
    travels = load_travels()

    for i, travel in enumerate(travels):
        if travel["id"] == travel_id:
            updated_travel.id = travel_id # mantengo lo stesso id

            for j, day in enumerate(updated_travel.days, start=1): # aggiorno id dei giorni
                day.id = j
            travels[i] = updated_travel.dict()
            write_data(travels)
            return updated_travel
        
    raise HTTPException(status_code=404, detail="Viaggio non trovato")


# creo una funzione per cancellare i viaggi
@app.delete("/travels/{travel_id}")
def delete_travel(travel_id: int):
    travels = load_travels()

    for i, travel in enumerate(travels):
        if travel["id"] == travel_id:
            travels.pop(i)  # rimuovo il viaggio dalla lista
            write_data(travels)  # salvo i viaggi aggiornati
            return {"messaggio": f"Viaggio eliminato con successo"}

    raise HTTPException(status_code=404, detail="Viaggio non trovato")


# creo una funzione per poter aggiungere un giorno ad un viaggio
@app.post("/travels/{travel_id}/days")
def add_day_travel(travel_id: int, day: Day):
    travels = load_travels()

    for travel in travels:
        if travel["id"] == travel_id:
            new_day_id = max([d["id"] for d in travel["days"]], default=0) + 1 # calcolo nuovo id per il giorno
            day.id = new_day_id

            # formatto la data del giorno
            day.date = format_date(day.date)

            travel["days"].append(day.dict()) # aggiungo il giorno
            write_data(travels) # salvo i dati aggiornati

            return {"messaggio": f"Giorno aggiunto al viaggio", "day": day}

    raise HTTPException(status_code=404, detail="Viaggio non trovato")


# creo una funzione per poter cancellare un giorno dal viaggio
@app.delete("/travels/{travel_id}/days/{day_id}")
def delete_day_travel(travel_id: int, day_id: int):
    travels = load_travels()

    for travel in travels:
        if travel["id"] == travel_id:
            
            for day in travel["days"]: # cerco il giorno da cancellare
                if day["id"] == day_id: # se l'id del giorno corrisponde
                    travel["days"].remove(day) # viene rimosso
                    write_data(travels) # e i dati vengpno aggiornati
                    return {"messaggio": f"Giorno {day_id} eliminato dal viaggio {travel_id}"}
            
            raise HTTPException(status_code=404, detail="Giorno non trovato")
    raise HTTPException(status_code=404, detail="Viaggio non trovato")


    