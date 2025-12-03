import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import travellers from "../../store/travellers";
import ExperienceSelect from "../Selects/ExperiencesSelect";

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
  const allExperiences = travellers.flatMap((t) => t.experiences); // prendo le esperienze dal file travellers.js

  const [password, setPassword] = useState(""); // stato per la password
  const [isFocused, setIsFocused] = useState(false); // stato per mostare modale per validazione password
  // stato per la validazione della password
  const [validation, setValidation] = useState({
    isValid: false,
    errors: { length: false, upper: false, lower: false, number: false, special: false },
  });


  // aggiorna lo stato del form di modifica
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Funzione per la validazione della password
  const validatePassword = (password) => {
    const minLength = 8;

    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSpecial = false;
    const specialChars = "!@#$%^&*(),.?\":{}|<>";

    for (const char of password) {
      if (char >= "A" && char <= "Z") hasUpper = true;
      else if (char >= "a" && char <= "z") hasLower = true;
      else if (char >= "0" && char <= "9") hasNumber = true;
      else if (specialChars.includes(char)) hasSpecial = true;
    }

    const isValid =
      password.length >= minLength &&
      hasUpper &&
      hasLower &&
      hasNumber &&
      hasSpecial;

    return {
      isValid,
      errors: {
        length: password.length >= minLength,
        upper: hasUpper,
        lower: hasLower,
        number: hasNumber,
        special: hasSpecial,
      },
    };
  }

  const handlePasswordChange = (e) => {
    const value = e.target.value;

    // aggiorna la password locale
    setPassword(value);

    // aggiorna la validazione
    setValidation(validatePassword(value));

    // aggiorna anche il form principale
    setEditForm((prev) => ({
      ...prev,
      password: value,
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
            className="relative border border-white/40 dark:border-white/10 bg-linear-to-br from-blue-500/40 to-orange-500/30 dark:from-slate-900 dark:to-slate-500
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
                  value={password}
                  onChange={handlePasswordChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Nuova Password"
                  className="w-full px-4 py-2 font-semibold rounded-full bg-white/10 border border-white/40 placeholder-white/70 
                  focus:ring-2 focus:ring-orange-400 dark:focus:ring-blue-400 focus:border-transparent transition text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-white hover:text-white cursor-pointer">
                  {showPassword ? (
                    <FaEyeSlash size={20} />
                  ) : (
                    <FaEye size={20} />
                  )}
                </button>

                { /* Modale Feedback Password */}
                {password && isFocused && (
                  <div className="absolute left-0 right-0 mt-2 bg-gray-200 dark:bg-black/90 border border-white/20 
                     rounded-xl p-3 z-50 shadow-lg">
                    <p className={`${validation.errors.length ? "text-green-500" : "text-red-500"} text-sm`}>
                      {validation.errors.length ? "✓" : "✗"} Almeno 8 caratteri
                    </p>
                    <p className={`${validation.errors.upper ? "text-green-500" : "text-red-500"} text-sm`}>
                      {validation.errors.upper ? "✓" : "✗"} Una lettera maiuscola
                    </p>
                    <p className={`${validation.errors.lower ? "text-green-500" : "text-red-500"} text-sm`}>
                      {validation.errors.lower ? "✓" : "✗"} Una lettera minuscola
                    </p>
                    <p className={`${validation.errors.number ? "text-green-500" : "text-red-500"} text-sm`}>
                      {validation.errors.number ? "✓" : "✗"} Un numero
                    </p>
                    <p className={`${validation.errors.special ? "text-green-500" : "text-red-500"} text-sm`}>
                      {validation.errors.special ? "✓" : "✗"} Un carattere speciale {"!@#$%^&*(),.?\":{}|<>"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Colonna destra */}
            <div className="space-y-4">
              <ExperienceSelect
                allExperiences={allExperiences}
                selectedExperiences={editForm.experiences}
                setEditForm={setEditForm}
              />

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
                className="font-semibold flex items-center justify-center gap-2 px-6 py-2 bg-linear-to-br 
                from-red-600 to-rose-500 dark:from-red-600/70 dark:to-rose-500/70 
                backdrop-blur-md border border-white/40 text-white 
                rounded-full shadow-md transition-all duration-300 ease-in-out cursor-pointer hover:scale-105 
                hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]">
                <FaTimes size={20} className="mr-2" /> Annulla
              </button>
              <button
                type="submit"
                className="font-semibold flex items-center justify-center gap-2 px-6 py-2 bg-linear-to-br 
                from-green-600 to-teal-500 dark:from-green-600/70 dark:to-teal-500/70 
                backdrop-blur-md border border-white/40 text-white 
                rounded-full shadow-md transition-all duration-300 ease-in-out cursor-pointer hover:scale-105 
                hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]">
                <FaCheck size={20} className="mr-2" /> Salva
              </button>
            </div>
          </motion.form>
        </motion.div>
      )
      }
    </AnimatePresence >
  );
}

export default EditProfileModal;
