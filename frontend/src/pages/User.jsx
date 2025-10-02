import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function User() {
  const [isLogin, setIsLogin] = useState(true); //  toggle login/registrazione

  // Campi login/registrazione
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

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
    </div>
  );
}

export default User;
