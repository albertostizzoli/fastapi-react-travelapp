from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"messaggio": "Ciao da FastAPI!"}
