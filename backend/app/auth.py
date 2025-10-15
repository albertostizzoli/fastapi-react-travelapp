from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer # importo lo schema per ottenere il token
from datetime import datetime, timedelta # per gestire la scadenza del token
from jose import JWTError, jwt # libreria per creare e verificare i token JWT
from app.config import settings  # importo le impostazioni dal file config.py

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
    
# Definisce lo schema OAuth2 per ottenere un token JWT tramite login.
# `tokenUrl="/users/login"` indica l'endpoint che fornisce il token.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")

# Funzione per ottenere l'utente corrente in base al token fornito.
def get_current_user(token: str = Depends(oauth2_scheme)):
    # Verifica il token JWT. `verify_token` dovrebbe decodificare il token e restituire il payload (dati dell'utente).
    payload = verify_token(token)

    # Se il token non è valido o è scaduto, viene sollevata un'eccezione HTTP 401.
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token non valido o scaduto",
        )
     # Se il token è valido, restituisce il payload (informazioni dell'utente autenticato)
    return payload
