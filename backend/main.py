from fastapi import FastAPI # importo FastAPI 
from fastapi.middleware.cors import CORSMiddleware # importo e configuro il middleware CORS
from app.routers import travels  # importo il router dei viaggi
from app.routers import days  # importo il router dei giorni

app = FastAPI() # creo l'istanza di FastAPI

# Abilito CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Includo il router dei viaggi e dei giorni
app.include_router(travels.router)
app.include_router(days.router)


    