from fastapi import APIRouter
from app.config import UserMessage, travel_model

router = APIRouter(prefix="/chats")

@router.post("/")
def generate_message(msg: UserMessage):
    """
    Endpoint POST che riceve un messaggio dell'utente e restituisce
    una risposta generata da Google Gemini (specializzato sui viaggi).
    """

    # Analisi preliminare: riconoscimento dell'intento 
    intent_prompt = f"""
    Analizza la frase seguente: "{msg.message}"

    Se riguarda viaggi, turismo, destinazioni, vacanze o esperienze di viaggio,
    restituisci una sola parola che riassume l’intento (es. "mete", "budget", "stagione", "consiglio", ecc.).

    Se NON riguarda i viaggi o il turismo, rispondi con la parola "fuori_tema".
    Rispondi SOLO con una parola.
    """

    # esegue la generazione per identificare l’intento
    intent = travel_model.generate_content(intent_prompt).text.strip().lower()
    
    # Gestione dei messaggi fuori ambito
    if intent == "fuori_tema":
        # se il messaggio non è relativo ai viaggi, il modello non risponde
        return {
            "response": "Posso aiutarti solo con argomenti legati ai viaggi 😊. Prova a chiedermi una meta, un consiglio o un periodo per un viaggio!",
            "intent": intent
        }

    # Costruisco il prompt principale 
    base_prompt = f"""
    L'utente ha chiesto: "{msg.message}".
    Il contesto individuato è: {intent}.

    Rispondi solo se la richiesta riguarda viaggi, turismo, mete turistiche, vacanze o pianificazione di spostamenti.
    Non includere argomenti al di fuori di questo ambito.
    Se la domanda contiene più parti, rispondi separatamente a ciascuna in modo chiaro e pratico.
    Dai risposte brevi, dirette e concrete.
    """

    #  Prompt specifico per modalità "chat" o "informativa" 
    if msg.mode == "chat":
        # risposte più naturali, tono conversazionale
        prompt = f"""
        {base_prompt}

        Scrivi come un consulente di viaggi esperto ma amichevole.
        Offri informazioni precise e reali, anche culturali o stagionali se rilevanti.
        Alla fine, poni una sola domanda di follow-up naturale basata su ciò che l'utente ha chiesto.
        """
    else:
        # risposte più strutturate e ordinate
        prompt = f"""
        {base_prompt}

        Rispondi in modo informativo, ordinato e diretto a ciò che l'utente ti chiede.
        Se l’utente chiede mete o luoghi, fornisci un elenco chiaro (es. in JSON o con punti elenco).
        """

    # Generazione della risposta e gestione errori 
    try:
        response = travel_model.generate_content(prompt)

        # pulisco il testo da formattazioni indesiderate
        cleaned_text = (
            response.text
            .replace("**", "")
            .replace("*", "")
            .replace("###", "")
            .replace("\n\n", "\n")
            .strip()
        )

        # restituisce la risposta elaborata e l’intento rilevato
        return {"response": cleaned_text, "intent": intent}

    except Exception as e:
        # in caso di errore nella generazione (es. timeout, rete, chiave errata)
        return {"response": f"Si è verificato un errore durante la generazione: {e}", "intent": intent}


