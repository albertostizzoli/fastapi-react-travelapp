from fastapi import FastAPI # importo FastAPI 
from fastapi.middleware.cors import CORSMiddleware # importo e configuro il middleware CORS
from app.routes import travels  # importo il router dei viaggi

app = FastAPI() # creo l'istanza di FastAPI

# Abilito CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Includo il router dei viaggi
app.include_router(travels.router)


    