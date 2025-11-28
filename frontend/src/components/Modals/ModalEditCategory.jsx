import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaTimes } from "react-icons/fa";
import travellers from "../../store/travellers";

// Modale Glassmorphism per modificare i tag nella pagina EditDay
function ModalEditCategory({ isOpen, onClose, categories, setCategories }) {
    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <motion.div
                    key="editTagModal"
                    className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-3xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    style={{ willChange: "opacity" }}>

                    <motion.div
                        className="bg-white/30 backdrop-blur-3xl border border-white 
                        bg-linear-to-br from-blue-500/40 to-orange-500/30 dark:from-slate-900 dark:to-slate-500
                        rounded-3xl shadow-2xl p-6 w-[90%] 
                        max-w-4xl max-h-[75vh] flex flex-col"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
                        style={{ willChange: "transform, opacity" }}>

                        <h2 className="text-white text-2xl font-bold mb-6 text-center drop-shadow-md">
                            Aggiungi altre Esperienze per la Tappa del tuo Viaggio
                        </h2>

                        {/* Lista categorie */}
                        <div className="space-y-6 flex-1 overflow-y-auto pr-2 scrollbar">
                            {travellers.map((cat) => (
                                <div key={cat.category}>
                                    <h3 className="text-lg font-semibold text-white mb-2 drop-shadow-sm">
                                        {cat.category}
                                    </h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                        {cat.experiences.map((experience) => (
                                            <label
                                                key={experience}
                                                className={`font-semibold flex items-center justify-center text-center px-3 py-2 border 
                                                        rounded-2xl cursor-pointer text-sm transition-all backdrop-blur-md ${categories.includes(experience)
                                                        ? "bg-linear-to-br from-blue-600 to-orange-600 backdrop-blur-md border border-white text-white shadow-lg transition-all duration-100 ease-in-out hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                                                        : "bg-linear-to-br from-white/10 to-white/20 backdrop-blur-md border border-white text-white shadow-lg transition-all duration-100 ease-in-out hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                                                    }`}>

                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={categories.includes(experience)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setCategories([...categories, experience]);
                                                        } else {
                                                            setCategories(categories.filter((c) => c !== experience));
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
                                className="font-semibold flex items-center justify-center gap-2 px-6 py-2 
                                bg-linear-to-br from-red-600 to-rose-500 backdrop-blur-md border border-white/40 
                              text-white rounded-full shadow-md transition-all duration-300 ease-in-out cursor-pointer
                                hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]">
                                <FaTimes size={20} className="mr-2" />Chiudi
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="font-semibold flex items-center justify-center gap-2 px-6 py-2 
                                bg-linear-to-br from-green-600 to-teal-500 backdrop-blur-md border border-white/40 
                              text-white rounded-full shadow-md transition-all duration-300 ease-in-out cursor-pointer
                                hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)])">
                                <FaCheck size={20} className="mr-2" />Conferma
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default ModalEditCategory;
