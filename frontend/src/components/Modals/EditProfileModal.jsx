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

  // aggiorna lo stato del form di modifica
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="editProfileModal"
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{ willChange: "opacity" }}>

          <motion.form
            onSubmit={onSubmit}
            encType="multipart/form-data"
            className="relative border border-white/40 dark:border-white/10 bg-linear-to-br from-blue-500 to-orange-500 dark:from-slate-900 dark:to-slate-500 
            backdrop-blur-2xl p-8 rounded-3xl shadow-2xl w-[95%] max-w-4xl text-white grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
            style={{ willChange: "opacity" }}>

            <h2 className="text-3xl font-extrabold text-white mb-4 text-center md:col-span-2 drop-shadow-lg">
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
                focus:ring-2 focus:ring-orange-400 dark:focus:ring-blue-400 focus:border-transparent transition text-white"
                required
              />
              <input
                type="text"
                name="surname"
                value={editForm.surname}
                onChange={handleChange}
                placeholder="Cognome"
                className="w-full px-4 py-2 font-semibold rounded-full bg-white/10 border border-white/40 placeholder-white/70 
                focus:ring-2 focus:ring-orange-400 dark:focus:ring-blue-400 focus:border-transparent transition text-white"
                required
              />
              <input
                type="email"
                name="email"
                value={editForm.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full px-4 py-2 font-semibold rounded-full bg-white/10 border border-white/40 placeholder-white/70 
                focus:ring-2 focus:ring-orange-400 dark:focus:ring-blue-400 focus:border-transparent transition text-white"
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
                  focus:ring-2 focus:ring-orange-400 dark:focus:ring-blue-400 focus:border-transparent transition text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-white hover:text-white cursor-pointer">
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
                border border-white/40 text-white focus:ring-2 focus:ring-blue-300 focus:border-transparent transition 
                cursor-pointer scrollbar">
                <option value="" className="bg-orange-300 text-black dark:bg-slate-300">
                  Seleziona un’esperienza
                </option>
                {allExperiences.map((exp, i) => (
                  <option key={i} value={exp} className="bg-orange-300 text-black dark:bg-slate-300">
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
                      className="bg-linear-to-r from-blue-600 to-cyan-500 px-3 py-1 rounded-full text-sm text-white 
                      flex items-center gap-2 shadow-md">
                      {interest}
                      <button
                        type="button"
                        onClick={() =>
                          setEditForm((prev) => ({
                            ...prev,
                            interests: prev.interests.filter((x) => x !== interest),
                          }))
                        }
                        className="hover:text-rose-400 transition cursor-pointer">
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
                className="w-full text-sm text-white cursor-pointer hover:text-white hover:underline transition"
              />
            </div>

            {/* Pulsanti */}
            <div className="flex justify-between mt-8 md:col-span-2">
              <button
                type="button"
                onClick={onClose}
                className="font-semibold px-6 py-2 bg-linear-to-r from-red-600 to-rose-500 backdrop-blur-md border 
                border-white/40 text-white rounded-full shadow-md transition-all duration-100 ease-in-out cursor-pointer
                hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                <i className="fa-solid fa-xmark mr-2"></i> Annulla
              </button>
              <button
                type="submit"
                className="font-semibold px-6 py-2 bg-linear-to-r from-green-600 to-teal-500 backdrop-blur-md border 
              border-white/40 text-white rounded-full shadow-md transition-all duration-100 ease-in-out cursor-pointer
                hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
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
