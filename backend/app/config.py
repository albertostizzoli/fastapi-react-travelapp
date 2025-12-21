import os # per accedere alle variabili d'ambiente
from dotenv import load_dotenv # per caricare le variabili d'ambiente da .env
import cloudinary # per configurare Cloudinary
from pydantic_settings import BaseSettings # per gestire le impostazioni dell'app
from pydantic import BaseModel # importo BaseModel per la validazione dei dati
import google.generativeai as genai # importo la libreria GenerativeAI per la chat

# carico variabili da .env 
load_dotenv()

# Classe per gestire le impostazioni
class Settings(BaseSettings):
    SECRET_KEY: str # chiave segreta per JWT
    ALGORITHM: str # algoritmo di hashing per JWT
    ACCESS_TOKEN_EXPIRE_MINUTES: int # durata del token in minuti
    CLOUD_NAME_CLOUDINARY: str # nome del cloud su Cloudinary
    API_KEY_CLOUDINARY: str # chiave API di Cloudinary
    API_SECRET_CLOUDINARY: str # segreto API di Cloudinary
    GOOGLE_API_KEY: str # api_key di Google Gemini

# specifico che le variabili vengono lette da .env
    class Config:
        env_file = ".env"

# istanza globale
settings = Settings()

# Configurazione di Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUD_NAME_CLOUDINARY"),
    api_key=os.getenv("API_KEY_CLOUDINARY"),
    api_secret=os.getenv("API_SECRET_CLOUDINARY")
)

# configuro la API KEY di Google Gemini
genai.configure(
    api_key=os.getenv("GOOGLE_API_KEY")
)

# Configuro l'API di Google Generative AI
genai.configure(
    api_key=os.getenv("GOOGLE_API_KEY") 
)

# inizializzo un modello di tipo "gemini-2.0-flash" 
travel_model = genai.GenerativeModel(
    "gemini-2.0-flash",  # versione del modello Gemini
    system_instruction=(
        "Sei un assistente AI esperto e appassionato di viaggi, sempre disponibile a guidare l'utente come un consulente di viaggio personale. "
        "Fornisci consigli pratici e dettagliati su mete, itinerari, esperienze locali, attività, cultura, ristoranti, trasporti, alloggi, stagionalità e budget. "
        "Suggerisci alternative personalizzate e idee creative per rendere ogni viaggio unico e memorabile. "
        "Se l'utente fa più domande, affrontale tutte in modo chiaro, sintetico e organizzato. "
        "Evita ripetizioni e fornisci informazioni aggiornate e rilevanti. "
        "Rifiuta gentilmente o ignora domande fuori tema, mantenendo sempre un tono amichevole e coinvolgente. "
        "Alla fine di ogni risposta, poni una sola domanda di follow-up pertinente alla conversazione per aiutare l'utente a pianificare meglio il viaggio e stimolare ulteriori richieste."
    )
)



