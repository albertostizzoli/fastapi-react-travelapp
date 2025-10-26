import { motion, AnimatePresence } from "framer-motion";
import travellers from "../../store/travellers";

function LoginModal({ isOpen, onClose, selectedInterests, toggleInterest }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[2000] p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Glow di sfondo */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute w-[30rem] h-[30rem] bg-gradient-to-br from-blue-500/30 to-cyan-400/10 rounded-full 
            blur-3xl top-10 left-10 animate-[pulse_6s_ease-in-out_infinite]" />
            <div className="absolute w-[32rem] h-[32rem] bg-gradient-to-br from-orange-400/30 to-pink-400/10 rounded-full 
            blur-3xl bottom-10 right-10 animate-[pulse_6s_ease-in-out_infinite]" />
          </div>

          {/* Contenitore principale */}
          <motion.div
            className="relative rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl border border-white/40 
            bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-2xl text-white 
            flex flex-col overflow-hidden"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Contenuto scrollabile */}
            <div className="flex-1 p-6 overflow-y-auto scrollbar">
              <h2 className="text-3xl font-extrabold text-white/90 mb-6 drop-shadow-lg text-center">
                Dicci le tue Esperienze
              </h2>

              {travellers.map((category) => (
                <div key={category.category} className="mb-8">
                  <h3 className="text-xl font-semibold text-white/90 mb-2 drop-shadow-md">
                    {category.category}
                  </h3>

                  {category.description && (
                    <p className="text-sm text-white/70 mb-4 italic">
                      {category.description}
                    </p>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {category.experiences.map((experience) => {
                      const selected = selectedInterests.includes(experience);
                      return (
                        <button
                          type="button"
                          key={experience}
                          onClick={() => toggleInterest(experience)}
                          className={`font-semibold flex items-center justify-center text-center gap-2 px-3 py-2 rounded-full 
                            cursor-pointer text-sm transition-all duration-100 ease-in-out border border-white/40 backdrop-blur-md 
                            hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] ${
                              selected
                                ? "bg-gradient-to-r from-orange-500/60 to-rose-400/60 text-white/90 shadow-lg"
                                : "bg-gradient-to-r from-white/10 to-white/20 text-white/90 shadow-md hover:bg-white/20"
                            }`}
                        >
                          {experience}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Azioni */}
            <div className="p-4 flex justify-end gap-4 border-t border-white/40 bg-white/5 backdrop-blur-lg">
              <button
                onClick={onClose}
                className="font-semibold px-6 py-2 bg-gradient-to-r from-red-500/60 to-rose-400/60 backdrop-blur-md 
                border border-white/40 text-white/90 rounded-full shadow-md transition-all duration-100 
                ease-in-out cursor-pointer hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]"
              >
                <i className="fa-solid fa-xmark mr-2"></i> Annulla
              </button>
              <button
                onClick={onClose}
                className="font-semibold px-6 py-2 bg-gradient-to-r from-green-500/60 to-teal-400/60 backdrop-blur-md 
                border border-white/40 text-white/90 rounded-full shadow-md transition-all duration-100 
                ease-in-out cursor-pointer hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]"
              >
                <i className="fa-solid fa-check mr-2"></i> Salva Esperienze
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LoginModal;

