from fastapi import APIRouter, Depends, HTTPException # strumenti di FastAPI: routing, injection delle dipendenze, gestione errori
from sqlalchemy.orm import Session # sessione ORM per interagire con il database
from app.database import SessionLocal # connessione locale al DB (crea le sessioni)
from app.models.user_db import UserDB # modello ORM per la tabella dei viaggi
from app.schemas.users import User, UserCreate # schemi Pydantic per validare input/output
from app.utils.users import get_password_hash, verify_password # importo le funzioni per hashare e verificare la password

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
        password=get_password_hash(user.password)  # salvo password hashata
    )
    db.add(db_user)      # l'utente viene salvato
    db.commit()          # modifiche salvate
    db.refresh(db_user)  # database aggiornato

    return db_user       # mi restituisce l'utente creato


# PUT: Funzione per modificare un utente  
@router.put("/{user_id}", response_model=User)
def update_user(user_id: int, updated_user: UserCreate, db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.id == user_id).first() # Modifica l'id dell'utente selezionato
    if not user:
        raise HTTPException(status_code=404, detail="Utente non trovato")

    # aggiorno i campi dell'utente
    user.name = updated_user.name
    user.surname = updated_user.surname
    user.email = updated_user.email
    user.password = get_password_hash(updated_user.password)

    db.commit()        # modifiche salvate
    db.refresh(user)   # database aggiornato
    return user        # utente modificato


# DELETE: Funzione per cancellare un utente
@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utente non trovato")

    db.delete(user)     # elimina l'utente
    db.commit()         # conferma le modifiche nel DB
    return {"messaggio": f"Utente {user_id} eliminato con successo"}


# POST: Rotta del login
@router.post("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.email == email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Email non registrata")

    if not verify_password(password, user.password):
        raise HTTPException(status_code=400, detail="Password errata")

    return {"message": "Login effettuato con successo", "user_id": user.id}
