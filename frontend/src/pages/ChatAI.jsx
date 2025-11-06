import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

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

function ChatAI() {
    const [user, setUser] = useState(null); // stato per i dati dell'utente
    const [messages, setMessages] = useState([]); // stato per i messaggi della chat
    const [input, setInput] = useState(""); // stato per l'input dell'utente
    const [isLoading, setIsLoading] = useState(false); // stato per indicare se la risposta AI è in caricamento

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

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col h-[80vh] lg:h-[75vh] sm:h-[80vh] md:h-[90vh] 
            w-[95%] sm:w-[90%] md:max-w-4xl lg:max-w-6xl mx-auto mt-2 sm:mt-8 md:mt-10
            bg-linear-to-br from-blue-400/30 via-blue-500/10 to-orange-400/20 
            backdrop-blur-2xl border border-white/30 rounded-3xl shadow-2xl overflow-hidden 
            px-3 sm:px-4 md:px-6">

            {/* Titolo animato AI */}
            <div className="text-center py-4 text-white text-xl sm:text-2xl font-semibold tracking-wide">
                {typedTitle}
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar text-white">
                <AnimatePresence>
                    {messages.map((m, i) => ( // mappa i messaggi
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -40 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}> { /* allinea i messaggi */}
                            {m.role === "user" ? ( // messaggio utente
                                <div className="bg-linear-to-r from-blue-400 to-orange-400 dark:from-slate-900 dark:to-slate-500 
                                  text-white px-4 sm:px-5 py-2 sm:py-3 rounded-2xl shadow-md max-w-[80%] sm:max-w-[70%] 
                                    rounded-br-none text-sm sm:text-base md:text-lg 
                                    hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]">
                                    {m.text} { /* testo del messaggio utente */ }
                                </div>
                            ) : (
                                <div
                                    className="text-sm sm:text-base md:text-lg leading-relaxed whitespace-pre-wrap"
                                    dangerouslySetInnerHTML={{ // usa HTML per formattare il testo
                                          // applica l'effetto macchina da scrivere solo all'ultimo messaggio AI
                                        __html: i === messages.length - 1 ? formatText(typedResponse) : formatText(m.text), 
                                    }}
                                />
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isLoading && ( // indicatore di caricamento
                    <motion.p
                        className="text-white italic text-sm sm:text-base"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}>
                        Fammi pensare...
                    </motion.p>
                )}
            </div>

            <div className="p-3 sm:p-4 flex sm:flex-row items-center sm:items-end gap-3 border-t border-white/20">
                <input
                    className="flex-1 bg-white/20 border border-white/30 rounded-full px-4 py-2 sm:py-3 text-white placeholder-white 
                    focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-blue-400 
                    transition resize-none overflow-y-auto leading-relaxed min-h-10 sm:min-h-12
                    max-h-40 text-sm sm:text-base"
                    value={input} // valore dell'input
                    onChange={(e) => setInput(e.target.value)} // aggiorna lo stato dell'input
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())} // invia il messaggio con INVIO
                    placeholder="Fammi una domanda..."
                />

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={sendMessage} // invia il messaggio al click
                    disabled={isLoading} // disabilita il pulsante se è in caricamento
                    className="font-semibold flex justify-center items-center gap-2 px-4 sm:px-5 py-2 sm:py-3
                    bg-linear-to-r from-blue-600 to-cyan-500 backdrop-blur-md border border-white/40 text-white 
                    rounded-full shadow-md transition-all duration-300 hover:scale-105
                    hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] cursor-pointer text-sm sm:text-base">
                    Invia
                </motion.button>
            </div>
        </motion.div>
    );
}

export default ChatAI;
