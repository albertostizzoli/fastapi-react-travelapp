from fastapi import APIRouter, Depends, HTTPException # strumenti di FastAPI: routing, injection delle dipendenze, gestione errori
from sqlalchemy.orm import Session # sessione ORM per interagire con il database
from app.database import SessionLocal # connessione locale al DB (crea le sessioni)
from app.models.user_db import UserDB # modello ORM per la tabella degli utenti
from app.models.chat_db import ChatDB # modello ORM per la tabella delle chat
from app.schemas.chats import Chat, UserMessage, RecommendationRequest # classi Pydantic per le chat e i messaggi utente
from app.config import travel_model # importo il modello di AI per i viaggi e lo schema per i messaggi utente
from app.auth import get_current_user # importo la funzione per ottenere l'utente in base al token fornito

router = APIRouter(prefix="/chats")

# Dependency: fornisce una sessione di database a ogni richiesta API.
# La sessione viene creata all'inizio, resa disponibile tramite yield,
# e chiusa automaticamente alla fine della richiesta (pattern try/finally).
def get_db():
    db = SessionLocal()
    try:
        yield db  # restituisce la sessione da usare nelle query
    finally:
        db.close()  # chiude la sessione per evitare memory leak

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

# funzione per generare il titolo della chat con l'AI
def generate_ai_title(message: str) -> str:
    prompt = f"""
    Genera UN SOLO titolo per una chat di viaggio.

    REGOLE OBBLIGATORIE:
    - massimo 6 parole
    - una sola riga
    - nessuna lista
    - nessuna spiegazione
    - nessuna domanda
    - nessun testo extra
    - non usare virgolette

    Messaggio dell'utente:
    "{message}"

    Rispondi SOLO con il titolo.
    """
    return travel_model.generate_content(prompt).text.strip()

# funzione per pulire il titolo della chat 
def clean_title(title: str) -> str:
    # prende solo la prima riga
    title = title.split("\n")[0]

    # rimuove bullet o simboli strani
    title = title.replace("*", "").replace("-", "").strip()

    # forza max 6 parole
    words = title.split()
    return " ".join(words[:6])


# POST: funzione per generare il messaggio dall'AI
@router.post("/")
def generate_message(msg: UserMessage, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]

    #  Gestione creazione nuova chat 
    if msg.mode == "new_chat": # se la modalità è nuova chat

        title = "Nuova Chat"  # placeholder iniziale

        # creo una nuova chat nel DB
        new_chat = ChatDB(
            user_id=user_id, # ID dell'utente
            title=title, # titolo della chat
            messages=[] # nessun messaggio iniziale
        )
        db.add(new_chat) # aggiungo la nuova chat alla sessione
        db.commit() # salvo la chat nel DB
        db.refresh(new_chat) # aggiorno l'istanza con i dati dal DB

        return {
            "response": "Nuova chat creata!",
            "chat_id": new_chat.id
        }

    # recupero chat esistente
    if msg.chat_id:
        chat_db = db.query(ChatDB).filter( # filtro per ID chat e utente
            ChatDB.id == msg.chat_id, # ID della chat
            ChatDB.user_id == user_id # ID dell'utente
        ).first() # ottengo la chat
    else:
        # fallback: usa l'ultima chat dell'utente
        chat_db = db.query(ChatDB).filter( # filtro per utente
            ChatDB.user_id == user_id # ID dell'utente
        ).order_by(ChatDB.id.desc()).first() # prendo l'ultima chat

    # se non esiste ancora nessuna chat, se ne crea una
    if not chat_db:
        chat_db = ChatDB(user_id=user_id, messages=[]) # creo nuova chat
        db.add(chat_db) # aggiungo alla sessione
        db.commit() # salvo nel DB
        db.refresh(chat_db) # aggiorno l'istanza

    history = chat_db.messages or []

    MAX_STORED_HISTORY = 20 # numero massimo di messaggi persistiti nel DB (storico completo per la chat), serve per persistenza e UI
    CONTEXT_WINDOW = 3 # numero di scambi recenti passati all'AI come contesto (memoria corta), serve solo per mantenere coerenza nella risposta

    # Costruzione del contesto della conversazione: ultimi 3 scambi
    conversation_context = "\n".join([
        f"Utente: {ex['user']}\nAssistente: {ex['ai']}"
        for ex in history[-CONTEXT_WINDOW:]
    ])

    # prendo l'ultimo messaggio dell'AI per fornire contesto
    last_ai = history[-1]["ai"] if history else ""


    # controllo se l'utente vuole terminare
    termination_keywords = ["fine conversazione", "grazie", "stop", "è tutto", "basta così"]
    if any(kw in msg.message.lower() for kw in termination_keywords):
        farewell = "È stato un piacere aiutarti! Buon viaggio e alla prossima 😊"
        # aggiorno la cronologia
        history.append({"user": msg.message, "ai": farewell})

        # salva solo gli ultimi 20 messaggi
        chat_db.messages = history[-MAX_STORED_HISTORY:]

        # salvo la chat nel DB
        db.add(chat_db)
        db.commit()
        db.refresh(chat_db)

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
    if intent == "fuori_tema": # se l'intento è fuori tema
        retry_prompt = f""" 
        Ecco la conversazione recente:
        {conversation_context} 

        L'utente ora dice: "{msg.message}"

        Questa frase è collegata alla conversazione precedente?
        Se sì, spiega brevemente come. Se no, rispondi "fuori_tema".
        """
        retry = travel_model.generate_content(retry_prompt).text.strip().lower() # ottengo il risultato
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
        response = travel_model.generate_content(prompt) # ottengo la risposta dall'AI

        # pulisco il testo rimuovendo caratteri indesiderati
        cleaned_text = (response.text.replace("**", "").replace("*", "").replace("###", "").replace("\n\n", "\n").strip())

        # aggiornamento cronologia con limite a 20 messaggi
        history.append({"user": msg.message, "ai": cleaned_text})
        chat_db.messages = history[-MAX_STORED_HISTORY:]

        # salvo la chat nel DB
        if not chat_db.title or chat_db.title == "Nuova Chat": # chiamo le 2 funzioni per generare il titolo
           raw_title = generate_ai_title(msg.message)
           chat_db.title = clean_title(raw_title)


        db.add(chat_db)
        db.commit()
        db.refresh(chat_db)

        return {"response": cleaned_text, "intent": intent}

    except Exception as e:
        return {"response": f"Errore nella generazione: {e}", "intent": intent}
    

# funzione per ottenere le esperienze dell'utente
def get_user_experiences(user_id: int, db: Session):
    user = db.query(UserDB).filter(UserDB.id == user_id).first()
    return user.experiences if user and user.experiences else []


# POST: funzione per ottenere il messaggio dall'AI in base alle esperienze dell'utente
@router.post("/recommendations/{user_id}")
def get_travel_recommendations(user_id: int, data: RecommendationRequest, db: Session = Depends(get_db)):

    chat_id = data.chat_id # ID della chat
    title = "Nuova Chat"  # placeholder iniziale

    # recupera o creo una chat
    if chat_id:
        chat = db.query(ChatDB).filter(ChatDB.id == chat_id, ChatDB.user_id == user_id).first() # ottengo la chat
        if not chat:
            raise HTTPException(status_code=404, detail="Chat non trovata")
    else:
        chat = ChatDB( # creo una nuova chat
            user_id=user_id,
            title=title,
            messages=[]
            )
        db.add(chat) # aggiungo alla sessione
        db.commit() # salvo nel DB
        db.refresh(chat) # aggiorno l'istanza

    history = chat.messages or []
    MAX_STORED_HISTORY = 20      # quanto salvi nel DB

    # recupero le esperienze di viaggio dell'utente    
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

    # ottengo il testo generato dall'AI
    response = travel_model.generate_content(prompt).text.strip()

    # pulisco il testo per rimuovere caratteri indesiderati
    cleaned_text = (response.replace("**", "").replace("*", "").replace("###", "").replace("##", "").replace("\n\n", "\n").strip())

    # aggiorna cronologia in memoria e DB
    history.append({"user": "Richiesta raccomandazioni basata sulle esperienze", "ai": cleaned_text})
    chat.messages = history[-MAX_STORED_HISTORY:]

    #  Genera il titolo (solo se primo messaggio)
    if len(history) == 1:
       title_seed = f"Raccomandazioni viaggio: {experiences_text}"
       raw_title = generate_ai_title(title_seed)
       chat.title = clean_title(raw_title)

    db.add(chat)
    db.commit()
    db.refresh(chat)

    return {"recommendations": cleaned_text, "chat_id": chat.id }  # ritorna chat_id per continuare la conversazione


# DELETE: funzione per cancellare una chat
@router.delete("/{chat_id}")
def delete_chat(chat_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    # cerco la chat filtrando per user_id
    chat = db.query(ChatDB).filter(
        ChatDB.id == chat_id,
        ChatDB.user_id == user_id
    ).first()

    if not chat:
        raise HTTPException(status_code=404, detail="Chat non trovata")
    
    db.delete(chat)  # cancella la chat
    db.commit()      # conferma le modifiche nel database
    return {"messaggio": f"Chat {chat_id} eliminata con successo"}







