import { motion, AnimatePresence } from "framer-motion";
import travellers from "../../store/travellers";

// Questo è il modale per la modifica del profilo
function EditProfileModal({
  isOpen,
  onClose,
  onSubmit,
  editForm,
  setEditForm,
  showPassword,
  setShowPassword,
}) {
  const allExperiences = travellers.flatMap((t) => t.experiences);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

    return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.form
            onSubmit={onSubmit}
            encType="multipart/form-data"
            className="relative border border-white/40 bg-gradient-to-br from-white/10 via-white/5 to-transparent 
            backdrop-blur-2xl p-8 rounded-3xl shadow-2xl w-[95%] max-w-4xl text-white grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {/* Glow animato dietro */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <div className="absolute w-[30rem] h-[30rem] bg-gradient-to-br from-blue-500/30 to-cyan-400/10 rounded-full 
              blur-3xl top-10 left-10 animate-[pulse_6s_ease-in-out_infinite]" />
              <div className="absolute w-[32rem] h-[32rem] bg-gradient-to-br from-orange-400/30 to-pink-400/10 rounded-full 
              blur-3xl bottom-10 right-10 animate-[pulse_6s_ease-in-out_infinite]" />
            </div>

            <h2 className="text-3xl font-extrabold text-white/90 mb-4 text-center md:col-span-2 drop-shadow-lg">
              Modifica Profilo
            </h2>

            {/* Colonna sinistra */}
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                value={editForm.name}
                onChange={handleChange}
                placeholder="Nome"
                className="w-full px-4 py-2 font-semibold rounded-full bg-white/10 border border-white/40 placeholder-white/70 
                focus:ring-2 focus:ring-blue-300 focus:border-transparent transition text-white/90"
                required
              />
              <input
                type="text"
                name="surname"
                value={editForm.surname}
                onChange={handleChange}
                placeholder="Cognome"
                className="w-full px-4 py-2 font-semibold rounded-full bg-white/10 border border-white/40 placeholder-white/70 
                focus:ring-2 focus:ring-blue-300 focus:border-transparent transition text-white/90"
                required
              />
              <input
                type="email"
                name="email"
                value={editForm.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full px-4 py-2 font-semibold rounded-full bg-white/10 border border-white/40 placeholder-white/70 
                focus:ring-2 focus:ring-blue-300 focus:border-transparent transition text-white/90"
                required
              />

              {/* Password */}
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={editForm.password}
                  onChange={handleChange}
                  placeholder="Nuova Password"
                  className="w-full px-4 py-2 font-semibold rounded-full bg-white/10 border border-white/40 placeholder-white/70 
                  focus:ring-2 focus:ring-blue-300 focus:border-transparent transition text-white/90"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-white/70 hover:text-white cursor-pointer"
                >
                  {showPassword ? (
                    <i className="fa-solid fa-eye-slash"></i>
                  ) : (
                    <i className="fa-solid fa-eye"></i>
                  )}
                </button>
              </div>
            </div>

            {/* Colonna destra */}
            <div className="space-y-4">
              {/* Selezione interessi */}
              <select
                onChange={(e) => {
                  const selected = e.target.value;
                  if (selected && !editForm.interests.includes(selected)) {
                    setEditForm((prev) => ({
                      ...prev,
                      interests: [...prev.interests, selected],
                    }));
                  }
                  e.target.value = "";
                }}
                className="w-full px-4 py-2 font-semibold rounded-full bg-white/10 
                border border-white/40 text-white/90 focus:ring-2 focus:ring-blue-300 focus:border-transparent transition 
                cursor-pointer scrollbar"
              >
                <option value="" className="bg-black text-white">
                  Seleziona un’esperienza
                </option>
                {allExperiences.map((exp, i) => (
                  <option key={i} value={exp} className="bg-black to-transparent text-white">
                    {exp}
                  </option>
                ))}
              </select>

              {/* Mostra interessi scelti */}
              {editForm.interests.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {editForm.interests.map((interest, i) => (
                    <span
                      key={i}
                      className="bg-gradient-to-r from-blue-500/60 to-cyan-400/60 px-3 py-1 rounded-full text-sm text-white/90 
                      flex items-center gap-2 shadow-md"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() =>
                          setEditForm((prev) => ({
                            ...prev,
                            interests: prev.interests.filter((x) => x !== interest),
                          }))
                        }
                        className="hover:text-rose-400 transition cursor-pointer"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Upload immagine */}
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleChange}
                className="w-full text-sm text-white/80 cursor-pointer hover:text-white hover:underline transition"
              />
            </div>

            {/* Pulsanti */}
            <div className="flex justify-between mt-8 md:col-span-2">
              <button
                type="button"
                onClick={onClose}
                className="font-semibold px-6 py-2 bg-gradient-to-r from-red-500/60 to-rose-400/60 backdrop-blur-md border 
                border-white/40 text-white/90 rounded-full shadow-md transition-all duration-100 ease-in-out cursor-pointer
                hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                <i className="fa-solid fa-xmark mr-2"></i> Annulla
              </button>
              <button
                type="submit"
                className="font-semibold px-6 py-2 bg-gradient-to-r from-green-500/60 to-teal-400/60 backdrop-blur-md border 
              border-white/40 text-white/90 rounded-full shadow-md transition-all duration-100 ease-in-out cursor-pointer
                hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                <i className="fa-solid fa-check mr-2"></i> Salva
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default EditProfileModal;
