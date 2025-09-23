from datetime import datetime # importo datetime per formattare le date
import requests # per fare richieste HTTP

# creo una funzione per formattare le date
def format_date(date_str: str) -> str:
    try:
        # converto da YYYY-MM-DD (ISO) → DD-MM-YYYY
        return datetime.strptime(date_str, "%Y-%m-%d").strftime("%d-%m-%Y")
    except ValueError:
        return date_str  # se già formattata o non valida, la restituisco così com'è
    

# creo una funzione per ottenere latitudine e longitudine di una città usando Photon
def get_coordinates(place: str, city: str, country: str):
    """
    Usa Photon per ottenere coordinate (lat, lng) da:
    - titolo del giorno (luogo specifico)
    - città del viaggio
    - paese del viaggio
    """
    query = f"{place}, {city}, {country}"
    url = "https://photon.komoot.io/api/"
    params = {"q": query, "limit": 1}

    res = requests.get(url, params=params)

    if res.status_code == 200:
        data = res.json()
        if data.get("features"):
            coords = data["features"][0]["geometry"]["coordinates"]
            lng, lat = coords  # Photon restituisce [lon, lat]
            return lat, lng
    return None, None
