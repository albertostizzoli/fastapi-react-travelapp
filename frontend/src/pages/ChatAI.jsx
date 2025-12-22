import { motion, AnimatePresence } from "framer-motion"; // per le animazioni
import { FaCompass, FaList, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import ChatListModal from "../components/Modals/ModalListChat"; // importo il modale della lista delle chat
import ModalDeleteChat from "../components/DeleteModals/ModalDeleteChat"; // importo il modale di conferma eliminazione chat
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
        messagesEndRef,     // per fare lo scroll automatico
        startNewChat,       // funzione per iniziare una nuova chat
        chats,              // indica le chat caricate
        loadChat,           // funzione per caricare le chat
        message,            // messaggio di conferma o errore
        handleDelete,       // funzione per eliminare la chat
        deleteId,           // id della chat da eliminare
        setDeleteId,        // funzione per impostare l'id della chat da eliminare
        isChatListOpen,     // indica il modale della lista delle chat aperto / chiuso
        setIsChatListOpen   // indica se il modale della lista delle chat è aperto o chiuso
    } = ChatAIController();  // uso il controller della chat AI


    return (
        <div className="flex">

            { /* Modale Lista Chat */ }
            <ChatListModal
                isOpen={isChatListOpen}
                onClose={() => setIsChatListOpen(false)}
                chats={chats}
                loadChat={loadChat}
                startNewChat={startNewChat}
                setDeleteId={setDeleteId}
            />

            { /* CONTENUTO CHAT */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative flex flex-col h-[80vh] lg:h-[75vh] sm:h-[80vh] md:h-[90vh]
                w-[95%] sm:w-[90%] md:max-w-4xl lg:max-w-6xl mx-auto 
                mt-4 sm:mt-10 md:mt-12 bg-white/10 dark:bg-white/5 backdrop-blur-3xl
                border border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(255,255,255,0.1)]
                rounded-3xl ring-1 ring-white/10 overflow-hidden">

                {/* HEADER: Titolo AI centrato */}
                {!hasStartedChat && (
                    <h1 className="absolute top-[30%] sm:top-[35%] md:top-[40%]
                        left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-semibold tracking-wide
                        text-3xl drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] text-center">
                        {typedTitle}
                    </h1>
                )}

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
                                    <div className="bg-linear-to-br from-blue-500 to-orange-500 dark:from-slate-900 dark:to-slate-500 text-white 
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
                                            __html: i === messages.length - 1 ? formatText(typedResponse)
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
                <div className="p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-3 backdrop-blur-xl">

                    {/* INPUT */}
                    <input className="w-full sm:flex-1 sm:min-w-0 border border-white rounded-full px-4 pr-16 py-2 sm:py-3
                         text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-orange-400
                          dark:focus:ring-blue-400 transition text-sm sm:text-base"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) =>
                            e.key === "Enter" &&
                            !e.shiftKey &&
                            (e.preventDefault(), handleSend())
                        }
                        placeholder="Fammi una domanda..."
                    />

                    {/* Pulsante ISPIRAMI */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleRecommend}
                        disabled={isRecommending}
                        className={`w-full sm:w-auto font-semibold flex justify-center items-center gap-2 px-4 py-2 
                        ${isRecommending ? "bg-linear-to-br from-blue-600 to-purple-500 dark:from-blue-600/70 dark:to-purple-500/70 cursor-not-allowed"
                        : "bg-linear-to-br from-blue-600 to-red-500 dark:from-blue-600/70 dark:to-red-500/70 hover:scale-105"}
                        backdrop-blur-md border border-white/40 text-white 
                        rounded-full shadow-md transition-all duration-300 cursor-pointer
                        hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] text-base sm:text-2sm`}>
                        <FaCompass size={20} />
                        {isRecommending ? "Analizzo..." : "Consigliami"}
                    </motion.button>

                    <button
                        onClick={() => setIsChatListOpen(true)}
                        className="w-full sm:w-auto font-semibold flex justify-center items-center gap-2 px-4 py-2
                        bg-linear-to-br from-blue-600 to-cyan-500 dark:from-blue-600/70 dark:to-cyan-500/70
                        backdrop-blur-md border border-white/40 text-white 
                        rounded-full shadow-md transition-all duration-300 cursor-pointer hover:scale-105
                        hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] text-base sm:text-2sm">
                        <FaList size={20} />
                        Lista Chat
                    </button>
                </div>
            </motion.div>

            {/* Modale eliminazione */}
            <ModalDeleteChat
                isOpen={!!deleteId}
                onConfirm={handleDelete}
                onCancel={() => setDeleteId(null)}
                chat={chats?.find(v => v.id === deleteId)} // trova la chat dall'id
            />

            {/* Messaggio conferma */}
            {message && (
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.5 }}
                    className="fixed top-6 right-6 flex items-center gap-3bg-white/10 backdrop-blur-lg 
                      border border-white/40 text-white px-6 py-3 rounded-full shadow-xl z-9999
                      bg-linear-to-r from-blue-600 to-orange-600 dark:from-slate-900 dark:to-slate-500">
                    {message.icon === "success" && (
                        <FaCheckCircle size={20} className="text-green-400 text-2xl mr-2" />
                    )}
                    {message.icon === "error" && (
                        <FaTimesCircle size={20} className="text-red-400 text-2xl mr-2" />
                    )}
                    <p className="text-xl font-semibold">{message.text}</p>
                </motion.div>
            )}
        </div>
    );
}

export default ChatAI;
