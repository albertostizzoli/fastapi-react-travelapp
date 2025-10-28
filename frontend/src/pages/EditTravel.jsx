import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

function EditTravel() {
  const { id } = useParams(); // recupero l'ID del viaggio dall'URL
  const navigate = useNavigate(); // hook per navigare fra le pagine
  const [travel, setTravel] = useState(null); // per salvare i dati del viaggio
  const [message, setMessage] = useState(""); // stato per mostrare messaggi di conferma/errore

  // recupero i viaggi dal backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://127.0.0.1:8000/travels", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const t = res.data.find((tr) => tr.id === parseInt(id));
        setTravel(t);
      })
      .catch((err) => console.error("Errore nel caricamento del viaggio:", err));
  }, [id]);


  // gestisce il cambiamento dei campi principali ( town, city...)
  const handleChange = (e) => {
    const { name, value } = e.target; // recupera il nome e il valore del campo modificato
    setTravel({ ...travel, [name]: value }); // aggiorna lo stato del viaggio
  };

  // gestisce il cambiamento dei voti (paesaggio, relax...)
  const handleVoteChange = (e) => {
    const { name, value } = e.target; // recupera il nome e il valore del voto modificato
    setTravel({
      ...travel, // mantiene gli altri dati del viaggio
      votes: { ...travel.votes, [name]: parseFloat(value) || 0 }, // aggiorna il voto specifico
    });
  };

  // calcola la media dei voti
  const calculateGeneralVote = () => {
    if (!travel || !travel.votes) return null; // se non ci sono voti, ritorna null

    const votes = Object.values(travel.votes).filter((v) => v > 0); // filtra i voti validi (maggiore di 0)
    if (votes.length === 0) return null; // se non ci sono voti validi, ritorna null

    const avg = votes.reduce((a, b) => a + b, 0) / votes.length; // calcola la media
    return avg.toFixed(1); // media con 1 decimale
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const updatedTravel = {
        ...travel,
        general_vote: calculateGeneralVote()
          ? parseFloat(calculateGeneralVote())
          : null,
      };

      await axios.put(`http://127.0.0.1:8000/travels/${id}`, updatedTravel, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("✅ Viaggio aggiornato!");

      setTimeout(() => {
        setMessage("");
        navigate("/travels");
      }, 2000);
    } catch (err) {
      console.error("Errore durante l'aggiornamento del viaggio:", err);
      setMessage("❌ Errore durante l'aggiornamento del viaggio.");
    }
  };


  if (!travel) return <p className="text-center">Caricamento...</p>;


  return (
    <motion.div
      className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-start bg-transparent sm:p-8 p-4 gap-y-6"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 1.2 }}>

      {/* Glow morbido dietro al form */}
      <div className="absolute -z-10 w-[90%] h-[90%] rounded-3xl bg-gradient-to-br from-blue-900/30 via-blue-800/10 to-orange-900/20
       blur-3xl" />

      <form
        onSubmit={handleSubmit}
        className="relative backdrop-blur-xl bg-gradient-to-br from-white/20 via-white/10 to-transparent rounded-3xl 
        p-6 w-full max-w-4xl border border-white/40 shadow-[inset_0_0_20px_rgba(255,255,255,0.1)] 
        grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Sfere animate */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute w-[28rem] h-[28rem] bg-gradient-to-br from-blue-500/20 to-orange-400/10 rounded-full 
          blur-3xl top-10 left-10 animate-[pulse_6s_ease-in-out_infinite]" />
          <div className="absolute w-[32rem] h-[32rem] bg-gradient-to-br from-orange-500/20 to-blue-400/10 rounded-full 
          blur-3xl bottom-10 right-10 animate-[pulse_6s_ease-in-out_infinite]" />
        </div>

        {/* Titolo + nota obbligatorio */}
        <div className="flex items-center justify-between md:col-span-2 mb-2">
          <h2 className="text-2xl font-extrabold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">Modifica Viaggio</h2>
          <p className="text-sm italic text-white/90">* Il campo è obbligatorio</p>
        </div>

        {/* Paese */}
        <div>
          <label className="block font-bold text-white mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">Paese *</label>
          <input
            id="town"
            type="text"
            name="town"
            value={travel.town}
            onChange={handleChange}
            placeholder="Paese"
            className="w-full p-2 font-semibold border border-white/40 rounded-full bg-white/10 text-white 
            placeholder-white/70 focus:ring-2 focus:ring-orange-300 focus:border-transparent transition"
          />
        </div>

        {/* Città */}
        <div>
          <label className="block font-bold text-white mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">Città *</label>
          <input
            id="city"
            type="text"
            name="city"
            value={travel.city}
            onChange={handleChange}
            placeholder="Città"
            className="w-full p-2 font-semibold border border-white/40 rounded-full bg-white/10 text-white 
            placeholder-white/70 focus:ring-2 focus:ring-orange-300 focus:border-transparent transition"
          />
        </div>

        {/* Anno */}
        <div>
          <label className="block font-bold text-white mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">Anno *</label>
          <input
            type="number"
            name="year"
            value={travel.year}
            onChange={handleChange}
            placeholder="Anno"
            className="w-full p-2 font-semibold border border-white/40 rounded-full bg-white/10 text-white 
            placeholder-white/70 focus:ring-2 focus:ring-orange-300 focus:border-transparent transition"
          />
        </div>

        {/* Data Inizio */}
        <div>
          <label className="block font-bold text-white mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">Data Inizio *</label>
          <input
            type="text"
            name="start_date"
            value={travel.start_date}
            onChange={handleChange}
            placeholder="Data inizio"
            className="w-full p-2 font-semibold border border-white/40 rounded-full bg-white/10 text-white 
            placeholder-white/70 focus:ring-2 focus:ring-orange-300 focus:border-transparent transition"
          />
        </div>

        {/* Data Fine */}
        <div>
          <label className="block font-bold text-white mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">Data Fine *</label>
          <input
            type="text"
            name="end_date"
            value={travel.end_date}
            onChange={handleChange}
            placeholder="Data fine"
            className="w-full p-2 font-semibold border border-white/40 rounded-full bg-white/10 text-white 
            placeholder-white/70 focus:ring-2 focus:ring-orange-300 focus:border-transparent transition"
          />
        </div>

        {/* Divider */}
        <div className="md:col-span-2 border-t border-white/40 my-2"></div>

        {/* Voti */}
        <div className="md:col-span-2">
          <h3 className="font-bold mb-3 text-white text-center text-xl drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">Voti *</h3>
          <div className="flex flex-wrap justify-center gap-6">
            {Object.entries(travel.votes).map(([key, value]) => (
              <div key={key} className="flex flex-col items-center">
                <label className="capitalize mb-1 font-bold text-white text-center">{key}</label>
                <input
                  type="number"
                  name={key}
                  value={value}
                  onChange={handleVoteChange}
                  min="1"
                  max="5"
                  className="w-20 p-2 font-semibold border border-white/40 rounded-full bg-white/10 text-white 
                  text-center focus:ring-2 focus:ring-orange-300 focus:border-transparent transition"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Media Voti */}
        <div className="md:col-span-2 mt-4 flex justify-center">
          <div className="flex flex-col items-center">
            <label className="font-bold text-white mb-1 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">Media Voti</label>
            <input
              type="text"
              value={calculateGeneralVote() ?? "-"}
              readOnly
              className="w-20 p-2 font-semibold border border-white/40 rounded-full bg-white/10 text-white text-center"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="md:col-span-2 border-t border-white/40 my-2"></div>

        {/* Pulsanti */}
        <div className="md:col-span-2 flex justify-between gap-2 mt-4">
          <Link
            to="/travels"
            className="font-semibold px-6 py-2 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600/70 to-rose-500/70 
            backdrop-blur-md border border-white/40 text-white rounded-full cursor-pointer transition-all duration-100 ease-in-out
            hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]">
            <i className="fa-solid fa-arrow-left"></i>
            Torna ai Viaggi
          </Link>
          <button
            type="submit"
            className="font-semibold px-6 py-2 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600/70 to-teal-500/60 
            backdrop-blur-md border border-white/40 text-white rounded-full cursor-pointer transition-all duration-100 ease-in-out 
            hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]">
            <i className="fa-solid fa-edit"></i>
            Salva Modifiche
          </button>
        </div>
      </form>

      {/* Modale di conferma */}
      {message && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.5 }}
          className="fixed top-6 right-6 backdrop-blur-xl border border-white/40 text-white px-6 py-3 
          rounded-full shadow-lg z-[9999] bg-gradient-to-r from-blue-500/60 to-orange-500/60">
          <p className="text-lg font-semibold">{message}</p>
        </motion.div>
      )}
    </motion.div>
  );


}

export default EditTravel;
