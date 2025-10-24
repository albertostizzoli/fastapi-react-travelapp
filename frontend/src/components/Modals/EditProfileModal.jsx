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
          className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-[9999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}>
          <motion.form
            onSubmit={onSubmit}
            encType="multipart/form-data"
            className="border border-white/30 bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-lg w-[95%] max-w-4xl text-white grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.4 }}>
            <h2 className="text-2xl font-bold text-blue-500 mb-4 text-center md:col-span-2">
              Modifica Profilo
            </h2>

            {/* Colonna sinistra */}
            <div className="space-y-3">
              <input
                type="text"
                name="name"
                value={editForm.name}
                onChange={handleChange}
                placeholder="Nome"
                className="w-full px-4 py-2 rounded-full bg-white/20 placeholder-white/70 focus:outline-none"
                required
              />
              <input
                type="text"
                name="surname"
                value={editForm.surname}
                onChange={handleChange}
                placeholder="Cognome"
                className="w-full px-4 py-2 rounded-full bg-white/20 placeholder-white/70 focus:outline-none"
                required
              />
              <input
                type="email"
                name="email"
                value={editForm.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full px-4 py-2 rounded-full bg-white/20 placeholder-white/70 focus:outline-none"
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
                  className="w-full px-4 py-2 rounded-full bg-white/20 placeholder-white/70 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-white/70 hover:text-white cursor-pointer">
                  {showPassword ? (
                    <i className="fa-solid fa-eye-slash"></i>
                  ) : (
                    <i className="fa-solid fa-eye"></i>
                  )}
                </button>
              </div>
            </div>

            {/* Colonna destra */}
            <div className="space-y-3">
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
                className="w-full px-4 py-2 rounded-full bg-white/20 text-white focus:outline-none cursor-pointer scrollbar">
                <option value="" className="bg-gray-600 text-white">
                  Seleziona un’esperienza
                </option>
                {allExperiences.map((exp, i) => (
                  <option
                    key={i}
                    value={exp}
                    className="bg-gray-600 text-white">
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
                      className="bg-blue-500/70 px-3 py-1 rounded-full text-sm text-white/90 flex items-center gap-2">
                      {interest}
                      <button
                        type="button"
                        onClick={() =>
                          setEditForm((prev) => ({
                            ...prev,
                            interests: prev.interests.filter(
                              (x) => x !== interest
                            ),
                          }))
                        }
                        className="hover:text-red-400 cursor-pointer">
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
                className="w-full text-sm text-white cursor-pointer hover:underline"
              />
            </div>

            {/* Pulsanti */}
            <div className="flex justify-between mt-6 md:col-span-2">
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-400 hover:from-green-400 hover:to-teal-300 rounded-full font-semibold transition-all cursor-pointer hover:scale-105">
                <i className="fa-solid fa-check mr-2"></i> Salva
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-400 hover:from-red-400 hover:to-red-300 rounded-full font-semibold transition-all cursor-pointer hover:scale-105">
                <i className="fa-solid fa-xmark mr-2"></i> Annulla
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default EditProfileModal;
