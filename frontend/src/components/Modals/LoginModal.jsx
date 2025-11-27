import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaTimes } from "react-icons/fa";
import travellers from "../../store/travellers";

function LoginModal({ isOpen, onClose, selectedExperiences, toggleExperience }) {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="loginModal"
          className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-2000 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{ willChange: "opacity" }}>

          {/* Glow morbido dietro al modale */}
          <div className="absolute -z-10 w-[90%] h-[90%] rounded-3xl bg-linear-to-br from-blue-900/30 via-blue-800/10 to-orange-900/20
              blur-3xl" />

          {/* Contenitore principale */}
          <motion.div
            className="relative rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl border border-white/40 
            bg-linear-to-br from-blue-500/40 to-orange-500/30 dark:from-slate-900 dark:to-slate-500
            backdrop-blur-2xl text-white flex flex-col overflow-hidden"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
            style={{ willChange: "transform, opacity" }}>

            {/* Contenuto scrollabile */}
            <div className="flex-1 p-6 overflow-y-auto scrollbar">
              <h2 className="text-3xl font-extrabold text-white/90 mb-6 drop-shadow-lg text-center">
                Le tue esperienze preferite
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
                      const selected = selectedExperiences.includes(experience);
                      return (
                        <button
                          type="button"
                          key={experience}
                          onClick={() => toggleExperience(experience)}
                          className={`font-semibold flex items-center justify-center text-center gap-2 px-3 py-2 rounded-full 
                            cursor-pointer text-sm transition-all duration-300 ease-in-out border border-white/40 backdrop-blur-md 
                            hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] ${selected
                              ? "bg-linear-to-br from-blue-600 to-orange-600 text-white/90 shadow-lg"
                              : "bg-linear-to-br from-white/10 to-white/20 text-white/90 shadow-md hover:bg-white/20"
                            }`}>
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
                className="font-semibold flex justify-center items-center gap-2 px-6 py-2
                  bg-linear-to-br from-red-600 to-rose-500 backdrop-blur-md border border-white/40
                 text-white rounded-full shadow-md transition-all duration-300 hover:scale-105
                  hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] cursor-pointer">
                <FaTimes size={20} className="mr-2" /> Annulla
              </button>
              <button
                onClick={onClose}
                className="font-semibold flex justify-center items-center gap-2 px-6 py-2
                  bg-linear-to-br from-green-600 to-teal-500 backdrop-blur-md border border-white/40
                 text-white rounded-full shadow-md transition-all duration-300 hover:scale-105
                  hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] cursor-pointer">
                <FaCheck size={20} className="mr-2" /> Salva Esperienze
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LoginModal;

