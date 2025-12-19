from datetime import datetime # importo datetime per formattare le date
import asyncio  # per usare asyncio.sleep e funzioni asincrone in FastAPI
import httpx     # client HTTP asincrono per fare richieste a Nominatim senza bloccare il server


# creo una funzione per formattare le date
def format_date(date_str: str) -> str:
    try:
        # converto da YYYY-MM-DD (ISO) → DD-MM-YYYY
        return datetime.strptime(date_str, "%Y-%m-%d").strftime("%d-%m-%Y")
    except ValueError:
        return date_str  # se già formattata o non valida, la restituisco così com'è
    

# creo una funzione per ottenere latitudine e longitudine di una città
async def get_coordinates(place: str | None, city: str | None, country: str | None):
    """
    Ottiene latitudine e longitudine usando Nominatim (OpenStreetMap).

    - place   : luogo specifico (es. "Piazza Navona")
    - city    : città (es. "Roma")
    - country : paese (es. "Italia")

    Ritorna:
    - (lat, lng) se trovate
    - (None, None) se non trovate
    """

    # Costruisce la query eliminando valori None o vuoti
    parts = [place, city, country]
    parts = [p.strip() for p in parts if p and p.strip()]
    query = ", ".join(parts)

    # Header OBBLIGATORIO per Nominatim
    headers = {
        "User-Agent": "TravelApp/1.0 (contact: albertostizzoli60@gmail.com)"
    }

    # Parametri della richiesta
    params = {
        "q": query,
        "format": "json",
        "limit": 1
    }

    try:
        # Client HTTP asincrono
        async with httpx.AsyncClient(timeout=5) as client:
            response = await client.get(
                "https://nominatim.openstreetmap.org/search",
                params=params,
                headers=headers
            )

        # Rispetta le policy di Nominatim (1 richiesta / secondo)
        await asyncio.sleep(1)

        # Se la richiesta è andata a buon fine
        if response.status_code == 200:
            data = response.json()
            if data:
                lat = float(data[0]["lat"])
                lng = float(data[0]["lon"])
                return lat, lng

    except Exception as e:
        # Qui puoi loggare se vuoi
        print("Geocoding error:", e)

    return None, None



