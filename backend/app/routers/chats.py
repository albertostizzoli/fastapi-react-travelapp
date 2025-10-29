from fastapi import APIRouter
from app.config import UserMessage, travel_model

router = APIRouter(prefix="/chats")

# Dizionario in memoria per salvare la cronologia delle chat per ogni utente
chat_history = {}

@router.post("/")
def generate_message(msg: UserMessage):
    """
    Chat AI per viaggi con memoria contestuale e gestione intelligente del contesto.
    Funzionalità principali:
    - Memorizza le ultime interazioni per coerenza.
    - Analizza l'intento dell'utente per rimanere nel dominio "viaggi".
    - Gestisce messaggi fuori tema e retry prima di rifiutare.
    - Riconosce se l'utente vuole terminare la conversazione.
    """
    user_id = getattr(msg, "user_id", "default_user")
    history = chat_history.get(user_id, [])

    # Costruzione del contesto della conversazione: ultimi 6 scambi
    conversation_context = "\n".join([
        f"Utente: {ex['user']}\nAssistente: {ex['ai']}"
        for ex in history[-6:]
    ])

    # Prendi l'ultimo messaggio dell'AI per fornire contesto
    last_ai = history[-1]["ai"] if history else ""


    # Controllo se l'utente vuole terminare
    termination_keywords = ["fine conversazione", "grazie", "stop", "è tutto", "basta così"]
    if any(kw in msg.message.lower() for kw in termination_keywords):
        farewell = "È stato un piacere aiutarti! Buon viaggio e alla prossima 😊"
        # Salva anche questo nel contesto
        history.append({"user": msg.message, "ai": farewell})
        chat_history[user_id] = history[-20:]
        return {"response": farewell, "intent": "terminazione"}


    # Analisi intento dell'utente
    intent_prompt = f"""
    L'assistente ha appena detto: "{last_ai}"
    L'utente risponde: "{msg.message}"

    Analizza la risposta dell'utente nel contesto di quanto detto dall'assistente.
    Se riguarda viaggi, turismo, destinazioni o esperienze di viaggio,
    restituisci una sola parola (es. "mete", "budget", "stagione", "consiglio").
    Se NON riguarda i viaggi, rispondi "fuori_tema".
    Rispondi solo con una parola.
    """
    intent = travel_model.generate_content(intent_prompt).text.strip().lower()

    # Gestione messaggi fuori tema con retry
    if intent == "fuori_tema":
        retry_prompt = f"""
        Ecco la conversazione recente:
        {conversation_context}

        L'utente ora dice: "{msg.message}"

        Questa frase è collegata alla conversazione precedente?
        Se sì, spiega brevemente come. Se no, rispondi "fuori_tema".
        """
        retry = travel_model.generate_content(retry_prompt).text.strip().lower()
        if "fuori_tema" in retry:
            return {
                "response": "Posso aiutarti solo con argomenti legati ai viaggi 😊. "
                            "Prova a chiedermi una meta, un consiglio o un periodo per un viaggio!",
                "intent": intent
            }

    # Prompt principale per la risposta AI
    prompt = f"""
    Sei un assistente AI esperto di viaggi e turismo.

    Ecco la conversazione precedente:
    {conversation_context}

    Nuovo messaggio:
    Utente: "{msg.message}"

    Analizza il contesto e rispondi in modo coerente con la conversazione.
    Mantieni coerenza con la destinazione e la stagione già discusse.
    Evita di ripetere ciò che è già stato detto.
    Fornisci risposte chiare, pratiche e amichevoli.
    Alla fine, se opportuno, poni una sola domanda di follow-up pertinente.
    """

    try:
        response = travel_model.generate_content(prompt)
        cleaned_text = (
            response.text
            .replace("**", "")
            .replace("*", "")
            .replace("###", "")
            .replace("\n\n", "\n")
            .strip()
        )

        # Aggiornamento cronologia con limite di 20 messaggi
        history.append({"user": msg.message, "ai": cleaned_text})
        chat_history[user_id] = history[-20:]

        return {"response": cleaned_text, "intent": intent}

    except Exception as e:
        return {"response": f"Errore nella generazione: {e}", "intent": intent}
