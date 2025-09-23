from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import travels, days
from app.database import Base, engine
from app.models import travel_db, day_db 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# crea tabelle se non esistono
Base.metadata.create_all(bind=engine)

app.include_router(travels.router)
app.include_router(days.router)



    