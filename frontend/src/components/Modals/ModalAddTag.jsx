import { motion, AnimatePresence } from "framer-motion";
import travellers from "../../store/travellers";

// Questo è il modale per i tag nel form Aggiungi Tappa
function ModalAddTag({ isOpen, onClose, form, setForm }) {

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}>
                    <motion.div
                        className="bg-white/30 backdrop-blur-xl rounded-3xl shadow-2xl p-6 w-[90%] max-w-4xl overflow-y-auto 
                        max-h-[75vh] border border-white/40 flex flex-col"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.4 }}>
                        <h2 className="text-white text-2xl font-bold mb-4 text-center drop-shadow-md">
                            🏷️ Seleziona i tuoi Tag per la Tappa del tuo Viaggio
                        </h2>

                        {/* Lista categorie */}
                        <div className="space-y-5 flex-1 overflow-y-auto pr-2 scrollbar">
                            {travellers.map((cat) => (
                                <div key={cat.category}>
                                    <h3 className="text-lg font-semibold text-white/90 mb-2 drop-shadow-md">
                                        {cat.category}
                                    </h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                        {cat.experiences.map((experience) => (
                                            <label
                                                key={experience}
                                                className={`font-semibold flex items-center justify-center text-center gap-2 px-3 py-2 border 
                                                        rounded-2xl cursor-pointer text-sm transition-all backdrop-blur-md ${form.tags.includes(experience)
                                                        ? "bg-gradient-to-r from-blue-500/60 to-cyan-400/60 backdrop-blur-md border border-white/40 text-white/90 shadow-lg transition-all duration-100 ease-in-out hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                                                        : "bg-gradient-to-r from-white/10 to-white/30 backdrop-blur-md border border-white/40 text-white/90 shadow-lg transition-all duration-100 ease-in-out hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                                                    }`}>
                                                <input
                                                    type="checkbox"
                                                    className="accent-blue-500 hidden"
                                                    checked={form.tags.includes(experience)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setForm({
                                                                ...form,
                                                                tags: [...form.tags, experience],
                                                            });
                                                        } else {
                                                            setForm({
                                                                ...form,
                                                                tags: form.tags.filter((c) => c !== experience),
                                                            });
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
                                className="font-semibold px-4 py-2 bg-gradient-to-r from-red-500/60 to-rose-400/60 backdrop-blur-md border 
                                border-white/40 text-white/90 rounded-full transition-all duration-100 ease-in-out hover:scale-105 
                                cursor-pointer hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]">
                                <i className="fa-solid fa-xmark mr-2"></i>
                                Chiudi
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="font-semibold px-4 py-2 bg-gradient-to-r from-green-500/60 to-teal-400/60 backdrop-blur-md border 
                                border-white/40 text-white/90 rounded-full transition-all duration-100 ease-in-out hover:scale-105 
                                cursor-pointer hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]">
                                <i className="fa-solid fa-check mr-2"></i>
                                Conferma
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default ModalAddTag;
