import { motion, AnimatePresence } from "framer-motion";

function ModalDeleteProfile({ isOpen, onConfirm, onCancel }) {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="modalDeleteProfile"
          className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-9999 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{ willChange: "opacity" }}>
          
          {/* Contenuto del Modal */}
          <motion.div
            className="relative w-full max-w-md rounded-3xl border border-white/40 dark:border-white/10
            bg-linear-to-br from-orange-500 to-blue-500 dark:from-slate-500 dark:to-slate-900 
            backdrop-blur-2xl shadow-2xl p-8 text-center overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
            style={{ willChange: "opacity" }}>

            {/* Titolo */}
            <h2 className="text-2xl font-extrabold mb-6 text-white drop-shadow-lg">
              Vuoi davvero cancellare il tuo profilo?
            </h2>

            <p className="text-white mb-8 text-2sm drop-shadow-sm">
              Questa azione è <span className="text-red-400 font-semibold">irreversibile</span>.<br />
              Tutti i tuoi dati e preferenze verranno rimossi definitivamente.
            </p>

            {/* Pulsanti azione */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={onConfirm}
                className="font-semibold flex items-center justify-center gap-2 px-6 py-2 bg-linear-to-r 
                from-green-600 to-teal-500 backdrop-blur-md border border-white/40 text-white 
                rounded-full shadow-md transition-all duration-100 ease-in-out cursor-pointer hover:scale-105 
                hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]">
                <i className="fa-solid fa-check mr-2"></i> Sì
              </button>

              <button
                onClick={onCancel}
                className="font-semibold flex items-center justify-center gap-2 px-6 py-2 bg-linear-to-r 
                from-red-600 to-rose-500 backdrop-blur-md border border-white/40 text-white 
                rounded-full shadow-md transition-all duration-100 ease-in-out cursor-pointer hover:scale-105 
                hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]">
                <i className="fa-solid fa-xmark mr-2"></i> No
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ModalDeleteProfile;

