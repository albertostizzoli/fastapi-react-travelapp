from fastapi import APIRouter
from app.config import genai, UserMessage

# creo il router per la chat AI
router = APIRouter(prefix="/chats")

@router.post("/")
def generate_message(msg: UserMessage):
    model = genai.GenerativeModel("gemini-2.0-flash")

    # Analisi dell’intento dell’utente
    intent_prompt = f"""
    Analizza la seguente frase e dimmi in una sola parola l'intento principale:
    "{msg.message}"
    Esempi: viaggio, cucina, tecnologia, musica, sport, curiosità, codice, business, salute, motivazione, tempo, altro.
    Rispondi SOLO con una parola.
    """
    intent = model.generate_content(intent_prompt).text.strip().lower()

    # Costruzione dinamica del prompt principale
    base_prompt = f"L'utente ha chiesto: '{msg.message}'. "
    
    if msg.mode == "json":
        prompt = f"""
        {base_prompt}
        Capisci il contesto ({intent}) e rispondi in due parti:
        1. Una risposta naturale e amichevole alla richiesta.
        2. Alla fine, fornisci anche un blocco JSON con:
           - "nome": il tema o la persona coinvolta
           - "attrazioni": eventuali punti di interesse correlati
           - "motivo": perché può essere utile o interessante
           - "costo stimato": 'basso', 'medio' o 'alto'
        Rispondi in modo coerente al contesto '{intent}'.
        """
    else:
        # prompt per conversazione più naturale
        prompt = f"""
        {base_prompt}
        Rispondi in modo coerente al contesto '{intent}', con tono amichevole e informativo.
        Se l'utente chiede istruzioni o un elenco, rispondi in modo chiaro e ordinato.
        Se chiede opinioni, rispondi con un tono empatico e naturale.
        """

    # Genera risposta
    response = model.generate_content(prompt)

    # Pulizia del testo
    cleaned_text = response.text.replace("**", "").replace("*", "").strip()

    return {
        "response": cleaned_text,
        "intent": intent  # utile per debug o UI
    }