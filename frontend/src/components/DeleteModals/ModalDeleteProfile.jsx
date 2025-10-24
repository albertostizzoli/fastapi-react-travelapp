import { motion, AnimatePresence } from "framer-motion";

// Questo è il modale per cancellare il profilo
function ModalDeleteProfile({ isOpen, onConfirm, onCancel }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-[9999]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}>
                    <motion.div
                        className="relative bg-white/15 backdrop-blur-2xl border border-white/20 shadow-2xl p-8 rounded-3xl w-11/12 max-w-md text-center overflow-hidden"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}>

                        {/* Effetto sfere di luce per profondità */}
                        <div className="absolute inset-0 -z-10">
                            <div className="absolute w-64 h-64 bg-blue-500/20 rounded-full blur-3xl top-0 left-0"></div>
                            <div className="absolute w-64 h-64 bg-red-500/20 rounded-full blur-3xl bottom-0 right-0"></div>
                        </div>

                        <h2 className="text-2xl font-bold mb-6 text-white drop-shadow-sm">
                            Vuoi cancellare il tuo profilo?
                        </h2>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button
                                onClick={onConfirm}
                                className="font-semibold flex items-center justify-center gap-2 px-5 py-2.5 
                                bg-gradient-to-r from-green-500 to-teal-400 hover:from-green-400 hover:to-teal-300 
                              text-white rounded-full shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer">
                                <i className="fa-solid fa-check"></i> Sì
                            </button>
                            <button
                                onClick={onCancel}
                                className="font-semibold flex items-center justify-center gap-2 px-5 py-2.5 
                                bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 
                              text-white rounded-full shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer">
                                <i className="fa-solid fa-xmark"></i> No
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default ModalDeleteProfile;
