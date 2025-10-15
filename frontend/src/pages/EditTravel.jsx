import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

function EditTravel() {
  const { id } = useParams(); // recupero l'ID del viaggio dall'URL
  const navigate = useNavigate(); // hook per navigare fra le pagine
  const [travel, setTravel] = useState(null); // per salvare i dati del viaggio

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

  // invio dal form e aggiorna il backend
  const handleSubmit = (e) => {
    e.preventDefault(); // previene il comportamento di default del form

    const token = localStorage.getItem("token");

    const updatedTravel = {
      ...travel, // mantiene gli altri dati del viaggio
      general_vote: calculateGeneralVote() // aggiorna la media dei voti
        ? parseFloat(calculateGeneralVote()) // converte in numero
        : null, // se non c'è media, mette null
    };

    axios
      .put(`http://127.0.0.1:8000/travels/${id}`, updatedTravel, {
        headers: { Authorization: `Bearer ${token}` }, //  aggiungo token
      }) // invia la richiesta PUT al backend
      .then(() => {
        navigate("/travels"); // torna alla pagina dei viaggi
      })
      .catch((err) => console.error(err));
  };

  if (!travel) return <p className="text-center">Caricamento...</p>;


  return (
    <motion.div className="flex flex-col items-center justify-center bg-transparent w-full overflow-hidden min-h-screen sm:p-8 p-4"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 1.5 }}>
      {/* Container del form */}
      <div className="w-full max-w-4xl h-full sm:h-auto sm:max-h-[calc(100vh-4rem)] overflow-auto backdrop-blur-xl shadow-lg rounded-2xl p-6 space-y-4 border border-white">

        {/* Titolo + nota obbligatorio */}
        <div className="flex items-center justify-between md:col-span-2 mb-4">
          <h2 className="text-white text-2xl font-bold">✏️ Modifica Viaggio</h2>
          <p className="text-white text-sm italic">* Il campo è obbligatorio</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Paese */}
          <div className="flex flex-col">
            <label className="mb-1 text-white font-semibold">Paese *</label>
            <input
              id="town"
              type="text"
              name="town"
              value={travel.town}
              onChange={handleChange} // aggiorna lo stato al cambiamento
              placeholder="Paese"
              className="p-2 border border-white rounded text-white" />
          </div>

          {/* Città */}
          <div className="flex flex-col">
            <label className="mb-1 text-white font-semibold">Città *</label>
            <input
              id="city"
              type="text"
              name="city"
              value={travel.city}
              onChange={handleChange}
              placeholder="Città"
              className="p-2 border border-white rounded text-white" />
          </div>

          {/* Anno */}
          <div className="flex flex-col">
            <label className="mb-1 text-white font-semibold">Anno *</label>
            <input
              type="number"
              name="year"
              value={travel.year}
              onChange={handleChange}
              placeholder="Anno"
              className="p-2 border border-white text-white rounded" />
          </div>

          {/* Data inizio */}
          <div className="flex flex-col">
            <label className="mb-1 text-white font-semibold">Data Inizio *</label>
            <input
              type="text"
              name="start_date"
              value={travel.start_date}
              onChange={handleChange}
              placeholder="Data inizio"
              className="p-2 border border-white text-white rounded" />
          </div>

          {/* Data fine */}
          <div className="flex flex-col">
            <label className="mb-1 text-white font-semibold">Data Fine *</label>
            <input
              type="text"
              name="end_date"
              value={travel.end_date}
              onChange={handleChange}
              placeholder="Data fine"
              className="p-2 border border-white text-white rounded" />
          </div>


          {/* Voti dettagliati (span 2 colonne) */}
          <div className="md:col-span-2">
            <h3 className="font-semibold text-lg mt-6 mb-2 text-white">Voti *</h3>
            <div className="flex flex-wrap gap-4">
              {Object.entries(travel.votes).map(([key, value]) => ( // itera su ogni voto */}
                <div key={key} className="flex flex-col w-28 text-white">
                  <label className="capitalize mb-1">{key}</label>
                  <input
                    type="number"
                    name={key}
                    value={value}
                    onChange={handleVoteChange}
                    min="1"
                    max="5"
                    className="w-full p-2 border border-white text-white rounded-lg" />
                </div>
              ))}
            </div>
          </div>

          {/* Media Voto */}
          <div className="md:col-span-2 mt-1">
            <label className="pe-3 text-white font-semibold">Media Voti</label>
            <input
              type="text"
              value={calculateGeneralVote() ?? "-"}
              readOnly
              className="p-2 border border-white text-white font-semibold rounded" />
          </div>

          {/* Pulsante (span 2 colonne) */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full px-4 py-2 flex items-center justify-center gap-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 cursor-pointer transition hover:scale-105">
              <i className="fa-solid fa-edit"></i>
              Salva Modifiche
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default EditTravel;
