from fastapi import FastAPI, HTTPException # importo FastAPI e HTTPException 
from pydantic import BaseModel # importo BaseModel per la validazione dei dati
from typing import List, Optional
import json # per gestire i dati in formato json
import os # per gestire i percorsi dei file

app = FastAPI() # creo l'istanza di FastAPI

# creo una classe Day per rappresentare i dati dei giorni di viaggio
class Day(BaseModel):
    id: Optional[int] = None
    date: str  # data
    notes: str # esperienze
    photo: List[str] = [] # foto

# creo una classe Travel per rappresentare i dati dei dettagli del viaggio
class Travel(BaseModel):
    id: Optional[int] = None
    town: str  # paese
    city: str  # città
    year: int  # anno
    start_date: str  # data inizio
    end_date: str  # data fine
    general_vote: Optional[int] = None # voto generale
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

            travel["days"].append(day.dict()) # aggiungo il giorno
            write_data(travels) # salvo i dati aggiornati

            return {"messaggio": f"Giorno aggiunto al viaggio", "day": day}

    raise HTTPException(status_code=404, detail="Viaggio non trovato")


    