# FASTAPI-REACT-TRAVELAPP

### Presentazione

Questo progetto è un diario personale per chi ama viaggiare, in cui l'utente può salvare i propri viaggi con le relative tappe e esperienze.

---

### Uso

All'accesso al sito, se l'utente non ha già un profilo, può registrarsi inserendo i propri dati (nome, cognome, email e password). In aggiunta, può opzionalmente caricare una foto e indicare le proprie esperienze di viaggio preferite.  
Dopo il login, l'utente viene reindirizzato al proprio profilo personale.

#### Viaggi

Nella pagina **"I tuoi viaggi"**, l'utente trova:

- Un hero con le immagini dei vari viaggi.
- Filtri per selezionare i viaggi in base all'anno.
- La possibilità di aggiungere un nuovo viaggio.

I viaggi sono mostrati sotto forma di card in un carosello, con informazioni su anno, data di partenza e data di fine. Aprendo una card, l'utente può vedere i voti assegnati per: Paesaggio, Cibo, Relax, Prezzi e Attività, oltre alla media dei voti.  
In alto a destra della card è presente un menù per **Modificare** o **Cancellare** un viaggio.

#### Tappe

Ogni viaggio ha un pulsante che permette di visualizzare le tappe associate. La pagina delle tappe presenta:

- Un hero con immagini casuali delle tappe.
- Filtri per esperienze e città.
- La possibilità di aggiungere nuove tappe.

Le tappe sono mostrate come card in un carosello, con anteprima contenente foto, descrizione ed esperienze.  
Cliccando su **Leggi di più**, l'utente può vedere tutte le informazioni della tappa in un modale, inclusa la posizione sulla mappa. In alto a destra è presente un menù per **Modificare** o **Cancellare** una tappa.

#### Chat

Nella pagina del profilo, il pulsante **"Il tuo prossimo viaggio"** apre una chat con l'AI, che può consigliare nuovi viaggi.  
Cliccando su **Consigliami**, l'AI analizza le esperienze preferite dell'utente e propone almeno 4 viaggi con relative tappe.  
Le conversazioni si salvano, possono essere riviste, cancellate o terminate tramite specifiche parole chiave.

---

### Perché ho fatto questo progetto

Ho realizzato questo progetto per migliorare le mie competenze in **React** e **UX/UI** lato frontend, e per mettere in pratica le mie conoscenze di **Python** e **Intelligenza Artificiale** lato backend.

---

### Tecnologie utilizzate

**Frontend:**

- React con React Router Dom per le rotte
- Tailwind CSS
- Framer Motion per le animazioni
- React Icons per le icone
- React Select per i filtri
- Leaflet per la gestione delle mappe

**Backend:**

- FastAPI con Uvicorn per l'avvio del server
- Pydantic per la validazione dei dati
- Dotenv per l'uso di variabili d'ambiente e API esterne
- PyMySQL per la connessione al database MySQL

**Database:**

- MySQL
- SQLAlchemy come ORM

**API esterne:**

- JWT per l'autenticazione
- Cloudinary per l'upload delle foto
- Photon per suggerimenti dei luoghi
- Nominatim per il calcolo delle coordinate
- Google Generative AI (Gemini 2.0) per l'AI

---

### Come usarlo

1. Clona il progetto da GitHub.
2. Crea e attiva un **ambiente virtuale** (opzionale ma consigliato):

```bash
python -m venv venv
# Su Windows
venv\Scripts\activate
# Su macOS/Linux
source venv/bin/activate
```

3. Installa le dipendenze:

```bash
npm install ( Frontend )

pip install -r requirements.txt ( Backend )
```

4. Assicurati di avere Node, Python e MySQL installati sul tuo computer.

5. Avvia il progetto:

```bash
uvicorn main:app --reload ( Backend )

npm run dev ( Frontend )
```