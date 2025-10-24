import { motion, AnimatePresence } from "framer-motion";
import travellers from "../../store/travellers";

function LoginModal({ isOpen, onClose, selectedInterests, toggleInterest }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-[2000] p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="relative rounded-3xl w-full max-w-3xl max-h-[90vh] shadow-2xl border border-white/30 bg-white/10 backdrop-blur-lg text-white flex flex-col overflow-hidden"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                        {/* Contenuto scrollabile */}
                        <div className="flex-1 p-6 overflow-y-auto scrollbar-custom">
                            <h2 className="text-2xl font-semibold text-white mb-4 drop-shadow-lg">
                                Dicci le tue esperienze
                            </h2>

                            {travellers.map((category) => (
                                <div key={category.category} className="mb-6">
                                    <h3 className="text-lg font-bold text-white/90 mb-1">
                                        {category.category}
                                    </h3>

                                    {category.description && (
                                        <p className="text-sm text-white/70 mb-3 italic">
                                            {category.description}
                                        </p>
                                    )}

                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                        {category.experiences.map((experience) => (
                                            <button
                                                type="button"
                                                key={experience}
                                                onClick={() => toggleInterest(experience)}
                                                className={`font-semibold flex items-center justify-center text-center gap-2 px-3 py-2 rounded-full cursor-pointer text-sm transition-all border border-white/30 hover:scale-105 ${selectedInterests.includes(experience)
                                                    ? "bg-gradient-to-r from-orange-400 to-pink-400 text-black shadow-lg"
                                                    : "bg-white/20 text-white hover:bg-white/30 shadow-md"
                                                    }`}
                                            >
                                                {experience}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Azioni */}
                        <div className="p-4 flex justify-end gap-3 border-t border-white/20 backdrop-blur-sm">
                            <button
                                onClick={onClose}
                                className="font-semibold px-4 py-2 bg-gradient-to-r from-green-500 to-teal-400 hover:from-green-400 hover:to-teal-300 text-white rounded-full transition hover:scale-105 cursor-pointer"
                            >
                                <i className="fa-solid fa-check mr-2"></i> Salva Esperienze
                            </button>
                            <button
                                onClick={onClose}
                                className="font-semibold px-4 py-2 bg-gradient-to-r from-red-500 to-pink-400 hover:from-red-400 hover:to-pink-300 text-white rounded-full transition hover:scale-105 cursor-pointer"
                            >
                                <i className="fa-solid fa-xmark mr-2"></i> Annulla
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default LoginModal;
