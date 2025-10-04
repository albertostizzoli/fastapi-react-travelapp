import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import interests from "../store/interests";

function User() {
  const [isLogin, setIsLogin] = useState(true); //  toggle login/registrazione

  // Campi login/registrazione
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const toggleInterest = (tag) => {
    if (selectedInterests.includes(tag)) {
      setSelectedInterests(selectedInterests.filter((t) => t !== tag));
    } else {
      setSelectedInterests([...selectedInterests, tag]);
    }
  };


  //  LOGIN
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/users/login", null, {
        params: { email, password },
      });

      localStorage.setItem("userId", res.data.user_id);
      setMessage("✅ Login effettuato con successo!");
      navigate("/travels");
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
      await axios.post("http://127.0.0.1:8000/users/", {
        name,
        surname,
        email,
        password,
        interests: selectedInterests,
      });

      setMessage("✅ Registrazione avvenuta con successo! Ora effettua il login.");
      setIsLogin(true); // dopo la registrazione torno al login
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
        <div className="flex mb-6 bg-blue-400 rounded-full p-1 w-64">
          <button onClick={() => setIsLogin(true)}
            className={`cursor-pointer flex-1 text-center py-2 rounded-full font-semibold transition ${isLogin ? "bg-orange-400 text-gray-800" : "text-white"}`}>
            Login
          </button>
          <button onClick={() => setIsLogin(false)}
            className={`cursor-pointer flex-1 text-center py-2 rounded-full font-semibold transition ${!isLogin ? "bg-orange-400 text-gray-800" : "text-white"}`}>
            Registrati
          </button>
        </div>

        {/*  FORM LOGIN */}
        {isLogin ? (
          <form
            onSubmit={handleSubmit}
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
          </form>
        ) : (

          /*  FORM REGISTRAZIONE */
          <form
            onSubmit={handleRegister}
            className="backdrop-blur-xl shadow-lg rounded-2xl p-8 w-11/12 sm:w-96 border sm:border-black">
            <h2 className="text-2xl font-bold mb-6 text-center text-white sm:text-black">Registrati</h2>

            <div className="mb-4">
              <label className="block sm:text-black mb-1 text-white">Nome</label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 sm:text-gray-700 text-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block sm:text-black mb-1 text-white">Cognome</label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 sm:text-gray-700 text-white"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                required
              />
            </div>

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

            <div className="mb-6">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 flex items-center justify-center bg-blue-500 hover:bg-blue-400 text-white rounded-lg shadow-md transition hover:scale-105 cursor-pointer">
                <i className="fa-solid fa-globe mr-2"></i> Scegli i tuoi interessi
              </button>
            </div>

            { /* Modale Interessi */}
            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-2 sm:p-4 z-[9999]">
                <div className="bg-gray-800 rounded-xl w-full max-w-5xl h-[90vh] shadow-lg flex flex-col overflow-hidden">
                  <div className="flex-1 p-6 overflow-y-auto">
                    <h2 className="text-2xl font-semibold text-white mb-4">
                      Seleziona i tuoi interessi
                    </h2>

                    {interests.map((category) => (
                      <div key={category.category} className="mb-6">
                        <h3 className="text-lg font-bold text-blue-400 mb-2">
                          {category.category}
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                          {category.tags.map((tag) => (
                            <button
                            type="button"
                              key={tag}
                              onClick={() => toggleInterest(tag)}
                              className={`px-3 py-2 rounded-lg border transition cursor-pointer ${selectedInterests.includes(tag)
                                ? "bg-green-500 text-white border-green-400"
                                : "bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600"
                                }`}
                            >
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
                      onClick={() => {
                        // TODO: chiamata API al server per salvare in users.interests
                        console.log("Interessi scelti:", selectedInterests);
                        setIsModalOpen(false);
                      }}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-400 transition">
                      <i className="fa-solid fa-check mr-2"></i> Salva Preferenze
                    </button>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-400 transition">
                      <i className="fa-solid fa-xmark mr-2"></i> Annulla
                    </button>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="px-2 py-2 flex justify-center items-center gap-1 w-full bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition hover:scale-105 cursor-pointer">
              <i className="fa-solid fa-user mr-2"></i>
              Registrati
            </button>
          </form>
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
