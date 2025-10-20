import { motion, AnimatePresence } from "framer-motion";

// Questo è il modale per cancellare il profilo
function ModalDeleteProfile({ isOpen, onConfirm, onCancel }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center bg-transparent z-[9999]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}>
                    <motion.div
                        className="backdrop-blur-xl p-6 rounded-3xl shadow-lg w-80 text-center border border-white/10 bg-white/10"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.4 }}>
                        <h2 className="text-xl font-bold mb-4 text-white">
                            Vuoi cancellare il tuo profilo?
                        </h2>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={onConfirm}
                                className="font-semibold flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded-full shadow-md transition hover:scale-105 cursor-pointer">
                                <i className="fa-solid fa-check"></i> Sì
                            </button>
                            <button
                                onClick={onCancel}
                                className="font-semibold flex items-center gap-2 bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-full shadow-md transition hover:scale-105 cursor-pointer">
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
