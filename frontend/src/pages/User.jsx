import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function User() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://127.0.0.1:8000/users/login", null, {
        params: { email, password },
      });

      // Salvo l'id utente in localStorage
      localStorage.setItem("userId", res.data.user_id);

      // Messaggio di successo
      setMessage("✅ Login effettuato con successo!");

      // Reindirizzo alla pagina Travels
      navigate("/travels");
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
      {/* Titolo sopra il form */}
      <h1 className="font-bold text-4xl mb-6 text-center text-white drop-shadow-md md:text-black md:drop-shadow-none">
        🌍 Travel App
      </h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="backdrop-blur-xl shadow-lg rounded-2xl p-8 w-11/12 sm:w-96 border">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full border rounded-lg px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-1">Password</label>
          <input
            type="password"
            className="w-full border rounded-lg px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-400 transition hover:scale-105 cursor-pointer">
          Accedi
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}
      </form>
    </div>
  </div>
);

}

export default User
