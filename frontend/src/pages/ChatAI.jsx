import { motion, AnimatePresence } from "framer-motion"; // per le animazioni
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // importo FontAwesomeIcon per le icone
import { faCompass, faMessage } from "@fortawesome/free-solid-svg-icons"; // importo le icone necessarie
import ChatAIController from "../controllers/ChatAIController"; // importo il controller della chat AI

function ChatAI() {

    const {
        messages,           // messaggi della chat
        input,              // input dell'utente
        isLoading,          // stato di caricamento
        typedTitle,         // titolo con effetto macchina da scrivere
        typedResponse,      // risposta AI con effetto macchina da scrivere
        handleSend,         // funzione per inviare un messaggio
        handleRecommend,    // funzione oper il pulsante Ispirami (fa scomparire il titolo)
        formatText,         // funzione per formattare il testo
        setInput,           // funzione per aggiornare l'input
        isRecommending,     // pulsante Ispirami disabilitato
        hasStartedChat,     // per indicare che è iniziata una chat
        messagesEndRef       // per fare lo scroll automatico
    } = ChatAIController();  // uso il controller della chat AI


    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col h-[80vh] lg:h-[75vh] sm:h-[80vh] md:h-[90vh]
            w-[95%] sm:w-[90%] md:max-w-4xl lg:max-w-6xl mx-auto 
            mt-4 sm:mt-10 md:mt-12 bg-white/10 dark:bg-white/5 backdrop-blur-3xl
            border border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(255,255,255,0.1)]
            rounded-3xl ring-1 ring-white/10 overflow-hidden">

            {/* HEADER: Titolo AI */}
            <div className="py-5 text-center">
                {!hasStartedChat && (
                    <h1 className="text-white font-semibold tracking-wide text-xl sm:text-2xl md:text-3xl 
                        drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                        {typedTitle}
                    </h1>
                )}
            </div>

            {/* AREA MESSAGGI */}
            <div className=" flex-1 overflow-y-auto p-5 sm:p-6 md:p-8 space-y-5 text-white scrollbar">
                <AnimatePresence>
                    {messages.map((m, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -40 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                            {m.role === "user" ? (
                                <div className="bg-linear-to-br from-blue-500 to-orange-500 
                                dark:from-slate-900 dark:to-slate-500 text-white 
                                px-4 sm:px-5 py-3 rounded-2xl shadow-md max-w-[80%] sm:max-w-[70%]
                                rounded-br-none text-sm sm:text-base md:text-lg 
                                hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]
                                transition">
                                    {m.text}
                                </div>
                            ) : (
                                <div className="text-sm sm:text-base md:text-lg leading-relaxed 
                                    whitespace-pre-wrap bg-white/5 dark:bg-black/10 
                                    px-4 py-3 rounded-2xl border border-white text-justify
                                    shadow-inner backdrop-blur-xl max-w-[80%] sm:max-w-[70%]
                                    rounded-bl-none"
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            i === messages.length - 1
                                                ? formatText(typedResponse)
                                                : formatText(m.text),
                                    }}
                                />
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isLoading && (
                    <motion.p
                        className="text-white text-base opacity-70"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}>
                        Fammi pensare...
                    </motion.p>
                )}
                <div ref={messagesEndRef}></div>
            </div>

            {/* FOOTER: Input e pulsanti */}
            <div className=" p-3 sm:p-4 flex sm:flex-row items-center gap-3 backdrop-blur-xl">
                <input className="flex-1 border border-white rounded-full px-4 py-2 sm:py-3 
                    text-white placeholder-white focus:outline-none focus:ring-2 
                    focus:ring-orange-400 dark:focus:ring-blue-400 transition 
                    resize-none overflow-y-auto leading-relaxed min-h-10 sm:min-h-12 
                    max-h-40 text-sm sm:text-base"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) =>
                        e.key === "Enter" &&
                        !e.shiftKey &&
                        (e.preventDefault(), handleSend())
                    }
                    placeholder="Fammi una domanda..."
                />

                {/* Pulsante INVIA */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSend}
                    disabled={isLoading}
                    className="font-semibold flex justify-center items-center gap-2 px-4 sm:px-5 py-2 sm:py-3
                    bg-linear-to-br from-blue-600 to-cyan-500 backdrop-blur-md border border-white/40 
                  text-white rounded-full shadow-md transition-all duration-300 hover:scale-105
                    hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] cursor-pointer text-sm sm:text-base">
                    <FontAwesomeIcon icon={faMessage} />
                    Invia
                </motion.button>

                {/* Pulsante ISPIRAMI */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRecommend}
                    disabled={isRecommending}
                    className={`font-semibold flex justify-center items-center gap-2 px-4 sm:px-5 py-2 sm:py-3
                    ${isRecommending
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-linear-to-br from-green-600 to-teal-500 hover:scale-105"}
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
