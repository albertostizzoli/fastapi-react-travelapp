import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import ModalDeleteTravel from "../components/DeleteModals/ModalDeleteTravel";


// funzione per ottenere le stelle 
function StarRating({ rating = 0, max = 5 }) {
  const safe = Math.max(0, Math.min(rating, max)); // assicura che il voto sia tra 0 e max

  return (
    <span className="inline-flex items-center">
      {Array.from({ length: max }).map((_, i) => {
        const fill = Math.max(0, Math.min(1, safe - i)); // calcola la porzione da riempire (0, 0.5, 1)
        const width = `${fill * 100}%`; // converte in percentuale

        return (
          <span
            key={i}
            className="relative inline-block w-5 h-5 mr-0.5 align-middle"
            aria-hidden="true">
            {/* Riempimento giallo */}
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
  const [message, setMessage] = useState(""); // messaggio di successo o errore

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
    const token = localStorage.getItem("token"); // recupera il token JWT
    if (!token) return; // se non c'è token, non faccio nulla

    axios
      .delete(`http://127.0.0.1:8000/travels/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // invia il token
        },
      })
      .then(() => {
        // aggiorna la lista rimuovendo il viaggio eliminato
        setTravels(travels.filter((t) => t.id !== deleteId));
        setDeleteId(null);

        // mostra messaggio di successo
        setMessage("✅ Viaggio eliminato!");

        // nasconde il messaggio dopo 2 secondi
        setTimeout(() => setMessage(""), 2000);
      })
      .catch((err) => {
        console.error("Errore durante l'eliminazione del viaggio:", err);
        // mostra messaggio di errore
        setMessage("❌ Errore durante l'eliminazione del viaggio.");
        setTimeout(() => setMessage(""), 2500);
      });
  };


  return (
    <div className="bg-transparent p-8 overflow-visible min-h-screen">
      {/* Titolo */}
      <h1 className="text-3xl font-bold text-center text-white mb-8"> 🌍 I miei viaggi</h1>

      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.2 } }
        }}>

        <AnimatePresence>
          {travels.map((v) => (
            <motion.div
              key={v.id}
              layout
              className="backdrop-blur-xl bg-gray-600/30 border border-gray-700 rounded-3xl shadow-lg overflow-hidden"
              variants={{
                hidden: { scaleY: 0, opacity: 0, originY: 0 },
                visible: { scaleY: 1, opacity: 1 }
              }}
              initial="hidden"
              animate="visible"
              exit={{ scaleY: 0, opacity: 0, originY: 0 }} // exit anima come l’entrata ma al contrario
              transition={{ duration: 0.8, ease: "easeOut" }}>
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
                <div className="flex flex-col lg:flex-row gap-2 mt-4">
                  <Link
                    to={`/travels/${v.id}/days`}
                    className="font-semibold px-2 py-2 flex justify-center items-center gap-1 bg-blue-500 hover:bg-blue-400 rounded-full text-white text-sm shadow-md transition hover:scale-105 whitespace-nowrap">
                    <i className="fa-solid fa-calendar-day"></i>
                    Dettagli Viaggio
                  </Link>
                  <Link
                    to={`/travels/${v.id}/edit`}
                    className="font-semibold px-2 py-2 flex justify-center items-center gap-1 bg-yellow-500 hover:bg-yellow-400 rounded-full text-white text-sm shadow-md transition hover:scale-105 whitespace-nowrap">
                    <i className="fa-solid fa-edit"></i>
                    Modifica Viaggio
                  </Link>
                  <button
                    onClick={() => setDeleteId(v.id)}
                    className="font-semibold px-2 py-2 flex justify-center items-center gap-1 bg-red-500 hover:bg-red-400 rounded-full text-white text-sm shadow-md transition hover:scale-105 whitespace-nowrap cursor-pointer">
                    <i className="fa-solid fa-trash"></i>
                    Cancella Viaggio
                  </button>
                </div>

              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Modale di conferma eliminazione */}
      <ModalDeleteTravel
        isOpen={!!deleteId}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

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
  );
}

export default Travels;
