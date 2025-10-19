import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import travellers from "../store/travellers";
import { motion, AnimatePresence } from "framer-motion";

function User() {
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
      setMessage("✅ Login effettuato!");

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

      setMessage("✅ Registrazione avvenuta!");

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
        {/* Titolo */}
        <h1 className="font-bold text-4xl mb-6 text-center text-white drop-shadow-md md:text-black md:drop-shadow-none">
          🌍 Travel App
        </h1>

        {/*  Toggle Login/Registrati */}
        <div className="relative flex mb-6 bg-blue-400 p-1 rounded-full w-64">
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`absolute top-1 bottom-1 w-1/2 rounded-full bg-orange-400 ${isLogin ? "left-1" : "right-1"}`}
          />

          <button
            onClick={() => setIsLogin(true)}
            className={`cursor-pointer relative z-10 flex-1 text-center py-2 rounded-full font-semibold transition ${isLogin ? "text-gray-800" : "text-white"}`}>
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`cursor-pointer relative z-10 flex-1 text-center py-2 rounded-full font-semibold transition ${!isLogin ? "text-gray-800" : "text-white"}`}>
            Registrati
          </button>
        </div>


        {/*  FORM LOGIN */}
        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.form
              key="login"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="backdrop-blur-xl shadow-lg rounded-3xl p-8 w-11/12 sm:w-[600px] md:w-3/4 md:mx-auto lg:w-[600px] border sm:border-black md:flex md:flex-col">
              <h2 className="text-2xl font-bold mb-6 text-center text-white sm:text-black">Login</h2>

              <div className="mb-4">
                <label className="block sm:text-black mb-1 text-white">Email</label>
                <input
                  type="email"
                  className="w-full font-semibold border rounded-full px-3 py-2 sm:text-gray-700 text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block sm:text-black mb-1 text-white">Password</label>
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full font-semibold border rounded-full px-3 py-2 sm:text-gray-700 text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 sm:text-gray-700 text-white cursor-pointer">
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
                className=" font-semibold px-2 py-2 flex justify-center items-center gap-1 w-full bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-400 transition hover:scale-105 cursor-pointer">
                <i className="fa-solid fa-user mr-2"></i>
                Accedi
              </button>
            </motion.form>
          ) : (

            /*  FORM REGISTRAZIONE */
            <motion.form
              key="register"
              onSubmit={handleRegister}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="backdrop-blur-xl shadow-lg rounded-3xl p-8 w-11/12 sm:w-[600px] md:w-3/4 md:mx-auto lg:w-[600px] border sm:border-black md:flex md:flex-col">
              <h2 className="text-2xl font-bold mb-6 text-center text-white sm:text-black">
                Registrati
              </h2>

              {/* Campi in 2 colonne */}
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block sm:text-black mb-1 text-white">Nome</label>
                  <input
                    type="text"
                    className="w-full font-semibold border rounded-full px-3 py-2 sm:text-gray-700 text-white"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block sm:text-black mb-1 text-white">Cognome</label>
                  <input
                    type="text"
                    className="w-full font-semibold border rounded-full px-3 py-2 sm:text-gray-700 text-white"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block sm:text-black mb-1 text-white">Email</label>
                  <input
                    type="email"
                    className="w-full font-semibold border rounded-full px-3 py-2 sm:text-gray-700 text-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block sm:text-black mb-1 text-white">Password</label>
                  <div className="relative w-full">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full font-semibold border rounded-full px-3 py-2 sm:text-gray-700 text-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 sm:text-gray-700 text-white cursor-pointer">
                      {showPassword ? (
                        <i className="fa-solid fa-eye-slash"></i>
                      ) : (
                        <i className="fa-solid fa-eye"></i>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Interessi e Foto Profilo  */}
              <div className="mt-6 flex md:flex-nowrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="flex-1 font-semibold px-4 py-2 flex items-center justify-center bg-orange-500 hover:bg-orange-400 text-white rounded-full shadow-md transition hover:scale-105 cursor-pointer">
                  <i className="fa-solid fa-plane mr-2"></i> Esperienze
                </button>

                <button
                  type="button"
                  onClick={handlePhotoSelect}
                  className="flex-1 font-semibold px-4 py-2 flex items-center justify-center bg-green-500 hover:bg-green-400 text-white rounded-full shadow-md transition hover:scale-105 cursor-pointer">
                  <i className="fa-solid fa-camera mr-2"></i> Foto
                </button>

                {/* Input file nascosto */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: "none" }}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="font-semibold mt-4 px-2 py-2 flex justify-center items-center gap-1 w-full bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-400 transition hover:scale-105 cursor-pointer">
                <i className="fa-solid fa-user mr-2"></i>
                Registrati
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        { /* Modale Viaggiatori */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999] p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}>
              <motion.div className="bg-gray-800 rounded-3xl w-full max-w-3xl max-h-[90vh] shadow-lg flex flex-col overflow-hidden"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}>
                {/* Contenuto scrollabile */}
                <div className="flex-1 p-6 overflow-y-auto scrollbar-custom">
                  <h2 className="text-2xl font-semibold text-white mb-4">
                    Dicci le tue esperienze
                  </h2>

                  {travellers.map((category) => ( // ciclo sulle categorie dei viaggiatori
                    <div key={category.category} className="mb-6">
                      <h3 className="text-lg font-bold text-white mb-1">
                        {category.category}
                      </h3>
                      {/* Descrizione della categoria */}
                      {category.description && (
                        <p className="text-sm text-white mb-3 italic">
                          {category.description}
                        </p>
                      )}

                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {category.experiences.map((experience) => ( // ciclo sui tag di ogni categoria
                          <button
                            type="button"
                            key={experience}
                            onClick={() => toggleInterest(experience)} // seleziono/deseleziono il tag
                            className={`font-semibold flex items-center justify-center text-center gap-2 px-3 py-2 border rounded-full cursor-pointer text-sm transition-all hover:scale-105 ${selectedInterests.includes(experience)
                              ? "bg-orange-400 text-black"
                              : "bg-blue-500 text-white hover:bg-blue-400"
                              }`}>
                            {experience}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Azioni */}
                <div className="p-4 flex justify-end gap-3 border-t border-gray-700">
                  <button
                    onClick={() => setIsModalOpen(false)} // chiudo il modale salvando le preferenze
                    className="font-semibold px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-400 transition hover:scale-105 cursor-pointer">
                    <i className="fa-solid fa-check mr-2"></i> Salva Esperienze
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)} // chiudo il modale
                    className="font-semibold px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-400 transition hover:scale-105 cursor-pointer">
                    <i className="fa-solid fa-xmark mr-2"></i> Annulla
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Modale di conferma */}
        {message && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5 }}
            className="fixed top-6 right-6 backdrop-blur-xl border border-white
                       text-white px-6 py-3 rounded-full shadow-lg z-[9999]">
            <p className="text-lg font-semibold">{message}</p>
          </motion.div>
        )}
      </div>
    </div >
  );
}

export default User;
