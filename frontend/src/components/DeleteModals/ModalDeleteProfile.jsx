import { motion, AnimatePresence } from "framer-motion";

function ModalDeleteProfile({ isOpen, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[9999] p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Glow di sfondo animato */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute w-[25rem] h-[25rem] bg-gradient-to-br from-blue-400/20 to-orange-400/10 rounded-full 
            blur-3xl top-10 left-10 animate-[pulse_6s_ease-in-out_infinite]" />
            <div className="absolute w-[28rem] h-[28rem] bg-gradient-to-br from-orange-500/20 to-blue-400/10 rounded-full 
            blur-3xl bottom-10 right-10 animate-[pulse_6s_ease-in-out_infinite]" />
          </div>

          <motion.div
            className="relative w-full max-w-md rounded-3xl border border-white/40 bg-gradient-to-br 
            from-white/20 via-white/10 to-transparent backdrop-blur-2xl shadow-2xl text-white 
            p-8 text-center overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Titolo */}
            <h2 className="text-2xl font-extrabold mb-6 text-white drop-shadow-lg">
              Vuoi davvero cancellare il tuo profilo?
            </h2>

            <p className="text-white/70 mb-8 text-sm">
              Questa azione è <span className="text-red-400 font-semibold">irreversibile</span>.<br />
              Tutti i tuoi dati e preferenze verranno rimossi definitivamente.
            </p>

            {/* Pulsanti azione */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={onConfirm}
                className="font-semibold flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r 
                from-green-600/70 to-teal-500/60 backdrop-blur-md border border-white/40 text-white 
                rounded-full shadow-md transition-all duration-100 ease-in-out cursor-pointer hover:scale-105 
                hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]"
              >
                <i className="fa-solid fa-check mr-2"></i> Sì
              </button>

              <button
                onClick={onCancel}
                className="font-semibold flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r 
                from-red-600/70 to-rose-500/60 backdrop-blur-md border border-white/40 text-white 
                rounded-full shadow-md transition-all duration-100 ease-in-out cursor-pointer hover:scale-105 
                hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]"
              >
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

