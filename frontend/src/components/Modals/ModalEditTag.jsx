import { motion, AnimatePresence } from "framer-motion";
import travellers from "../../store/travellers";

// Modale Glassmorphism per modificare i tag nella pagina EditDay
function ModalEditTag({ isOpen, onClose, tags, setTags, title }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white/30 backdrop-blur-3xl border border-white/20 rounded-3xl shadow-2xl p-6 w-[90%] max-w-4xl max-h-[75vh] overflow-y-auto flex flex-col"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2 className="text-white text-2xl font-bold mb-6 text-center drop-shadow-md">
                            🏷️ {title || "Cambia i tuoi Tag per la Tappa del tuo Viaggio"}
                        </h2>

                        {/* Lista categorie */}
                        <div className="space-y-6 flex-1 overflow-y-auto pr-2 scrollbar-custom">
                            {travellers.map((cat) => (
                                <div key={cat.category}>
                                    <h3 className="text-lg font-semibold text-blue-300 mb-2 drop-shadow-sm">
                                        {cat.category}
                                    </h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                        {cat.experiences.map((experience) => (
                                            <label
                                                key={experience}
                                                className={`font-semibold flex items-center justify-center text-center px-3 py-2 border rounded-2xl cursor-pointer text-sm transition-all backdrop-blur-md ${tags.includes(experience)
                                                        ? "bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 border-blue-400 text-white shadow-lg"
                                                        : "bg-white/10 border-white/20 text-white hover:bg-blue-400/20 hover:scale-105"
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={tags.includes(experience)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setTags([...tags, experience]);
                                                        } else {
                                                            setTags(tags.filter((c) => c !== experience));
                                                        }
                                                    }}
                                                />
                                                <span>{experience}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pulsanti */}
                        <div className="mt-6 flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="font-semibold px-4 py-2 bg-gradient-to-r from-red-500 to-rose-400 hover:from-red-400 hover:to-rose-300 text-white rounded-full shadow-md transition hover:scale-105 cursor-pointer flex items-center gap-2"
                            >
                                <i className="fa-solid fa-xmark"></i>
                                Chiudi
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="font-semibold px-4 py-2 bg-gradient-to-r from-green-500 to-teal-400 hover:from-green-400 hover:to-teal-300 text-white rounded-full shadow-md transition hover:scale-105 cursor-pointer flex items-center gap-2"
                            >
                                <i className="fa-solid fa-check"></i>
                                Conferma
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default ModalEditTag;
