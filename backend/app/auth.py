from datetime import datetime, timedelta # per gestire la scadenza del token
from jose import JWTError, jwt # libreria per creare e verificare i token JWT
from app.config import settings  # importa le impostazioni

# Funzione per creare il token JWT
def create_access_token(data: dict, expires_delta: timedelta | None = None): #  dati da includere nel token, durata del token
    to_encode = data.copy() # copio i dati
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)) # calcolo la scadenza
    to_encode.update({"exp": expire}) # aggiungo la scadenza ai dati
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM) # creo il token
    return encoded_jwt # ritorno il token

# Funzione per verificare il token JWT
def verify_token(token: str): # token da verificare
    try: 
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]) # decodifico il token
        return payload # ritorno i dati decodificati
    except JWTError: # se c'è un errore, ritorno None
        return None
