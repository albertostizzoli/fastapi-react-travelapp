import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

// funzione per ottenere le stelle 
function StarRating({ rating = 0, max = 5 }) {
  const safe = Math.max(0, Math.min(rating, max)); // assicura che il voto sia tra 0 e max

  return (
    <span className="inline-flex items-center">
      {Array.from({ length: max }).map((_, i) => { // per ogni stella
        const fill = Math.max(0, Math.min(1, safe - i)); // calcola la porzione da riempire (0, 0.5, 1)
        const width = `${fill * 100}%`; // converte in percentuale

        return (
          <span
            key={i}
            className="relative inline-block w-5 h-5 mr-0.5 align-middle"
            aria-hidden="true">
            {/* porzione vuota (sempre visibile) */}
            <span className="absolute inset-0 text-white text-lg leading-5 select-none flex items-center gap-2 mt-0.5">☆</span>

            {/* porzione piena (larghezza variabile) */}
            <span className="absolute inset-0 overflow-hidden" style={{ width }}>
              <span className="text-yellow-400 text-lg leading-5 select-none">★</span>
            </span>
          </span>
        );
      })}
      {/* Testo nascosto per screen reader */}
      <span className="sr-only">{safe} su {max}</span>
    </span>
  );
}


function Travels() {
  const [travels, setTravels] = useState([]); // stato per i viaggi
  const [deleteId, setDeleteId] = useState(null); // stato per l'id del viaggio da eliminare

  // uso lo useEffect per ottenere i dati dei viaggi
  useEffect(() => {
    const token = localStorage.getItem("token"); // recupera il token JWT
    if (!token) return; // se non c'è token, non faccio nulla

    axios
      .get("http://127.0.0.1:8000/travels", {
        headers: {
          Authorization: `Bearer ${token}`, //  token nell'header
        },
      })
      .then((res) => setTravels(res.data)) // aggiorna lo stato con i dati ricevuti
      .catch((err) => console.error(err)); // gestisce errori
  }, []);

  // con questa cancello tutti i dati del viaggio
  const handleDelete = () => {
    const token = localStorage.getItem("token"); //  recupera il token JWT
    if (!token) return; // se non c'è token, non faccio nulla

    axios
      .delete(`http://127.0.0.1:8000/travels/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`, //  invia il token
        },
      })
      .then(() => {
        setTravels(travels.filter((t) => t.id !== deleteId)); // aggiorna lista
        setDeleteId(null); // chiudi modale
      })
      .catch((err) => console.error(err));
  };



  return (
    <div className="bg-transparent p-8 overflow-visible min-h-screen">
      {/* Titolo */}
      <h1 className="text-3xl font-bold text-center text-white mb-8"> 🌍 I miei viaggi</h1>

      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.2 } }
        }}>
        {travels.map((v) => (
          <motion.div
            key={v.id}
            className="backdrop-blur-xl bg-gray-700/30 border border-gray-700 rounded-2xl shadow-lg overflow-hidden"
            variants={{
              hidden: { scaleY: 0, opacity: 0, originY: 0 },
              visible: { scaleY: 1, opacity: 1 }
            }}
            transition={{ duration: 1, ease: "easeOut" }}>
            {/* Immagine */}
            {v.days && v.days[0]?.photo?.[0] && ( // verifica che esista almeno una foto
              <img
                src={v.days[0].photo[0]} // usa la prima foto del primo giorno
                alt={`Foto di ${v.town}`}
                className="w-full h-48 object-cover" />
            )}

            {/* Contenuto */}
            <div className="p-4 flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-white">{v.town} - {v.city}</h2>
              <p className="text-gray-300 text-sm">📅 {v.start_date} → {v.end_date}</p>
              <p className="text-white font-medium mt-1">Anno: {v.year}</p>
              <p className="text-white font-medium flex items-center gap-2">
                Media Voto: <StarRating rating={v.general_vote ?? 0} /> {/* mostra la media voto o 0 se non definito */}
              </p>

              {/* Voti dettagliati */}
              {v.votes && (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm text-white mt-2">
                  {Object.entries(v.votes).map(([key, value]) => ( // itera sulle coppie chiave-valore dei voti
                    <li key={key} className="flex justify-between"> {/* mostra il nome del voto e la stella corrispondente */}
                      <span className="capitalize">{key}:</span>
                      <StarRating rating={value} /> {/* mostra il voto con le stelle */}
                    </li>
                  ))}
                </ul>
              )}

              {/* Pulsanti */}
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <Link
                  to={`/travels/${v.id}/days`}
                  className="px-2 py-2 flex justify-center items-center gap-1 bg-blue-500 hover:bg-blue-400 rounded-lg text-white text-sm font-medium shadow-md transition hover:scale-105 whitespace-nowrap">
                  <i className="fa-solid fa-calendar-day"></i>
                  Dettagli Viaggio
                </Link>
                <Link
                  to={`/travels/${v.id}/edit`}
                  className="px-2 py-2 flex justify-center items-center gap-1 bg-yellow-500 hover:bg-yellow-400 rounded-lg text-white text-sm font-medium shadow-md transition hover:scale-105 whitespace-nowrap">
                  <i className="fa-solid fa-edit"></i>
                  Modifica Viaggio
                </Link>
                <button
                  onClick={() => setDeleteId(v.id)}
                  className="px-2 py-2 flex justify-center items-center gap-1 bg-red-500 hover:bg-red-400 rounded-lg text-white text-sm font-medium shadow-md transition hover:scale-105 whitespace-nowrap cursor-pointer">
                  <i className="fa-solid fa-trash"></i>
                  Cancella Viaggio
                </button>
              </div>

            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Modale di conferma eliminazione */}
      {deleteId && (
        <motion.div className="fixed inset-0 flex items-center justify-center bg-transparent z-[9999]"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}>
          <div className="backdrop-blur-xl p-6 rounded-xl shadow-lg w-11/12 max-w-md text-center">
            <h2 className="text-xl font-bold mb-4 text-white">
              Sei sicuro di voler cancellare il viaggio?
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded-lg transition hover:scale-105 cursor-pointer">
                <i className="fa-solid fa-check"></i>
                Sì
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-lg transition hover:scale-105 cursor-pointer">
                <i className="fa-solid fa-xmark"></i>
                No
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default Travels;
