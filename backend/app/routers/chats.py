from fastapi import APIRouter
from app.config import genai, UserMessage

# creo il router per la chat AI
router = APIRouter(prefix="/chats")

@router.post("/")
def recommend(msg: UserMessage):
    model = genai.GenerativeModel("gemini-2.0-flash")

    if msg.mode == "json":
        prompt = f"""
        L'utente ha scritto: "{msg.message}".
        Rispondi in due parti:
        1. Una risposta conversazionale in stile chat.
        2. Alla fine, fornisci anche i dati in formato JSON con:
           - nome
           - attrazioni
           - motivo
           - costo stimato (basso/medio/alto)
        """
    else:
        prompt = f"L'utente ha scritto: '{msg.message}'. Rispondi in modo naturale e amichevole."

    response = model.generate_content(prompt)
    return {"response": response.text}