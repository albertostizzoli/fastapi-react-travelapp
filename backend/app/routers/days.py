from fastapi import APIRouter, HTTPException
from app.models.days import Day
from app.utils.travels import load_travels, write_data, format_date, get_coordinates

router = APIRouter(prefix="/travels", tags=["days"])


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


# creo una funzione per poter modificare un giorno del viaggio
@router.put("/{travel_id}/days/{day_id}")
def update_day(travel_id: int, day_id: int, updated_day: Day):
    travels = load_travels()

    for travel in travels:
        if travel["id"] == travel_id:
            for i, day in enumerate(travel["days"]):  # supponendo che i giorni siano in travel["days"]
                if day["id"] == day_id:
                    # aggiorno i dati del giorno
                    updated_day.id = day_id

                    # ottengo coordinate aggiornate
                    lat, lng = get_coordinates(updated_day.title, travel["city"], travel["town"])
                    if lat and lng:
                        updated_day.lat = lat
                        updated_day.lng = lng

                    travel["days"][i] = updated_day.dict()
                    write_data(travels)
                    return updated_day

    raise HTTPException(status_code=404, detail="Giorno o viaggio non trovato")


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
