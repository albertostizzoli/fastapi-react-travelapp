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
    <div className="relative bg-transparent min-h-screen p-8 overflow-visible text-white">
      {/* Sfere luminose di sfondo per effetto vetro dinamico */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
        <div className="absolute w-[28rem] h-[28rem] bg-orange-400/10 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>
      </div>

      {/* Titolo */}
      <h1 className="text-4xl font-bold text-center text-white drop-shadow mb-8">
        🌍 I miei viaggi
      </h1>

      {/* Lista viaggi */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.2 } },
        }}
      >
        <AnimatePresence>
          {travels.map((v) => (
            <motion.div
              key={v.id}
              layout
              className="group bg-white/15 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden hover:bg-white/25 transition-all duration-300 hover:scale-105"
              variants={{
                hidden: { scaleY: 0, opacity: 0, originY: 0 },
                visible: { scaleY: 1, opacity: 1 },
              }}
              initial="hidden"
              animate="visible"
              exit={{ scaleY: 0, opacity: 0, originY: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              {/* Immagine */}
              {v.days && v.days[0]?.photo?.[0] && (
                <img
                  src={v.days[0].photo[0]}
                  alt={`Foto di ${v.town}`}
                  className="w-full h-48 object-cover opacity-90 group-hover:opacity-100 transition-all duration-300"
                />
              )}

              {/* Contenuto */}
              <div className="p-5 flex flex-col gap-3">
                <h2 className="text-lg font-semibold text-white drop-shadow-sm">
                  {v.town} - {v.city}
                </h2>
                <p className="text-gray-200 text-sm">
                  📅 {v.start_date} → {v.end_date}
                </p>
                <p className="text-white/90 font-medium mt-1">
                  Anno: <span className="text-white">{v.year}</span>
                </p>

                <p className="text-white font-medium flex items-center gap-2">
                  Media Voto:
                  <StarRating rating={v.general_vote ?? 0} />
                </p>

                {/* Voti dettagliati */}
                {v.votes && (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm text-white/90 mt-2">
                    {Object.entries(v.votes).map(([key, value]) => (
                      <li key={key} className="flex justify-between items-center">
                        <span className="capitalize">{key}:</span>
                        <StarRating rating={value} />
                      </li>
                    ))}
                  </ul>
                )}

                {/* Pulsanti */}
                <div className="flex flex-col lg:flex-row justify-center items-center gap-2 mt-4">
                  <Link
                    to={`/travels/${v.id}/days`}
                    className=" w-full font-semibold px-2 py-2 flex justify-center items-center gap-1 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 rounded-full text-white text-sm shadow-md transition hover:scale-105 whitespace-nowrap cursor-pointer"
                  >
                    <i className="fa-solid fa-calendar-day mr-1"></i>
                    Dettagli Viaggio
                  </Link>

                  <Link
                    to={`/travels/${v.id}/edit`}
                    className="w-full font-semibold px-2 py-2 flex justify-center items-center gap-1 bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-400 hover:to-yellow-300 rounded-full text-white text-sm shadow-md transition hover:scale-105 whitespace-nowrap cursor-pointer"
                  >
                    <i className="fa-solid fa-edit mr-1"></i>
                    Modifica Viaggio
                  </Link>

                  <button
                    onClick={() => setDeleteId(v.id)}
                    className="w-full font-semibold px-2 py-2 flex justify-center items-center gap-1 bg-gradient-to-r from-red-500 to-rose-400 hover:from-red-400 hover:to-rose-300 rounded-full text-white text-sm shadow-md transition hover:scale-105 whitespace-nowrap cursor-pointer"
                  >
                    <i className="fa-solid fa-trash mr-1"></i>
                    Cancella Viaggio
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Modale eliminazione */}
      <ModalDeleteTravel
        isOpen={!!deleteId}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

      {/* Messaggio conferma */}
      {message && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.5 }}
          className="fixed top-6 right-6 backdrop-blur-2xl border border-white/20 text-white px-6 py-3 rounded-full shadow-2xl z-[9999] bg-white/10"
        >
          <p className="text-lg font-semibold">{message}</p>
        </motion.div>
      )}
    </div>
  )
}

export default Travels;
