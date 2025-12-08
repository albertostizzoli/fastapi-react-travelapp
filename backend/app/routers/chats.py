from fastapi import APIRouter, Depends, HTTPException # strumenti di FastAPI: routing, injection delle dipendenze, gestione errori
from sqlalchemy.orm import Session # sessione ORM per interagire con il database
from app.database import SessionLocal # connessione locale al DB (crea le sessioni)
from app.models.user_db import UserDB # modello ORM per la tabella degli utenti
from app.models.chat_db import ChatDB # modello ORM per la tabella delle chat
from app.schemas.chats import Chat, ChatCreate, ChatMessageAdd # schemi Pydantic per validare input/output
from app.config import UserMessage, travel_model # importo il modello di AI per i viaggi e lo schema per i messaggi utente
from app.auth import get_current_user # importo la funzione per ottenere l'utente in base al token fornito

router = APIRouter(prefix="/chats")

# Dizionario in memoria per salvare la cronologia delle chat per ogni utente
chat_history = {}

# funzione per generare il messaggio dall'AI
@router.post("/")
def generate_message(msg: UserMessage):
    user_id = getattr(msg, "user_id", "default_user")
    history = chat_history.get(user_id, [])

    # Costruzione del contesto della conversazione: ultimi 6 scambi
    conversation_context = "\n".join([
        f"Utente: {ex['user']}\nAssistente: {ex['ai']}"
        for ex in history[-6:]
    ])

    # Prendi l'ultimo messaggio dell'AI per fornire contesto
    last_ai = history[-1]["ai"] if history else ""

    # Riduzione History a 5 messaggi
    MAX_HISTORY = 5


    # Controllo se l'utente vuole terminare
    termination_keywords = ["fine conversazione", "grazie", "stop", "è tutto", "basta così"]
    if any(kw in msg.message.lower() for kw in termination_keywords):
        farewell = "È stato un piacere aiutarti! Buon viaggio e alla prossima 😊"
        # Salva anche questo nel contesto
        history.append({"user": msg.message, "ai": farewell})
        chat_history[user_id] = history[MAX_HISTORY:]
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

        # Aggiornamento cronologia con limite a 5 messaggi
        history.append({"user": msg.message, "ai": cleaned_text})
        chat_history[user_id] = history[-5:]

        return {"response": cleaned_text, "intent": intent}

    except Exception as e:
        return {"response": f"Errore nella generazione: {e}", "intent": intent}
    

# Dependency: fornisce una sessione di database a ogni richiesta API.
# La sessione viene creata all'inizio, resa disponibile tramite yield,
# e chiusa automaticamente alla fine della richiesta (pattern try/finally).
def get_db():
    db = SessionLocal()
    try:
        yield db  # restituisce la sessione da usare nelle query
    finally:
        db.close()  # chiude la sessione per evitare memory leak


# funzione per ottenere le esperienze dell'utente
def get_user_experiences(user_id: int, db: Session):
    user = db.query(UserDB).filter(UserDB.id == user_id).first()
    return user.experiences if user and user.experiences else []


# funzione per ottenere il messaggio dall'AI in base alle esperienze dell'utente
@router.get("/recommendations/{user_id}")
def get_travel_recommendations(user_id: int, db: Session = Depends(get_db)):
    experiences = get_user_experiences(user_id, db)
    experiences_text = ", ".join(experiences) if experiences else "nessuna esperienza specificata"

    prompt = f"""
    Sei un assistente AI esperto di viaggi. 
    L'utente ha le seguenti esperienze di viaggio: {experiences_text}.
    Il tuo compito è consigliare 3 destinazioni di viaggio, 
    ciascuna con almeno 4 tappe o attività specifiche, che si allineano alle esperienze dell'utente.

    Requisiti di stile:
    - Inizia sempre con un saluto cordiale e personalizzato.
    - Rispondi in modo chiaro, pratico e amichevole.
    - Le destinazioni devono essere originali e non ripetere luoghi o tappe già suggerite in precedenti risposte.
    - Se hai già fornito suggerimenti simili in passato, proponi alternative nuove o meno note, anche di nicchia.
    - Alterna destinazioni di città, natura, cultura, avventura, gastronomia e relax per garantire varietà geografica e tematica.

    Obiettivo:
    Fornire ispirazione sempre nuova basata sulle preferenze dell'utente, evitando qualsiasi ripetizione di idee già proposte.
    """

    # Ottieni il testo generato dal modello
    response = travel_model.generate_content(prompt).text.strip()

    # Pulisci il testo per rimuovere caratteri indesiderati
    cleaned_text = (
        response
        .replace("**", "")
        .replace("*", "")
        .replace("###", "")
        .replace("##", "")
        .replace("\n\n", "\n")
        .strip()
    )
    # Recupera la history chat
    history = chat_history.get(user_id, [])

    # Aggiungi finto messaggio: user chiede raccomandazioni e l'AI risponde
    history.append({
       "user": "Richiesta raccomandazioni basata sulle mie esperienze",
       "ai": f"[RACCOMANDAZIONI]\n{cleaned_text}"
   })

    # Limite della cronologia
    chat_history[user_id] = history[-5:]

    return {"recommendations": cleaned_text}


# GET: Funzione per ottenere tutte le chat
@router.get("/", response_model=list[Chat])
def get_chats(db: Session = Depends(get_db)):
    return db.query(ChatDB).all()  # mi restituisce tutte le chat


#  GET: per ottenere una chat singola tramite ID
@router.get("/{chat_id}", response_model=Chat)
def get_chat(chat_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)): # ID della chat
    user_id = current_user["id"]
    chat = db.query(ChatDB).filter(ChatDB.id == chat_id, ChatDB.user_id == user_id).first() # ottengo la chat
    if not chat:
        raise HTTPException(status_code=404, detail="Chat non trovata")
    return chat


# POST: Funzione per creare una nuova chat
@router.post("/", response_model=Chat)
def add_chat(chat: ChatCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    db_chat = ChatDB(
        messages=chat.messages,
        user_id=user_id
    )

    db.add(db_chat)
    db.commit()
    db.refresh(db_chat)

    return db_chat


@router.patch("/{chat_id}/messages", response_model=Chat)
def add_messages_to_chat( chat_id: int, new_data: ChatMessageAdd, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    
    # Verifica se la chat esiste
    chat = db.query(ChatDB).filter(ChatDB.id == chat_id).first()

    if not chat:
        raise HTTPException(status_code=404, detail="Chat non trovata")

    # Verifica che la chat appartenga all'utente corrente
    if chat.user_id != current_user["id"]:
        raise HTTPException(status_code=403, detail="Non sei autorizzato a modificare questa chat")

    # Aggiungo i nuovi messaggi alla lista esistente
    chat.messages.extend(new_data.messages)

    # Salvo le modifiche
    db.commit()
    db.refresh(chat)

    return chat




