import { motion, AnimatePresence } from "framer-motion"; // per le animazioni
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // importo FontAwesomeIcon per le icone
import { faCompass, faMessage } from "@fortawesome/free-solid-svg-icons"; // importo le icone necessarie
import ChatAIController from "../hooks/ChatAIController"; // importa il controller della chat AI

function ChatAI() {

    const {
        user,               // utente
        messages,           // messaggi della chat
        input,              // input dell'utente
        isLoading,          // stato di caricamento
        typedTitle,         // titolo con effetto macchina da scrivere
        typedResponse,      // risposta AI con effetto macchina da scrivere
        sendMessage,        // funzione per inviare un messaggio
        formatText,         // funzione per formattare il testo
        setInput,           // funzione per aggiornare l'input
        setMessages,         // stato dei messaggi
        isRecommending,      // attesa del messaggio
        setIsRecommending    // stato di attesa
    } = ChatAIController(); // uso il controller della chat AI

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
                                    {m.text} { /* testo del messaggio utente */}
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
                    <FontAwesomeIcon icon={faMessage} />
                    Invia
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={async () => {
                        if (!user) {
                            alert("Utente non caricato, riprova tra un momento!");
                            return;
                        }

                        setIsRecommending(true); // mostra messaggio di attesa
                        setMessages(prev => [...prev, { role: "ai", text: "Sto analizzando le tue esperienze..." }]);

                        try {
                            const res = await fetch(`http://127.0.0.1:8000/chats/recommendations/${user.id}`);
                            const data = await res.json();

                            // Rimuove il messaggio di attesa e aggiunge la risposta vera
                            setMessages(prev => [
                                ...prev.filter(m => m.text !== " Sto analizzando i tuoi interessi..."),
                                { role: "ai", text: data.recommendations },
                            ]);
                        } catch (err) {
                            console.error(err);
                            setMessages(prev => [
                                ...prev,
                                { role: "ai", text: "❌ Errore: impossibile ottenere i consigli di viaggio." },
                            ]);
                        } finally {
                            setIsRecommending(false);
                        }
                    }}
                    disabled={isRecommending}
                    className={`font-semibold flex justify-center items-center gap-2 px-4 sm:px-5 py-2 sm:py-3
                    ${isRecommending
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-linear-to-r from-green-600 to-teal-500 hover:scale-105"}
                            backdrop-blur-md border border-white/40 text-white 
                            rounded-full shadow-md transition-all duration-300 cursor-pointer
                            hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] text-sm sm:text-base`}>
                    <FontAwesomeIcon icon={faCompass} />
                    {isRecommending ? "Sto pensando..." : "Ispirami"}
                </motion.button>
            </div>
        </motion.div>
    );
}

export default ChatAI;
