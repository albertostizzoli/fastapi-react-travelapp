import { motion, AnimatePresence } from "framer-motion"; // importo framer-motion per le animazioni
import { FaCamera, FaCheckCircle, FaCompass, FaEye, FaEyeSlash, FaUser, FaTimesCircle } from "react-icons/fa";
import LoginModal from "../components/Modals/LoginModal"; // importo il componente modale per la selezione delle esperienze
import FormAuth from "../controllers/FormAuth"; // importo la logica dei form di login/registrazione

function LoginRegisterPage() {

  const {
    isLogin,                // stato per il toggle tra login e registrazione
    setIsLogin,             // funzione per impostare lo stato di isLogin
    name,                   // stato per il nome
    setName,                // funzione per impostare il nome
    surname,                // stato per il cognome
    setSurname,             // funzione per impostare il cognome
    email,                  // stato per l'email 
    setEmail,               // funzione per impostare l'email
    password,               // stato per la password
    setPassword,            // funzione per impostare la password
    showPassword,           // stato per mostrare/nascondere la password
    setShowPassword,        // funzione per impostare lo stato di showPassword
    handleSubmit,           // funzione per gestire il submit del form di login
    handleRegister,         // funzione per gestire il submit del form di registrazione
    message,                // stato per i messaggi di feedback
    isModalOpen,            // stato per l'apertura/chiusura del modale
    setIsModalOpen,         // funzione per impostare lo stato di isModalOpen
    selectedExperiences,    // stato per le esperienze selezionate
    toggleExperience,       // funzione per selezionare/deselezionare un'esperienza
    handlePhotoSelect,      // funzione per gestire la selezione della foto
    handleFileChange,       // funzione per gestire il cambiamento del file selezionato
    fileInputRef,           // riferimento all'input file nascosto
    validation,             // validazioni
    handlePasswordChange,    // funzione per validare la password
    isFocused,               // fa sparire e ricomparire il modale della validazione password
    setIsFocused             // stato per il modale validazione password
  } = FormAuth();           // utilizzo la logica dei form di login/registrazione

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center md:justify-evenly gap-2 px-4 py-6">
      {/* Logo a sinistra */}
      <div className="flex items-center justify-center md:justify-end md:w-auto mb-6 md:mb-0 bg-transparent ">
        <img
          src="/images/logo.png"
          alt="Logo TravelDiary"
          className="w-48 sm:w-56 md:w-72 lg:w-80 object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]"
        />
      </div>

      {/* Form e toggle a destra */}
      <div className="flex flex-col items-center justify-center p-6 w-full relative sm:w-[600px] 
            md:w-[600px] lg:w-[600px] px-2 sm:px-4">
        {/* Toggle Login/Registrati */}
        <div className="relative flex mb-6 bg-linear-to-br from-white/20 via-white/10 to-transparent
            backdrop-blur-lg border border-white/40 p-1 rounded-full w-64 
            shadow-[inset_0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300 ease-in-out">
          <motion.div
            layout
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`absolute top-1 bottom-1 w-1/2 rounded-full shadow-md ${isLogin
              ? 'bg-linear-to-r from-orange-600/70 to-rose-500/60 left-1 dark:from-amber-400/60 dark:to-orange-500/50'
              : 'bg-linear-to-r from-blue-600/70 to-cyan-500/60 right-1 dark:from-blue-400/60 dark:to-indigo-500/50'
              }`}
          />
          <button
            onClick={() => setIsLogin(true)}
            className={`cursor-pointer relative z-10 flex-1 text-center py-2 rounded-full font-semibold transition 
            ${isLogin ? 'text-gray-900' : 'text-white'}`}>
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`cursor-pointer relative z-10 flex-1 text-center py-2 rounded-full font-semibold transition 
            ${!isLogin ? 'text-gray-900' : 'text-white'}`}>
            Registrati
          </button>
        </div>


        {/* Form di Login e di Registrazione */}
        <div className="w-full flex justify-center">
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.form
                key="login"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-linear-to-br from-white/20 via-white/10 to-transparent backdrop-blur-2xl border border-white/40 
                shadow-[inset_0_0_20px_rgba(255,255,255,0.1)] rounded-3xl p-8 w-[400px] md:mx-auto flex flex-col">

                <h2 className="text-2xl font-bold mb-6 text-center text-white drop-shadow">Login</h2>

                { /* Email */}
                <div className="mb-4">
                  <label className="block text-white mb-1 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">Email</label>
                  <input
                    type="email"
                    className="w-full font-semibold border bg-white/20 text-white
                    rounded-full px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-orange-400 dark:focus:ring-amber-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                { /* Password */}
                <div className="mb-6">
                  <label className="block text-white/90 mb-1 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">Password</label>
                  <div className="relative w-full">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full font-semibold border bg-white/20 text-white 
                      rounded-full px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-orange-400 dark:focus:ring-amber-400"
                    />

                    { /* Pulsante Mostra Password */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-white cursor-pointer">
                      {showPassword ? (
                        <FaEyeSlash size={20} />
                      ) : (
                        <FaEye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="font-semibold flex justify-center items-center gap-2 px-4 py-2 mt-4
                  bg-linear-to-br from-blue-600 to-cyan-500 dark:from-blue-600/70 dark:to-cyan-500/70 
                  backdrop-blur-md border border-white/40 text-white 
                  rounded-full shadow-md transition-all duration-300 hover:scale-105
                  hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] cursor-pointer">
                  <FaUser size={20} className="mr-2" />
                  Accedi
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="register"
                onSubmit={handleRegister}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="
                bg-linear-to-br from-white/20 via-white/10 to-transparent backdrop-blur-2xl border border-white/40 
                shadow-[inset_0_0_20px_rgba(255,255,255,0.1)] rounded-3xl p-8 w-[600px] md:mx-auto flex flex-col">

                <h2 className="text-2xl font-bold mb-6 text-center text-white drop-shadow">Registrati</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                  { /* Nome */}
                  <div>
                    <label className="block text-white mb-1 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">Nome</label>
                    <input
                      type="text"
                      className="w-full font-semibold border  bg-white/20 text-white 
                      rounded-full px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-400 dark:focus:ring-indigo-400"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  { /* Cognome */}
                  <div>
                    <label className="block text-white mb-1 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">Cognome</label>
                    <input
                      type="text"
                      className="w-full font-semibold border bg-white/20 text-white  
                      rounded-full px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-400 dark:focus:ring-indigo-400"
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-white mb-1 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">Email</label>
                    <input
                      type="email"
                      className="w-full font-semibold border bg-white/20 text-white
                      rounded-full px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-400 dark:focus:ring-indigo-400"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  { /* Password */}
                  <div>
                    <label className="block text-white mb-1 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                      Password
                    </label>

                    <div className="relative w-full">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={handlePasswordChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className="w-full font-semibold border bg-white/20 text-white 
                        rounded-full px-3 py-2 focus:border-transparent focus:ring-2 
                      focus:ring-blue-400 dark:focus:ring-indigo-400"
                        required
                      />

                      {/* Mostra/Nascondi Password */}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-white cursor-pointer">
                        {showPassword ? (
                          <FaEyeSlash size={20} />
                        ) : (
                          <FaEye size={20} />
                        )}
                      </button>

                      {/* Modale Feedback Password */}
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

                </div>

                {/* Pulsanti esperienze e foto */}
                <div className="mt-6 flex md:flex-nowrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="flex-1 font-semibold flex justify-center items-center gap-2 px-4 py-2
                    bg-linear-to-br from-orange-600 to-rose-500 dark:from-orange-600/70 dark:to-rose-500/70 
                    backdrop-blur-md border border-white/40 text-white 
                    rounded-full shadow-md transition-all duration-300 hover:scale-105
                    hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] cursor-pointer">
                    <FaCompass size={20} className="mr-2" />  Esperienze
                  </button>

                  <button
                    type="button"
                    onClick={handlePhotoSelect}
                    className=" flex-1 font-semibold flex justify-center items-center gap-2 px-4 py-2
                    bg-linear-to-br from-green-600 to-teal-500 dark:from-green-600/70 dark:to-teal-500/70 
                    backdrop-blur-md border border-white/40 text-white 
                    rounded-full shadow-md transition-all duration-300 hover:scale-105
                    hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] cursor-pointer">
                    <FaCamera size={20} className="mr-2" />  Foto
                  </button>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                </div>

                <button
                  type="submit"
                  className="font-semibold flex justify-center items-center gap-2 px-4 py-2 mt-4
                  bg-linear-to-br from-blue-600 to-cyan-500 dark:from-blue-600/70 dark:to-cyan-500/70
                  backdrop-blur-md border border-white/40 text-white 
                  rounded-full shadow-md transition-all duration-300 hover:scale-105
                  hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] cursor-pointer">
                  <FaUser size={20} className="mr-2" />
                  Registrati
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>


        {/* Modali */}
        <LoginModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedExperiences={selectedExperiences}
          toggleExperience={toggleExperience}
        />

        {message && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5 }}
            className="fixed top-6 right-6 flex items-center gap-3 backdrop-blur-lg 
            border border-white/40 text-white px-6 py-3 rounded-full shadow-xl z-9999
            bg-linear-to-br from-blue-600 to-orange-600 dark:from-slate-900 dark:to-slate-500">
            {message.icon === "success" && (
              <FaCheckCircle size={20} className="text-green-400 text-2xl mr-2" />
            )}
            {message.icon === "error" && (
              <FaTimesCircle size={20} className="text-red-400 text-2xl mr-2" />
            )}
            <p className="text-xl font-semibold">{message.text}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default LoginRegisterPage;
