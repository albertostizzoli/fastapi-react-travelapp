import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import interests from "../store/interests";
import { motion, AnimatePresence } from "framer-motion";

function User() {
  const [isLogin, setIsLogin] = useState(true); //  stato per il toggle login/registrazione
  const [name, setName] = useState(""); // stato per il nome
  const [surname, setSurname] = useState(""); // stato per il cognome
  const [email, setEmail] = useState(""); // stato per l'email
  const [password, setPassword] = useState(""); // stato per la password 
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
      const res = await axios.post("http://127.0.0.1:8000/users/login", null, { // invio i dati come parametri
        params: { email, password }, // uso params per inviare i dati come query string
      });

      localStorage.setItem("userId", res.data.user_id); // salvo l'id utente nel localStorage
      setMessage("✅ Login effettuato con successo!");
      navigate("/profile");
    } catch (err) {
      if (err.response) {
        setMessage(`❌ Errore: ${err.response.data.detail}`);
      } else {
        setMessage("❌ Errore di connessione al server");
      }
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

      setMessage("✅ Registrazione avvenuta con successo! Ora effettua il login.");
      setIsLogin(true);
    } catch (err) {
      if (err.response) {
        setMessage(`❌ Errore: ${err.response.data.detail}`);
      } else {
        setMessage("❌ Errore di connessione al server");
      }
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
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
              className="backdrop-blur-xl shadow-lg rounded-2xl p-8 w-11/12 sm:w-96 border sm:border-black">
              <h2 className="text-2xl font-bold mb-6 text-center text-white sm:text-black">Login</h2>

              <div className="mb-4">
                <label className="block sm:text-black mb-1 text-white">Email</label>
                <input
                  type="email"
                  className="w-full border rounded-lg px-3 py-2 sm:text-gray-700 text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block sm:text-black mb-1 text-white">Password</label>
                <input
                  type="password"
                  className="w-full border rounded-lg px-3 py-2 sm:text-gray-700 text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="px-2 py-2 flex justify-center items-center gap-1 w-full bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition hover:scale-105 cursor-pointer">
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
              className="backdrop-blur-xl shadow-lg rounded-2xl p-8 w-11/12 sm:w-[600px] border sm:border-black">
              <h2 className="text-2xl font-bold mb-6 text-center text-white sm:text-black">
                Registrati
              </h2>

              {/* Campi in 2 colonne */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block sm:text-black mb-1 text-white">Nome</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-3 py-2 sm:text-gray-700 text-white"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block sm:text-black mb-1 text-white">Cognome</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-3 py-2 sm:text-gray-700 text-white"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block sm:text-black mb-1 text-white">Email</label>
                  <input
                    type="email"
                    className="w-full border rounded-lg px-3 py-2 sm:text-gray-700 text-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block sm:text-black mb-1 text-white">Password</label>
                  <input
                    type="password"
                    className="w-full border rounded-lg px-3 py-2 sm:text-gray-700 text-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Interessi e Foto Profilo  */}
              <div className="mt-6 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="w-full px-4 py-2 flex items-center justify-center bg-orange-500 hover:bg-orange-400 text-white rounded-lg shadow-md transition hover:scale-105 cursor-pointer">
                  <i className="fa-solid fa-globe mr-2"></i> Scegli i tuoi interessi
                </button>

                {/*  Bottone per caricare la foto */}
                <button
                  type="button"
                  onClick={handlePhotoSelect}
                  className="w-full px-4 py-2 flex items-center justify-center bg-green-500 hover:bg-green-400 text-white rounded-lg shadow-md transition hover:scale-105 cursor-pointer">
                  <i className="fa-solid fa-camera mr-2"></i> Carica foto
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
                className="mt-4 px-2 py-2 flex justify-center items-center gap-1 w-full bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition hover:scale-105 cursor-pointer">
                <i className="fa-solid fa-user mr-2"></i>
                Registrati
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        { /* Modale Interessi */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999] p-4">
            <div className="bg-blue-600 rounded-xl w-full max-w-3xl max-h-[90vh] shadow-lg flex flex-col overflow-hidden">
              {/* Contenuto scrollabile */}
              <div className="flex-1 p-6 overflow-y-auto scrollbar-custom">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Seleziona i tuoi interessi
                </h2>

                {interests.map((category) => ( // ciclo sulle categorie di interessi
                  <div key={category.category} className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-2">
                      {category.category}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {category.tags.map((tag) => ( // ciclo sui tag di ogni categoria
                        <button
                          type="button"
                          key={tag}
                          onClick={() => toggleInterest(tag)} // seleziono/deseleziono l'interesse
                          className={`px-3 py-2 rounded-lg border transition cursor-pointer ${selectedInterests.includes(tag)
                            ? "bg-yellow-300 text-black border-yellow-600"
                            : "bg-orange-400 text-black border-orange-400 hover:bg-orange-300"
                            }`}>
                          {tag}
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
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-400 transition hover:scale-105 cursor-pointer">
                  <i className="fa-solid fa-check mr-2"></i> Salva Preferenze
                </button>
                <button
                  onClick={() => setIsModalOpen(false)} // chiudo il modale
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-400 transition hover:scale-105 cursor-pointer">
                  <i className="fa-solid fa-xmark mr-2"></i> Annulla
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Messaggi */}
        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}
      </div>
    </div >
  );
}

export default User;
