import { useState, useEffect } from "react";

// Funzione per effetto macchina da scrivere
function useTypewriterEffect(text, speed = 25) {
    // stato per il testo visualizzato progressivamente
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        if (!text) return; // se il testo è vuoto, non fare nulla
        setDisplayedText(""); // reset del testo visualizzato
        let i = 0;

        // setInterval per aggiungere progressivamente i caratteri
        const interval = setInterval(() => {
            setDisplayedText(text.slice(0, i)); // mostra da 0 a i caratteri
            i++;
            if (i > text.length) clearInterval(interval); // ferma quando finisce il testo
        }, speed);

        // cleanup: cancella l'intervallo se il componente viene smontato o il testo cambia
        return () => clearInterval(interval);
    }, [text, speed]); // dipendenze: si riavvia ogni volta che cambia `text` o `speed`

    return displayedText; // ritorna il testo progressivamente mostrato
}


function ChatAI() {

    const [messages, setMessages] = useState([]); // stato per i messaggi tra utente e AI
    const [input, setInput] = useState(""); // stato per l'input dell'utente
    const [isLoading, setIsLoading] = useState(false); // stato caricamento risposta AI

    // prende l'ultimo messaggio dell'AI per applicare l'effetto macchina da scrivere
    const lastAIResponse =
        messages.length && messages[messages.length - 1].role === "ai"
            ? messages[messages.length - 1].text
            : "";
    const typedResponse = useTypewriterEffect(lastAIResponse, 15);

    // funzione invio messaggio
    const sendMessage = async () => {
        if (!input.trim()) return; // evita invii di messaggi vuoti
        setIsLoading(true); // indica che la risposta AI è in arrivo

        // aggiunge il messaggio dell'utente alla lista
        const newUserMsg = { role: "user", text: input };
        setMessages((prev) => [...prev, newUserMsg]);
        setInput(""); // reset dell'input

        try {
            // chiamo il backend
            const res = await fetch(`http://127.0.0.1:8000/chats`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input, mode: "chat" }),
            });

            const data = await res.json();

            // pulizia del testo: rimuove markdown e spazi multipli
            const clean = data.response
                .replace(/\*\*/g, "")
                .replace(/\*/g, "")
                .replace(/\n{2,}/g, "\n")
                .trim();

            // aggiunge la risposta dell'AI alla lista dei messaggi
            const aiMessage = { role: "ai", text: clean };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (err) {
            // in caso di errore, aggiunge un messaggio di errore
            setMessages((prev) => [
                ...prev,
                { role: "ai", text: "❌ Errore: impossibile ottenere una risposta dal server." },
            ]);
        } finally {
            setIsLoading(false); // reset stato caricamento
        }
    };


    // Funzione per formattare testo AI in HTML
    const formatText = (text) => {
        const lines = text.split("\n"); // divide il testo per righe
        let html = "";
        let listOpen = false; // flag per tracciare se siamo dentro una lista

        lines.forEach((line) => {
            // se la riga inizia con "-" o "*" viene considerata un item di lista
            if (line.startsWith("- ") || line.startsWith("* ")) {
                if (!listOpen) {
                    html += "<ul class='list-disc list-inside mt-2'>"; // apre lista
                    listOpen = true;
                }
                html += `<li>${line.substring(2)}</li>`; // aggiunge elemento
            } else {
                if (listOpen) {
                    html += "</ul>"; // chiude la lista se era aperta
                    listOpen = false;
                }
                html += `<p class='mt-2 leading-relaxed'>${line}</p>`; // aggiunge paragrafo
            }
        });

        if (listOpen) html += "</ul>"; // chiude la lista se ancora aperta
        return html; // ritorna testo formattato come HTML
    };


    return (
        <div className="flex flex-col h-[80vh] max-w-6xl mx-auto mt-10 
            bg-gradient-to-br from-blue-950/30 via-blue-900/10 to-orange-900/20 backdrop-blur-2xl border border-white/30
            rounded-3xl shadow-2xl overflow-hidden px-6 sm:px-4">

            {/*  Area messaggi */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar text-white">
                {messages.length === 0 && !isLoading && (
                    <p className="text-white italic">
                        Ciao! Sono il tuo assistente AI di viaggi <br />
                        Chiedimi una meta, un periodo o un consiglio!
                    </p>
                )}

                {messages.map((m, i) => (
                    <div
                        key={i}
                        className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        {m.role === "user" ? (
                            // Messaggio utente: fumetto
                            <div className="bg-gradient-to-r from-blue-500 to-orange-500 text-white px-5 py-3 
                            rounded-2xl shadow-md max-w-[70%] rounded-br-none hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]">
                                {m.text}
                            </div>
                        ) : (
                            //  Risposta AI: paragrafo con effetto macchina da scrivere
                            <div
                                className="text-lg leading-relaxed whitespace-pre-wrap"
                                dangerouslySetInnerHTML={{
                                    __html:
                                        i === messages.length - 1 ? formatText(typedResponse) : formatText(m.text),
                                }}
                            />
                        )}
                    </div>
                ))}

                {isLoading && (
                    <p className="text-white animate-pulse">Sto pensando alla risposta...</p>
                )}
            </div>

            {/*  Input area */}
            <div className="p-4 flex items-end gap-3 border-t border-white/20">
                <input
                    className="flex-1 bg-white/20 border border-white/30 rounded-2xl px-4 py-3 text-white
                    placeholder-white focus:outline-none focus:ring-2 focus:ring-orange-400  transition
                    resize-none overflow-y-auto leading-relaxed min-h-[3rem] max-h-[10rem]"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
                    placeholder="Fammi una domanda..."
                />

                <button
                    onClick={sendMessage}
                    disabled={isLoading}
                    className={`font-semibold flex justify-center items-center gap-2 px-5 py-3
                    bg-gradient-to-r from-blue-600/70 to-cyan-500/60 backdrop-blur-md border border-white/40
                  text-white/90 rounded-full shadow-md transition-all duration-300 hover:scale-105
                    hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] cursor-pointer `}>
                    Invia
                </button>
            </div>
        </div>
    );
}

export default ChatAI;
