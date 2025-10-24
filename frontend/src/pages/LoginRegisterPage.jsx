import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import LoginModal from "../components/modals/LoginModal";

function LoginRegisterPage() {
  const [isLogin, setIsLogin] = useState(true); //  stato per il toggle login/registrazione
  const [name, setName] = useState(""); // stato per il nome
  const [surname, setSurname] = useState(""); // stato per il cognome
  const [email, setEmail] = useState(""); // stato per l'email
  const [password, setPassword] = useState(""); // stato per la password
  const [showPassword, setShowPassword] = useState(false); // stato per nascondere / mostrare la password
  const [selectedInterests, setSelectedInterests] = useState([]); // stato per gli interessi selezionati
  const [isModalOpen, setIsModalOpen] = useState(false); // stato per il modale interessi
  const [photo, setPhoto] = useState(null); // stato per la foto profilo
  const fileInputRef = useRef(null); // riferimento all’input nascosto
  const [message, setMessage] = useState(""); // stato per i messaggi di errore/successo
  const navigate = useNavigate(); // hook per la navigazione

  // Funzione per selezionare/deselezionare un interesse
  const toggleInterest = (tag) => {
    if (selectedInterests.includes(tag)) { // se l'interesse è già selezionato lo rimuovo
      setSelectedInterests(selectedInterests.filter((t) => t !== tag)); // filtro l'array rimuovendo il tag
    } else {
      setSelectedInterests([...selectedInterests, tag]); // altrimenti lo aggiungo
    }
  };

  // Funzione per gestire la selezione della foto
  const handlePhotoSelect = () => {
    fileInputRef.current.click(); // simula il click sull’input file nascosto
  };

  // Funzione per gestire il cambiamento del file selezionato
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setMessage(` Foto selezionata: ${file.name}`);
    }
  };

  //  LOGIN
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/users/login",
        null,
        { params: { email, password } }
      );

      const token = res.data.access_token;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", res.data.user_id);

      // Mostra messaggio di successo
      setMessage("✅ Bentornato!");

      // Dopo 2 secondi naviga alla pagina profilo
      setTimeout(() => {
        setMessage(""); // scompare il modale
        navigate("/profile");
      }, 2000);

    } catch (err) {
      if (err.response) {
        setMessage(`❌ Errore: ${err.response.data.detail}`);
      } else {
        setMessage("❌ Errore di connessione al server");
      }
      // facciamo sparire il messaggio di errore dopo 3 secondi
      setTimeout(() => setMessage(""), 3000);
    }
  };


  //  REGISTRAZIONE
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("surname", surname);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("interests", JSON.stringify(selectedInterests));
      if (photo) formData.append("photo", photo);

      await axios.post("http://127.0.0.1:8000/users/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ Benvenuto!");

      // Login automatico subito dopo la registrazione
      const res = await axios.post(
        "http://127.0.0.1:8000/users/login",
        null,
        { params: { email, password } }
      );

      const token = res.data.access_token;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", res.data.user_id);


      // Dopo 2 secondi resetto il messaggio e passo al profilo
      setTimeout(() => {
        setMessage("");
        navigate("/profile");
      }, 2000);

    } catch (err) {
      if (err.response) {
        setMessage(`❌ Errore: ${err.response.data.detail}`);
      } else {
        setMessage("❌ Errore di connessione al server");
      }
      setTimeout(() => setMessage(""), 3000);
    }
  };


  return (
    <div className="h-screen flex flex-col md:flex-row">
      {/* Sezione immagine - visibile solo su desktop */}
      <div className="hidden md:block w-1/2 h-full">
        <img
          src="/images/amalfi.jpg"
          alt="Login visual"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Sezione form */}
      <div
        className="
        flex-1 flex flex-col items-center justify-center
        bg-[url('/images/amalfi.jpg')] bg-cover bg-center
        md:bg-gradient-to-b md:from-blue-400 md:via-white md:to-orange-400">

        {/* Contenitore logo */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="/images/logo.png"
            alt="Logo TravelDiary"
            className="w-40 h-40 object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]"
          />
        </div>

        {/* Toggle Login/Registrati */}
        <div className="relative flex mb-6 bg-white/20 backdrop-blur-lg border border-white/30 p-1 rounded-full w-64 shadow-md">
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`absolute top-1 bottom-1 w-1/2 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 shadow-md ${isLogin ? "left-1" : "right-1"}`}
          />

          <button
            onClick={() => setIsLogin(true)}
            className={`cursor-pointer relative z-10 flex-1 text-center py-2 rounded-full font-semibold transition ${isLogin ? "text-gray-900" : "text-white"}`}>
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`cursor-pointer relative z-10 flex-1 text-center py-2 rounded-full font-semibold transition ${!isLogin ? "text-gray-900" : "text-white"}`}>
            Registrati
          </button>
        </div>

        {/* Form di Login e di Registrazione */}
        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.form
              key="login"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="
              bg-white/10 backdrop-blur-2xl border border-white/30 shadow-2xl
              rounded-3xl p-8 w-11/12 sm:w-[500px] md:w-[450px] lg:w-[400px]
              md:mx-auto flex flex-col">

              <h2 className="text-2xl font-bold mb-6 text-center text-white sm:text-gray-900 drop-shadow">Login</h2>

              <div className="mb-4">
                <label className="block text-white/90 sm:text-gray-900 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full font-semibold border sm:border-gray-900 bg-white/20 text-white sm:text-gray-900 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-white/90 sm:text-gray-900 mb-1">Password</label>
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full font-semibold border sm:border-gray-900 bg-white/20 text-white sm:text-gray-900 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-white/80 sm:text-gray-900 cursor-pointer">
                    {showPassword ? (
                      <i className="fa-solid fa-eye-slash"></i>
                    ) : (
                      <i className="fa-solid fa-eye"></i>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="font-semibold px-2 py-2 flex justify-center items-center gap-1 w-full bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-400 hover:to-blue-300 text-white rounded-full shadow-lg hover:scale-105 transition cursor-pointer">
                <i className="fa-solid fa-user mr-2"></i>
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
              bg-white/10 backdrop-blur-2xl border border-white/30 shadow-2xl
              rounded-3xl p-8 w-11/12 sm:w-[500px] md:w-[450px] lg:w-[550px]
              md:mx-auto flex flex-col">

              <h2 className="text-2xl font-bold mb-6 text-center text-white sm:text-gray-900 drop-shadow">Registrati</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/90 sm:text-gray-900 mb-1">Nome</label>
                  <input
                    type="text"
                    className="w-full font-semibold border sm:border-gray-900 bg-white/20 text-white sm:text-gray-900 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/50"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/90 sm:text-gray-900 mb-1">Cognome</label>
                  <input
                    type="text"
                    className="w-full font-semibold border sm:border-gray-900 bg-white/20 text-white sm:text-gray-900 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/50"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/90 sm:text-gray-900 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full font-semibold border sm:border-gray-900 bg-white/20 text-white sm:text-gray-900 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/50"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/90 sm:text-gray-900 mb-1">Password</label>
                  <div className="relative w-full">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full font-semibold border sm:border-gray-900 bg-white/20 text-white sm:text-gray-900 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/50"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-white/80 sm:text-gray-900 cursor-pointer">
                      {showPassword ? (
                        <i className="fa-solid fa-eye-slash"></i>
                      ) : (
                        <i className="fa-solid fa-eye"></i>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Pulsanti esperienze e foto */}
              <div className="mt-6 flex md:flex-nowrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="flex-1 font-semibold px-4 py-2 flex items-center justify-center bg-gradient-to-r from-orange-500 to-pink-400 hover:from-orange-400 hover:to-pink-300 text-white rounded-full shadow-lg hover:scale-105 transition cursor-pointer">
                  <i className="fa-solid fa-plane mr-2"></i> Esperienze
                </button>

                <button
                  type="button"
                  onClick={handlePhotoSelect}
                  className="flex-1 font-semibold px-4 py-2 flex items-center justify-center bg-gradient-to-r from-green-500 to-teal-400 hover:from-green-400 hover:to-teal-300 text-white rounded-full shadow-lg hover:scale-105 transition cursor-pointer">
                  <i className="fa-solid fa-camera mr-2"></i> Foto
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
                className="font-semibold mt-4 px-2 py-2 flex justify-center items-center gap-1 w-full bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-400 hover:to-blue-300 text-white rounded-full shadow-lg hover:scale-105 transition cursor-pointer">
                <i className="fa-solid fa-user mr-2"></i>
                Registrati
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Modali */}
        <LoginModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedInterests={selectedInterests}
          toggleInterest={toggleInterest}
        />

        {message && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5 }}
            className="fixed top-6 right-6 bg-white/10 backdrop-blur-lg border border-white/40 text-white px-6 py-3 rounded-full shadow-xl z-[9999]">
            <p className="text-lg font-semibold">{message}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default LoginRegisterPage;
