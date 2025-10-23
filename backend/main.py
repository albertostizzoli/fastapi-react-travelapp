from fastapi import FastAPI # importo FastAPI
from fastapi.middleware.cors import CORSMiddleware # importo CORS

# importo i router delle API
from app.routers import travels, days, users, chats

# importo la configurazione del database
from app.database import Base, engine

# creo l'istanza principale di FastAPI
app = FastAPI()

# configuro il middleware CORS per permettere richieste da qualsiasi origine
# utile quando il frontend è su un dominio diverso dal backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       # permette richieste da tutti i domini
    allow_credentials=True,    # permette l'invio di cookie e credenziali
    allow_methods=["*"],       # permette tutti i metodi HTTP (GET, POST, PUT, DELETE...)
    allow_headers=["*"],       # permette tutti gli header personalizzati
)

# creo tutte le tabelle nel database se non esistono già
# "Base" contiene tutti i modelli SQLAlchemy registrati
Base.metadata.create_all(bind=engine)

# includo il router per ogni rotta al server
app.include_router(travels.router) # viaggi
app.include_router(days.router) # tappe
app.include_router(users.router) # utenti
app.include_router(chats.router) # chat AI
