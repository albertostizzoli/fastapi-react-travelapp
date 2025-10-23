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

# creo la classe UserMessage per il model
class UserMessage(BaseModel):
    message: str
    mode: str = "chat" 

# configuro la API KEY di Google Gemini
genai.configure(
    api_key=os.getenv("GOOGLE_API_KEY")
)

