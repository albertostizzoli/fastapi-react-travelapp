import { motion, AnimatePresence } from "framer-motion";
import travellers from "../../store/travellers";

// Modale per i tag che si trova nella pagina di Login / Registrazione
function LoginModal({ isOpen, onClose, selectedInterests, toggleInterest }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999] p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}>
                    <motion.div
                        className="bg-gray-800 rounded-3xl w-full max-w-3xl max-h-[90vh] shadow-lg flex flex-col overflow-hidden"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.3 }}>
                        {/* Contenuto scrollabile */}
                        <div className="flex-1 p-6 overflow-y-auto scrollbar-custom">
                            <h2 className="text-2xl font-semibold text-white mb-4">
                                Dicci le tue esperienze
                            </h2>

                            {travellers.map((category) => (
                                <div key={category.category} className="mb-6">
                                    <h3 className="text-lg font-bold text-white mb-1">
                                        {category.category}
                                    </h3>

                                    {category.description && (
                                        <p className="text-sm text-white mb-3 italic">
                                            {category.description}
                                        </p>
                                    )}

                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                        {category.experiences.map((experience) => (
                                            <button
                                                type="button"
                                                key={experience}
                                                onClick={() => toggleInterest(experience)}
                                                className={`font-semibold flex items-center justify-center text-center gap-2 px-3 py-2 border rounded-full cursor-pointer text-sm transition-all hover:scale-105 ${selectedInterests.includes(experience)
                                                        ? "bg-orange-400 text-black"
                                                        : "bg-blue-500 text-white hover:bg-blue-400"
                                                    }`}>
                                                {experience}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Azioni */}
                        <div className="p-4 flex justify-end gap-3 border-t border-gray-700">
                            <button
                                onClick={onClose}
                                className="font-semibold px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-400 transition hover:scale-105 cursor-pointer">
                                <i className="fa-solid fa-check mr-2"></i> Salva Esperienze
                            </button>
                            <button
                                onClick={onClose}
                                className="font-semibold px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-400 transition hover:scale-105 cursor-pointer">
                                <i className="fa-solid fa-xmark mr-2"></i> Annulla
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default LoginModal