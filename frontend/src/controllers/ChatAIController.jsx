import { useState, useEffect, useRef } from "react";
import axios from "axios";

function ChatAIController() {
    const [user, setUser] = useState(null); // stato per i dati dell'utente
    const [messages, setMessages] = useState([]); // stato per i messaggi della chat
    const [input, setInput] = useState(""); // stato per l'input dell'utente
    const [isLoading, setIsLoading] = useState(false); // stato per indicare se la risposta AI è in caricamento
    const [isRecommending, setIsRecommending] = useState(false); // stato per disabilitare il pulsante Ispirami
    const [hasStartedChat, setHasStartedChat] = useState(false); // stato per iniziare una chat
    const [currentChatId, setCurrentChatId] = useState(null); // stato per l'ID della chat corrente
    const [chats, setChats] = useState([]); // stato per caricare le chat

    // titolo dinamico dell'AI 
    const aiTitle = user ? `Ciao ${user.name}, chiedimi pure!` : "";
    const typedTitle = useTypewriterEffect(aiTitle, 40); // effetto macchina da scrivere per il titolo

    // recupera i dati dell'utente al montaggio del componente
    useEffect(() => {
        const userId = localStorage.getItem("userId"); // ottieni l'ID utente dal localStorage
        if (!userId) return; // se non c'è ID, esci
        axios
            .get(`http://127.0.0.1:8000/users/${userId}`) // richiesta per ottenere i dati dell'utente
            .then((res) => setUser(res.data))  // imposta i dati dell'utente nello stato
            .catch((err) => console.error(err)); // gestisci errori
    }, []); // esegui solo al montaggio


    // uso lo useEffect per ottenere i dati delle chat
    useEffect(() => {
        const token = localStorage.getItem("token"); // recupera il token JWT
        if (!token) return; // se non c'è token, non faccio nulla

        axios.get("http://127.0.0.1:8000/chats", {
            headers: {
                Authorization: `Bearer ${token}`, //  token nell'header
            },
        })
            .then((res) => setChats(res.data)) // aggiorna lo stato con i dati ricevuti
            .catch((err) => console.error(err)); // gestisce errori
    }, []);


    // resetto la chat all'inizio
    useEffect(() => {
        setCurrentChatId(null); // reset ID chat
        setMessages([]); // reset messaggi
    }, []);


    // risposta AI con effetto macchina da scrivere
    const lastAIResponse =
        messages.length && messages[messages.length - 1].role === "ai" //   controlla se l'ultimo messaggio è dell'AI
            ? messages[messages.length - 1].text // ottieni il testo dell'ultimo messaggio AI
            : "";
    // se è una chat nuova allora l'effetto viene applicato se è una chat già esistente allora no        
    const typedResponse =   useTypewriterEffect(lastAIResponse, 15);


    // funzione per inviare un messaggio
    const sendMessage = async () => {
        if (!input.trim()) return; // se l'input è vuoto, esci

        //  se non c'è una chat, viene creata
        if (!currentChatId) {
            await startNewChat();
        }
        setIsLoading(true); // imposta lo stato di caricamento
        const newUserMsg = { role: "user", text: input }; // crea il messaggio utente
        setMessages((prev) => [...prev, newUserMsg]); // aggiungi il messaggio utente alla lista
        setInput(""); // resetta l'input

        try {
            const token = localStorage.getItem("token"); // ottengo il token di autenticazione
            const res = await fetch(`http://127.0.0.1:8000/chats`, { // richiesta al backend per la risposta AI
                method: "POST", //  metodo POST
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ message: input, mode: "chat", chat_id: currentChatId }), // corpo della richiesta
            });

            const data = await res.json(); // analizza la risposta JSON

            // Se il backend manda un nuovo chat_id (fallback)
            if (data.chat_id && !currentChatId) { // se non c'è ancora un chat_id
                setCurrentChatId(data.chat_id); // impostalo dallo stato
            }
            const clean = data.response // pulisci il testo della risposta
                .replace(/\*\*/g, "")
                .replace(/\*/g, "")
                .replace(/\n{2,}/g, "\n")
                .trim();

            const aiMessage = { role: "ai", text: clean }; // crea il messaggio AI
            setMessages((prev) => [...prev, aiMessage]); // aggiungi il messaggio AI alla lista
        } catch (err) {
            setMessages((prev) => [ // aggiungi un messaggio di errore in caso di fallimento
                ...prev, // mantieni i messaggi precedenti
                { role: "ai", text: "❌ Errore: impossibile ottenere una risposta dal server." },
            ]);
        } finally {
            setIsLoading(false); // resetta lo stato di caricamento
        }
    };

    // funzione per caricare le chat
    const loadChat = async (chatId) => {
        const token = localStorage.getItem("token");

        const res = await axios.get(
            `http://127.0.0.1:8000/chats/${chatId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const history = res.data.messages || [];

        const normalizedMessages = history.flatMap((pair) => [
            { role: "user", text: pair.user },
            { role: "ai", text: pair.ai },
        ]);

        setCurrentChatId(chatId);
        setMessages(normalizedMessages);
        setHasStartedChat(true);
    };



    // funzione per iniziare una nuova chat
    const startNewChat = async () => {
        const token = localStorage.getItem("token"); // ottengo il token di autenticazione

        const res = await fetch(`http://127.0.0.1:8000/chats`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ mode: "new_chat", message: "" }),
        });

        const data = await res.json();

        setCurrentChatId(data.chat_id);  //  ora la nuova chat esiste!
        setMessages([]);                 // reset messaggi visivi
    };



    // funzione per formattare il testo con paragrafi e liste
    const formatText = (text) => {
        const lines = text.split("\n"); // suddividi il testo in righe
        let html = ""; // stringa per il contenuto HTML formattato
        let listOpen = false; // flag per tracciare se una lista è aperta

        lines.forEach((line) => { // itera su ogni riga
            if (line.startsWith("- ") || line.startsWith("* ")) { // controlla se la riga è un elemento di lista
                if (!listOpen) { // se la lista non è aperta, aprila
                    html += "<ul class='list-disc list-inside mt-2'>"; // inizio lista
                    listOpen = true; // aggiorna il flag
                }
                html += `<li>${line.substring(2)}</li>`; // aggiungi l'elemento di lista
            } else {
                if (listOpen) { // se la lista è aperta, chiudila
                    html += "</ul>"; // fine lista
                    listOpen = false; // aggiorna il flag
                }
                html += `<p class='mt-2 leading-relaxed'>${line}</p>`; // aggiungi il paragrafo
            }
        });

        if (listOpen) html += "</ul>"; // chiudi la lista se è ancora aperta
        return html; // ritorna il contenuto HTML formattato
    };

    // Hook effetto macchina da scrivere (riutilizzato anche per il titolo)
    function useTypewriterEffect(text, speed = 25) {
        const [displayedText, setDisplayedText] = useState(""); // stato per il testo visualizzato

        // effetto macchina da scrivere
        useEffect(() => {
            if (!text) return; // se il testo è vuoto, non fare nulla
            setDisplayedText(""); // reset del testo visualizzato
            let i = 0; // indice per tracciare la posizione corrente nel testo
            const interval = setInterval(() => { // intervallo per aggiungere caratteri
                setDisplayedText(text.slice(0, i)); // aggiorna il testo visualizzato
                i++; // incrementa l'indice
                if (i > text.length) clearInterval(interval); // se il testo è completo, ferma l'intervallo
            }, speed); // velocità di digitazione
            return () => clearInterval(interval); // pulizia dell'intervallo
        }, [text, speed]); //  dipendenze dell'effetto

        return displayedText; // ritorna il testo visualizzato
    }

    // Funzione asincrona che recupera le raccomandazioni personalizzate per l'utente
    const getRecommendations = async () => {

        // serve per disabilitare il bottone e mostrare un messaggio di attesa
        setIsRecommending(true);
        const waitingMsg = "Sto analizzando le tue esperienze preferite..."; // messaggio di attesa

        // aggiunge il messaggio di attesa ai messaggi della chat l'utente vedrà che l'AI sta elaborando
        setMessages(prev => [...prev, { role: "ai", text: waitingMsg }]);

        try {
            const token = localStorage.getItem("token"); // ottengo il token di autenticazione
            // richiesta al backend per ottenere le raccomandazioni di viaggio
            const res = await fetch(`http://127.0.0.1:8000/chats/recommendations/${user.id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ chat_id: currentChatId })
            });

            // converte la risposta del server in formato JSON
            const data = await res.json();
            setCurrentChatId(data.chat_id); // aggiorna chat_id se viene creato nuovo

            // aggiorna la chat:
            setMessages(prev => [
                ...prev.filter(m => m.text !== waitingMsg), // rimuove il messaggio di attesa
                { role: "ai", text: data.recommendations },  // aggiunge la risposta AI ricevuta dal backend
            ]);

        } catch (err) {
            console.error(err); // stampa l'errore in console per debug

            //  mostra un messaggio di errore nella chat, al posto del messaggio di attesa
            setMessages(prev => [
                ...prev.filter(m => m.text !== waitingMsg), // rimuove il messaggio di attesa
                { role: "ai", text: "❌ Errore: impossibile ottenere i consigli di viaggio." },
            ]);

        } finally {
            // disattiva lo stato di caricamento per riattivare il bottone
            setIsRecommending(false);
        }
    };

    // fa scomparire il titolo quanso si scrive sull'input
    const handleSend = () => {
        if (!hasStartedChat) setHasStartedChat(true);
        sendMessage(); // chiamo la funzione sendMessage
    };

    // fa scomparire il titolo quando si clicca sul pulsante Ispirami
    const handleRecommend = () => {
        if (!hasStartedChat) setHasStartedChat(true);
        getRecommendations(); // chiamo la funzione getRecommendations
    };

    const messagesEndRef = useRef(null);

    // funzione per lo scroll automatico
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    return {
        user,                // dati dell'utente
        messages,            // messaggi della chat
        input,               // input dell'utente
        isLoading,           // stato di caricamento
        typedTitle,          // titolo con effetto macchina da scrivere
        typedResponse,       // risposta AI con effetto macchina da scrivere
        isRecommending,      // pulsante Ispirami disabilitato
        setIsRecommending,   // stato per disabilitare il pulsante Ispirami
        sendMessage,         // funzione per inviare un messaggio
        getRecommendations,  // funzione per ottenere consigli grazie alle esperienze
        formatText,          // funzione per formattare il testo
        setInput,            // funzione per aggiornare l'input
        useTypewriterEffect, // hook effetto macchina da scrivere
        setMessages,          // messaggi della chat
        handleSend,           // indica che è iniziata una chat quando scrive sull'input
        handleRecommend,      // indica che è iniziata una chat quando si clicca sul pulsante Ispirami
        hasStartedChat,       // per indicare che è iniziata una chat
        scrollToBottom,       // funzione per lo scroll automatico
        messagesEndRef,       // riferimento per lo scroll automatico
        startNewChat,         // funzione per iniziare una nuova chat
        chats,                // indica le chat caricate
        setChats,             // stato per caricare le chat
        loadChat              // funzione per caricare le chat
    }
}

export default ChatAIController;