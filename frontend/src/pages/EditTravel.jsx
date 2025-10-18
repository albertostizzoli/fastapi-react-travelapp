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
    <motion.div className="flex flex-col items-center justify-center bg-transparent w-full overflow-hidden min-h-screen sm:p-8 p-4"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 1.5 }}>
      {/* Container del form */}
      <div className="w-full max-w-4xl h-full sm:h-auto sm:max-h-[calc(100vh-4rem)] overflow-auto backdrop-blur-xl shadow-lg rounded-3xl p-6 space-y-4 border border-white">

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
              onChange={handleChange} // aggiorna lo stato al cambiamento
              placeholder="Paese"
              className="p-2 font-semibold border border-white rounded-full text-white" />
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
              className="p-2 font-semibold border border-white rounded-full text-white" />
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
              className="p-2 font-semibold border border-white text-white rounded-full" />
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
              className="p-2 font-semibold border border-white text-white rounded-full" />
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
              className="p-2 font-semibold border border-white text-white rounded-full" />
          </div>


          {/* Voti dettagliati (span 2 colonne) */}
          <div className="md:col-span-2">
            <h3 className="font-bold  mt-6 mb-2 text-white">Voti *</h3>
            <div className="flex flex-wrap gap-4">
              {Object.entries(travel.votes).map(([key, value]) => ( // itera su ogni voto */}
                <div key={key} className="flex flex-col w-16 text-white">
                  <label className="capitalize mb-1 font-bold">{key}</label>
                  <input
                    type="number"
                    name={key}
                    value={value}
                    onChange={handleVoteChange}
                    min="1"
                    max="5"
                    className="w-16 font-semibold p-2 border border-white text-white rounded-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Media Voto */}
          <div className="md:col-span-2 mt-1">
            <label className="pe-3 text-white font-bold">Media Voti</label>
            <input
              type="text"
              value={calculateGeneralVote() ?? "-"}
              readOnly
              className="w-16 p-2 font-semibold border border-white text-white rounded-full" />
          </div>

          {/* Pulsanti (span 2 colonne) */}
          <div className="md:col-span-2 flex justify-center gap-2">
            <Link
              to="/travels"
              className="font-semibold w-full px-4 py-2 flex items-center justify-center gap-2 bg-red-500 text-white rounded-full hover:bg-red-400 cursor-pointer transition hover:scale-105">
              <i className="fa-solid fa-arrow-left"></i>
              Torna ai Viaggi
            </Link>
            <button
              type="submit"
              className="font-semibold w-full px-4 py-2 flex items-center justify-center gap-2 bg-green-500 text-white rounded-full hover:bg-green-400 cursor-pointer transition hover:scale-105">
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
          className="fixed top-6 right-6 backdrop-blur-xl border border-white
               text-white px-6 py-3 rounded-full shadow-lg z-[9999]">
          <p className="text-lg font-semibold">{message}</p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default EditTravel;
