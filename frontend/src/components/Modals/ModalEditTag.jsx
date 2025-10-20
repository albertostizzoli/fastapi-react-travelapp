import { motion, AnimatePresence } from "framer-motion";
import travellers from "../../store/travellers";

// Questo è un Modale per selezionare o modificare i tag nella pagina EditDay
function ModalEditTag({ isOpen, onClose, tags, setTags, title }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}>
                    <motion.div
                        className="bg-blue-500 rounded-3xl shadow-2xl p-6 w-[90%] max-w-4xl overflow-y-auto max-h-[75vh] border border-white flex flex-col"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.3 }}>
                        <h2 className="text-white text-2xl font-bold mb-6 text-center">
                            🏷️ Cambia i tuoi Tag per la Tappa del tuo Viaggio
                        </h2>

                        <div className="space-y-6 flex-1 overflow-y-auto pr-2 scrollbar">
                            {/* Ciclo sulle categorie dal file store/travellers: category e experience vengono dallo store  */}
                            {travellers.map((cat) => (
                                <div key={cat.category}>
                                    <h3 className="text-lg font-semibold text-white mb-2">
                                        {cat.category}
                                    </h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                        {cat.experiences.map((experience) => (
                                            <label
                                                key={experience}
                                                className={`font-semibold flex items-center justify-center text-center px-3 py-2 border rounded-full cursor-pointer text-sm transition-all ${tags.includes(experience)
                                                        ? "bg-blue-700 border-white text-white shadow-md"
                                                        : "bg-white text-black border-gray-300 hover:bg-blue-100"
                                                    }`}>
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

                        <div className="mt-6 flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="font-semibold px-4 py-2 bg-green-500 hover:bg-green-400 text-white rounded-full transition hover:scale-105 cursor-pointer">
                                <i className="fa-solid fa-check mr-2"></i>
                                Conferma
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="font-semibold px-4 py-2 bg-red-500 hover:bg-red-400 text-white rounded-full transition hover:scale-105 cursor-pointer">
                                <i className="fa-solid fa-xmark mr-2"></i>
                                Chiudi
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default ModalEditTag;
