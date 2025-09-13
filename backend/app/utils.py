import os # per gestire i percorsi dei file
import json # per gestire i dati in formato json
from datetime import datetime # importo datetime per formattare le date
import requests # per fare richieste HTTP

TRAVELS_FILE = "data/travels.json" # file dove verrano salvati i dati dei viaggi

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
    
# creo una funzione per ottenere latitudine e longitudine di una città
def get_coordinates(place: str, city: str, country: str):
    """
    Usa Nominatim per ottenere coordinate (lat, lng) da:
    - titolo del giorno (luogo specifico)
    - città del viaggio
    - paese del viaggio
    """
    query = f"{place}, {city}, {country}"
    url = "https://nominatim.openstreetmap.org/search"
    params = {"q": query, "format": "json", "limit": 1}
    headers = {"User-Agent": "travel-app"}  # Nominatim richiede un user-agent

    res = requests.get(url, params=params, headers=headers)

    if res.status_code == 200 and res.json():
        data = res.json()[0]
        return float(data["lat"]), float(data["lon"])
    return None, None