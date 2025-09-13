from fastapi import APIRouter, HTTPException
from app.models import Travel, Day
from app.utils import load_travels, write_data, format_date, get_coordinates

router = APIRouter(prefix="/travels", tags=["travels"])

# creo una funzione per ottenere tutti i viaggi
@router.get("/")
def get_travels():
    return load_travels()


# creo una funzione che mi restituisce un solo viaggio con i suoi dettagli
@router.get("/{travel_id}")
def get_travel(travel_id: int):
    travels = load_travels()
    for travel in travels:
        if travel["id"] == travel_id: # se l'id del viaggio corrisponde mi restituisce il viaggio
            return travel
    raise HTTPException(status_code=404, detail="Viaggio non trovato") # altrimenti mi da errore


# creo una funzione per aggiungere un nuovo viaggio
@router.post("/")
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
@router.put("/{travel_id}")
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
@router.delete("/{travel_id}")
def delete_travel(travel_id: int):
    travels = load_travels()

    for i, travel in enumerate(travels):
        if travel["id"] == travel_id:
            travels.pop(i)  # rimuovo il viaggio dalla lista
            write_data(travels)  # salvo i viaggi aggiornati
            return {"messaggio": f"Viaggio eliminato con successo"}

    raise HTTPException(status_code=404, detail="Viaggio non trovato")


# creo una funzione per poter aggiungere un giorno ad un viaggio
@router.post("/{travel_id}/days")
def add_day_travel(travel_id: int, day: Day):
    travels = load_travels()

    for travel in travels:
        if travel["id"] == travel_id:
            new_day_id = max([d["id"] for d in travel["days"]], default=0) + 1
            day.id = new_day_id

            # formatto la data del giorno
            day.date = format_date(day.date)

            # Recupero coordinate dal titolo della giornata
            lat, lng = get_coordinates(day.title, travel["city"], travel["town"])
            if lat and lng:
               day.lat = lat
               day.lng = lng

            # Aggiungo il giorno al viaggio
            travel["days"].append(day.dict())
            write_data(travels)

            return {"messaggio": f"Giorno aggiunto al viaggio", "day": day}

    raise HTTPException(status_code=404, detail="Viaggio non trovato")


# creo una funzione per poter cancellare un giorno dal viaggio
@router.delete("/{travel_id}/days/{day_id}")
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