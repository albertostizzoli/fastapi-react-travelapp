import { AnimatePresence, motion } from "framer-motion";
import { FaArrowLeft, FaPlus, FaTrash } from "react-icons/fa";

function ChatListModal({ isOpen, onClose, chats, loadChat, startNewChat, setDeleteId, }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* OVERLAY */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-40"
                    />

                    {/* MODALE */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 40 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                        className=" fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                        w-[90%] max-w-3xl max-h-[80vh] bg-white/10 dark:bg-white/5 backdrop-blur-3xl
                        border border-white/20 dark:border-white/10
                        rounded-3xl flex flex-col overflow-hidden">
                        {/* HEADER */}
                        <div className="flex gap-3 p-4 justify-between items-center border-b border-white/30">
                            <button
                                onClick={onClose}
                                className="font-semibold flex items-center gap-2 px-3 py-2 text-sm sm:text-base
                                bg-linear-to-br from-blue-600 to-cyan-500 dark:from-blue-600/70 dark:to-cyan-500/70
                                backdrop-blur-md border border-white/40 text-white cursor-pointer
                                rounded-full shadow-md transition-all duration-300 hover:scale-105
                                hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]">
                                <FaArrowLeft size={16} />
                                <span className="hidden sm:inline">Chiudi</span>
                            </button>

                            <h2 className="text-white font-bold text-lg sm:text-xl md:text-2xl text-center">
                                Le tue chat
                            </h2>

                            <button
                                onClick={() => {
                                    startNewChat();
                                    onClose();
                                }}
                                className="font-semibold flex items-center gap-2 px-3 py-2 text-sm sm:text-base cursor-pointer
                                  bg-linear-to-br from-green-600 to-teal-500 dark:from-green-600/70 dark:to-teal-500/70
                                  backdrop-blur-md border border-white/40 text-white rounded-full shadow-md transition-all duration-300
                                  hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]">
                                <FaPlus size={16} />
                                <span className="hidden sm:inline">Nuova Chat</span>
                            </button>
                        </div>

                        {/* LISTA CHAT */}
                        <div className="flex-1 overflow-y-auto space-y-1 p-4 scrollbar">
                            {chats.length === 0 && (
                                <p className="text-white text-xl text-center mt-4">
                                    Nessuna chat salvata
                                </p>
                            )}

                            {chats.map((chat) => (
                                <div key={chat.id} className="flex items-center gap-2 min-w-0">
                                    <button
                                        onClick={() => {
                                            loadChat(chat.id);
                                            onClose();
                                        }}
                                        className="flex-1 text-left px-4 py-2 rounded-xl text-white text-xl hover:bg-white/10 
                                        cursor-pointer transition overflow-hidden">
                                        <div className="truncate font-medium">
                                            {chat.title || `Chat #${chat.id}`}
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => setDeleteId(chat.id)}
                                        className="font-semibold flex items-center gap-2 px-3 py-2 text-sm sm:text-base cursor-pointer
                                        bg-linear-to-br from-red-600 to-rose-500 dark:from-red-600/70 dark:to-rose-500/70
                                        backdrop-blur-md border border-white/40 text-white rounded-full shadow-md transition-all duration-300
                                        hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]">
                                        <FaTrash size={16} />
                                        Cancella Chat
                                    </button>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default ChatListModal;
