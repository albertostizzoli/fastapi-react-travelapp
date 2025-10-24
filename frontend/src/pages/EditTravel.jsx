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
      className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-start bg-transparent sm:p-8 p-4 gap-y-6"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 1.5 }}>
      {/* Container del form */}
      <div className="w-full max-w-4xl h-auto bg-white/15 backdrop-blur-xl shadow-lg rounded-3xl p-6 space-y-4 border border-white/20">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
          <div className="absolute w-[28rem] h-[28rem] bg-orange-400/10 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>
        </div>

        {/* Titolo + nota obbligatorio */}
        <div className="flex items-center justify-between md:col-span-2 mb-4">
          <h2 className="text-white text-2xl font-bold">✏️ Modifica Viaggio</h2>
          <p className="text-white text-sm italic">* Il campo è obbligatorio</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Paese */}
          <div className="flex flex-col">
            <label className="mb-1 text-white font-bold">Paese *</label>
            <input
              id="town"
              type="text"
              name="town"
              value={travel.town}
              onChange={handleChange}
              placeholder="Paese"
              className="p-2 font-semibold border border-white rounded-full text-white"
            />
          </div>

          {/* Città */}
          <div className="flex flex-col">
            <label className="mb-1 text-white font-bold">Città *</label>
            <input
              id="city"
              type="text"
              name="city"
              value={travel.city}
              onChange={handleChange}
              placeholder="Città"
              className="p-2 font-semibold border border-white rounded-full text-white"
            />
          </div>

          {/* Anno */}
          <div className="flex flex-col">
            <label className="mb-1 text-white font-bold">Anno *</label>
            <input
              type="number"
              name="year"
              value={travel.year}
              onChange={handleChange}
              placeholder="Anno"
              className="p-2 font-semibold border border-white text-white rounded-full"
            />
          </div>

          {/* Data inizio */}
          <div className="flex flex-col">
            <label className="mb-1 text-white font-bold">Data Inizio *</label>
            <input
              type="text"
              name="start_date"
              value={travel.start_date}
              onChange={handleChange}
              placeholder="Data inizio"
              className="p-2 font-semibold border border-white text-white rounded-full"
            />
          </div>

          {/* Data fine */}
          <div className="flex flex-col">
            <label className="mb-1 text-white font-bold">Data Fine *</label>
            <input
              type="text"
              name="end_date"
              value={travel.end_date}
              onChange={handleChange}
              placeholder="Data fine"
              className="p-2 font-semibold border border-white text-white rounded-full"
            />
          </div>

          {/* Divider */}
          <div className="md:col-span-2 border-t border-white/30 my-4"></div>

          {/* Voti dettagliati (span 2 colonne) */}
          <div className="md:col-span-2">
            <h3 className="font-bold mt-4 mb-3 text-white text-center">Voti *</h3>
            <div className="flex flex-wrap justify-center gap-6">
              {Object.entries(travel.votes).map(([key, value]) => (
                <div key={key} className="flex flex-col items-center text-white">
                  <label className="capitalize mb-1 font-bold text-center">{key}</label>
                  <input
                    type="number"
                    name={key}
                    value={value}
                    onChange={handleVoteChange}
                    min="1"
                    max="5"
                    className="w-20 font-semibold p-2 border border-white text-white rounded-full text-center"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Media Voto */}
          <div className="md:col-span-2 mt-2 flex justify-center">
            <div className="flex flex-col items-center">
              <label className="pe-3 text-white font-bold mb-1">Media Voti</label>
              <input
                type="text"
                value={calculateGeneralVote() ?? "-"}
                readOnly
                className="w-20 p-2 font-semibold border border-white text-white rounded-full text-center"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="md:col-span-2 border-t border-white/30 my-4"></div>

          {/* Pulsanti (span 2 colonne) */}
          <div className="md:col-span-2 flex justify-between gap-2">
            <Link
              to="/travels"
              className="font-semibold px-6 py-2 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-rose-400 hover:from-red-400 hover:to-rose-300 text-white rounded-full cursor-pointer transition hover:scale-105">
              <i className="fa-solid fa-arrow-left"></i>
              Torna ai Viaggi
            </Link>
            <button
              type="submit"
              className="font-semibold px-6 py-2 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-teal-400 hover:from-green-400 hover:to-teal-300 text-white rounded-full cursor-pointer transition hover:scale-105">
              <i className="fa-solid fa-edit"></i>
              Salva Modifiche
            </button>
          </div>
        </form>
      </div>

      {/* Modale di conferma */}
      {message && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.5 }}
          className="fixed top-6 right-6 backdrop-blur-xl border border-white text-white px-6 py-3 rounded-full shadow-lg z-[9999]">
          <p className="text-lg font-semibold">{message}</p>
        </motion.div>
      )}
    </motion.div>
  );

}

export default EditTravel;
