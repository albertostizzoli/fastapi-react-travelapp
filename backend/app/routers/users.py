from fastapi import APIRouter, Depends, HTTPException # strumenti di FastAPI: routing, injection delle dipendenze, gestione errori
from sqlalchemy.orm import Session # sessione ORM per interagire con il database
from app.database import SessionLocal # connessione locale al DB (crea le sessioni)
from app.models.user_db import UserDB # modello ORM per la tabella dei viaggi
from app.schemas.users import User, UserCreate # schemi Pydantic per validare input/output
from app.utils.users import get_password_hash, verify_password 

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

# Rotta di registrazione per aggiungere un nuovo utente
@router.post("/", response_model=User)
def add_user(user: UserCreate,  db: Session = Depends(get_db)):
    # controllo se email già esiste
    existing_user = db.query(UserDB).filter(UserDB.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email già registrata")

    # creo il record dell'utente
    db_user = UserDB(
        name = user.name,
        surname = user.surname,
        email = user.email,
        password=get_password_hash(user.password)  # salvo hash, non password in chiaro
    )
    db.add(db_user)      # l'utente viene salvato
    db.commit()          # modifiche salvate
    db.refresh(db_user)  # database aggiornato

    return db_user       # mi restituisce l'utente creato

# Rotta del login
@router.post("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.email == email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Email non registrata")

    if not verify_password(password, user.password):
        raise HTTPException(status_code=400, detail="Password errata")

    return {"message": "Login effettuato con successo", "user_id": user.id}
