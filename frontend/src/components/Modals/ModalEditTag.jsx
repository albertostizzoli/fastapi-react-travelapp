import { motion, AnimatePresence } from "framer-motion";
import travellers from "../../store/travellers";

// Modale Glassmorphism per modificare i tag nella pagina EditDay
function ModalEditTag({ isOpen, onClose, tags, setTags }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-3xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Glow morbido dietro al modale */}
                    <div className="absolute -z-10 w-[90%] h-[90%] rounded-3xl bg-gradient-to-br from-blue-900/30 via-blue-800/10 to-orange-900/20
                    blur-3xl" />
                    <motion.div
                        className="bg-white/30 backdrop-blur-3xl border border-white rounded-3xl shadow-2xl p-6 w-[90%] 
                        max-w-4xl max-h-[75vh] flex flex-col"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="absolute inset-0 -z-10 overflow-hidden">
                            <div className="absolute w-[28rem] h-[28rem] bg-gradient-to-br from-blue-500/20 to-orange-400/10 rounded-full 
                                blur-3xl top-10 left-10 animate-[pulse_6s_ease-in-out_infinite]" />
                            <div className="absolute w-[32rem] h-[32rem] bg-gradient-to-br from-orange-500/20 to-blue-400/10 rounded-full 
                                blur-3xl bottom-10 right-10 animate-[pulse_6s_ease-in-out_infinite]" />
                        </div>
                        <h2 className="text-white text-2xl font-bold mb-6 text-center drop-shadow-md">
                            Cambia i tuoi Tag per la Tappa del tuo Viaggio
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
                                                        rounded-2xl cursor-pointer text-sm transition-all backdrop-blur-md ${tags.includes(experience)
                                                        ? "bg-gradient-to-r from-blue-600 to-cyan-500 backdrop-blur-md border border-white text-white shadow-lg transition-all duration-100 ease-in-out hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                                                        : "bg-gradient-to-r from-white/10 to-white/30 backdrop-blur-md border border-white text-white shadow-lg transition-all duration-100 ease-in-out hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
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
                                className="font-semibold px-4 py-2 bg-gradient-to-r from-red-600 to-rose-500 backdrop-blur-md border 
                                border-white text-white rounded-full transition-all duration-100 ease-in-out hover:scale-105 
                                cursor-pointer hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]">
                                <i className="fa-solid fa-xmark mr-2"></i>
                                Chiudi
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="font-semibold px-4 py-2 bg-gradient-to-r from-green-600 to-teal-500 backdrop-blur-md border 
                                border-white text-white rounded-full transition-all duration-100 ease-in-out hover:scale-105 
                                cursor-pointer hover:shadow-[0_0_20px_rgba(255,255,255,0.25)">
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

export default ModalEditTag;
