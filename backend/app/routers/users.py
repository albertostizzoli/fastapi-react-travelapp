from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form # strumenti di FastAPI: routing, injection delle dipendenze, gestione errori, caricamento file, gestione form
from sqlalchemy.orm import Session # sessione ORM per interagire con il database
from app.database import SessionLocal # connessione locale al DB (crea le sessioni)
from app.models.user_db import UserDB # modello ORM per la tabella dei viaggi
from app.schemas.users import User # schemas Pydantic per validare input/output
from app.models.travel_db import TravelDB # modello ORM per la tabella dei viaggi
from app.utils.users import get_password_hash, verify_password, validate_password # importo le funzioni per hashare, verificare e validare la password
from app.config import cloudinary  # importo la configurazione di Cloudinary
import cloudinary.uploader  # per caricare immagini su Cloudinary
import json # per gestire la conversione da stringa JSON a lista Python
from app.auth import create_access_token # importo la funzione per creare il token JWT
from app.config import settings # importo le impostazioni
from datetime import timedelta # per gestire la durata del token

# creo il router per il modulo "users"
router = APIRouter(prefix="/users", tags=["users"])

# Dependency: fornisce una sessione di database a ogni richiesta API.
# La sessione viene creata all'inizio, resa disponibile tramite yield,
# e chiusa automaticamente alla fine della richiesta (pattern try/finally).
def get_db():
    db = SessionLocal()
    try:
        yield db  # restituisce la sessione da usare nelle query
    finally:
        db.close()  # chiude la sessione per evitare memory leak


# GET: Funzione per ottenere tutti gli utenti
@router.get("/", response_model=list[User])
def get_users(db: Session = Depends(get_db)):
    return db.query(UserDB).all()  # mi restituisce tuti gli utenti


#  GET: Funzione per ottenere un utente singolo tramite ID
@router.get("/{user_id}", response_model=User)
def get_user(user_id: int, db: Session = Depends(get_db)): # ID dell'utente, , Sessione DB iniettata come dipendenza (Depends)
    user = db.query(UserDB).filter(UserDB.id == user_id).first() # ottengo l'utente
    if not user:
        raise HTTPException(status_code=404, detail="Utente non trovato")
    return user


# POST: Funzione per aggiungere un nuovo utente
@router.post("/", response_model=User)
async def add_user(
    name: str = Form(...),
    surname: str = Form(...),
    email: str = Form(...), 
    password: str = Form(...),
    interests: str = Form(None),  # ricevo gli interessi come stringa JSON
    photo: UploadFile = File(None),  # ricevo la foto come file
    db: Session = Depends(get_db)
):
    # controllo se l'utente già esiste
    existing_user = db.query(UserDB).filter(UserDB.email == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email già registrata")
    
    # validazione password
    if password:
        validation = validate_password(password)
        if not validation["is_valid"]:
            raise HTTPException(
                status_code=400,
                detail={
                    "msg": "La password non rispetta i requisiti di sicurezza",
                    "errors": validation["errors"]
                }
            )
    
     # decodifica la stringa JSON in lista Python
    interests_list = []
    if interests:
        try:
            interests_list = json.loads(interests) # converto la stringa JSON in lista Python
        except Exception:
            interests_list = [interests] 
    
    # carico la foto su Cloudinary se presente
    photo_url = None 
    if photo:
        upload_result = cloudinary.uploader.upload(photo.file) 
        photo_url = upload_result.get("secure_url")  # ottengo l'URL sicuro della foto caricata

    # creo il record dell'utente
    db_user = UserDB(
        name = name,
        surname = surname,
        email = email,
        password=get_password_hash(password),  # salvo password hashata
        interests = interests_list,  # salvo la lista degli interessi
        photo = photo_url # salvo l'URL della foto 
    )
    db.add(db_user)      # l'utente viene salvato
    db.commit()          # modifiche salvate
    db.refresh(db_user)  # database aggiornato

    return db_user       # mi restituisce l'utente creato


# PUT: Funzione per modificare un utente  
@router.put("/{user_id}", response_model=User)
async def update_user(
    user_id: int,
    name: str = Form(...),
    surname: str = Form(...),
    email: str = Form(...), 
    password: str = Form(...),
    interests: str = Form(None),
    photo: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    # trova l'utente nel DB
    user = db.query(UserDB).filter(UserDB.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utente non trovato")

    # validazione password
    if password:
        validation = validate_password(password)
        if not validation["is_valid"]:
            raise HTTPException(
                status_code=400,
                detail={
                    "msg": "La password non rispetta i requisiti di sicurezza",
                    "errors": validation["errors"]
                }
            )

    # decodifica gli interessi da stringa JSON a lista Python
    interests_list = None
    if interests:
        try:
            interests_list = json.loads(interests)
        except Exception:
            interests_list = [interests]

    # carica la foto su Cloudinary se presente
    photo_url = user.photo  # mantieni la vecchia se non viene cambiata
    if photo:
        upload_result = cloudinary.uploader.upload(photo.file)
        photo_url = upload_result.get("secure_url")

    # aggiorna i campi
    user.name = name
    user.surname = surname
    user.email = email

    # aggiorna la password solo se ne è stata inviata una nuova
    if password:
       user.password = get_password_hash(password)

    user.interests = interests_list
    user.photo = photo_url

    db.commit()       # modifiche salvate
    db.refresh(user)  # database aggiornato

    return user



# DELETE: Funzione per cancellare un utente
@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utente non trovato")
    
    # elimina i viaggi dell'utente
    db.query(TravelDB).filter(TravelDB.user_id == user_id).delete()

    db.delete(user)     # elimina l'utente
    db.commit()         # conferma le modifiche nel DB
    return {"messaggio": f"Utente {user_id} eliminato con successo"}


# POST: Rotta del login
@router.post("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.email == email).first() # cerco l'utente tramite email
    if not user:
        raise HTTPException(status_code=400, detail="Email non registrata") # se non esiste, errore

    if not verify_password(password, user.password): #  verifico la password
        raise HTTPException(status_code=400, detail="Password errata")

    # crea il token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES) # durata del token
    access_token = create_access_token( #   creo il token
        data={"sub": user.email, "id": user.id}, #  dati da includere nel token
        expires_delta=access_token_expires #   durata del token
    )

# ritorno il token e i dati dell'utente (esclusa la password
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "message": "Login effettuato con successo"
    }