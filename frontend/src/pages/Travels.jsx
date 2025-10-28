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
            className="relative inline-block w-5 h-5 mr-0.5 align-middle items-center"
            aria-hidden="true">
            {/* Riempimento giallo */}
            <span className="absolute inset-0 overflow-hidden" style={{ width }}>
              <span className="text-yellow-400 text-xl leading-5 select-none">★</span>
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
    <div className="relative min-h-screen p-8 overflow-visible text-gray-50">
      {/* Glow dinamico di sfondo */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute w-[30rem] h-[30rem] bg-gradient-to-br from-blue-500/20 to-orange-400/10 
        rounded-full blur-3xl top-10 left-10 animate-[pulse_6s_ease-in-out_infinite]" />
        <div className="absolute w-[28rem] h-[28rem] bg-gradient-to-br from-orange-500/20 to-blue-400/10 
        rounded-full blur-3xl bottom-10 right-10 animate-[pulse_6s_ease-in-out_infinite]" />
      </div>

      {/* Titolo */}
      <h1 className="text-4xl font-extrabold text-center text-gray-50/90 drop-shadow-md mb-10">
        I miei viaggi
      </h1>

      {/* Lista viaggi */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 p-4 mx-auto"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.25 } },
        }}
      >
        <AnimatePresence>
          {travels.map((v) => (
            <motion.div
              key={v.id}
              layout
              className="group relative bg-blue-500 backdrop-blur-2xl border border-white/40 rounded-3xl 
              shadow-2xl overflow-hidden transition-all duration-500 hover:scale-105 
              hover:shadow-[0_0_30px_rgba(255,255,255,0.35)]"
              variants={{
                hidden: { scale: 0.95, opacity: 0 },
                visible: { scale: 1, opacity: 1 },
              }}
              initial="hidden"
              animate="visible"
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Immagine */}
              {v.days && v.days[0]?.photo?.[0] && (
                <img
                  src={v.days[0].photo[0]}
                  alt={`Foto di ${v.town}`}
                  className="w-full h-48 object-cover opacity-90 group-hover:opacity-100 transition-all duration-100"
                />
              )}

              {/* Contenuto */}
              <div className="p-8 flex flex-col gap-3">
                <h2 className="text-2xl font-extrabold text-gray-50 drop-shadow-sm">
                  {v.town} - {v.city}
                </h2>
                <p className="text-gray-90 text-xl font-semibold">
                  {v.start_date} → {v.end_date}
                </p>

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-gray-50 font-medium text-xl"> Media voto:</span>
                  <StarRating rating={v.general_vote ?? 0} />
                </div>

                {/* Voti dettagliati */}
                {v.votes && (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-2sm text-gray-50 mt-2">
                    {Object.entries(v.votes).map(([key, value]) => (
                      <li key={key} className="flex justify-between items-center">
                        <span className="capitalize">{key}:</span>
                        <StarRating rating={value} />
                      </li>
                    ))}
                  </ul>
                )}

                {/* Pulsanti */}
                <div className="flex flex-col lg:flex-row justify-center items-center gap-2 mt-5">
                  <Link
                    to={`/travels/${v.id}/days`}
                    className=" flex-1 w-full font-semibold px-4 py-2 flex justify-center items-center gap-2 whitespace-nowrap
                     bg-gradient-to-r from-blue-600 to-cyan-500 backdrop-blur-md border border-white/40
                     text-gray-50/90 rounded-full shadow-md transition-all duration-100 hover:scale-105
                     hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]"
                  >
                    <i className="fa-solid fa-calendar-day mr-1"></i> Tappe
                  </Link>

                  <Link
                    to={`/travels/${v.id}/edit`}
                    className="flex-1 w-full font-semibold px-4 py-2 flex justify-center items-center gap-2 whitespace-nowrap
                     bg-gradient-to-r from-orange-600 to-yellow-500 backdrop-blur-md border border-white/40
                     text-gray-50/90 rounded-full shadow-md transition-all duration-100 hover:scale-105
                     hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]"
                  >
                    <i className="fa-solid fa-pen mr-1"></i> Modifica
                  </Link>

                  <button
                    onClick={() => setDeleteId(v.id)}
                    className="flex-1 w-full font-semibold px-4 py-2 flex justify-center items-center gap-2 whitespace-nowrap
                     bg-gradient-to-r from-red-600 to-rose-500 backdrop-blur-md border border-white/40
                     text-gray-50/90 rounded-full shadow-md transition-all duration-100 cursor-pointer hover:scale-105
                     hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]"
                  >
                    <i className="fa-solid fa-trash mr-1"></i> Cancella
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
          className="fixed top-6 right-6 backdrop-blur-2xl border border-white/40 text-gray-50/90 px-6 py-3 
                   rounded-full shadow-lg z-[9999] bg-gradient-to-r from-blue-500/70 to-orange-500/70"
        >
          <p className="text-lg font-semibold">{message}</p>
        </motion.div>
      )}
    </div>
  );

}

export default Travels;
