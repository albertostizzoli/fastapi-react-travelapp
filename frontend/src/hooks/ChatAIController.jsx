import { useState, useEffect } from "react";
import axios from "axios";

function ChatAIController() {
    const [user, setUser] = useState(null); // stato per i dati dell'utente
    const [messages, setMessages] = useState([]); // stato per i messaggi della chat
    const [input, setInput] = useState(""); // stato per l'input dell'utente
    const [isLoading, setIsLoading] = useState(false); // stato per indicare se la risposta AI è in caricamento
    const [isRecommending, setIsRecommending] = useState(false); // stato per i consigli dell'AI

    // titolo dinamico dell'AI 
    const aiTitle = user ? `Ciao ${user.name}, sono il tuo assistente AI. Chiedimi pure!` : "";
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

    // risposta AI con effetto macchina da scrivere
    const lastAIResponse =
        messages.length && messages[messages.length - 1].role === "ai" //   controlla se l'ultimo messaggio è dell'AI
            ? messages[messages.length - 1].text // ottieni il testo dell'ultimo messaggio AI
            : "";
    const typedResponse = useTypewriterEffect(lastAIResponse, 15); // effetto macchina da scrivere per la risposta AI

    // funzione per inviare un messaggio
    const sendMessage = async () => {
        if (!input.trim()) return; // se l'input è vuoto, esci
        setIsLoading(true); // imposta lo stato di caricamento
        const newUserMsg = { role: "user", text: input }; // crea il messaggio utente
        setMessages((prev) => [...prev, newUserMsg]); // aggiungi il messaggio utente alla lista
        setInput(""); // resetta l'input

        try {
            const res = await fetch(`http://127.0.0.1:8000/chats`, { // richiesta al backend per la risposta AI
                method: "POST", //  metodo POST
                headers: { "Content-Type": "application/json" }, // intestazioni
                body: JSON.stringify({ message: input, mode: "chat" }), // corpo della richiesta
            });

            const data = await res.json(); // analizza la risposta JSON
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

    return {
        user,                // dati dell'utente
        messages,            // messaggi della chat
        input,               // input dell'utente
        isLoading,           // stato di caricamento
        typedTitle,          // titolo con effetto macchina da scrivere
        typedResponse,       // risposta AI con effetto macchina da scrivere
        isRecommending,      // attesa per il messaggio
        setIsRecommending,   // stato dell'attesa
        sendMessage,         // funzione per inviare un messaggio
        formatText,          // funzione per formattare il testo
        setInput,            // funzione per aggiornare l'input
        useTypewriterEffect,  // hook effetto macchina da scrivere
        setMessages           // messaggi della chat
    }
}

export default ChatAIController;