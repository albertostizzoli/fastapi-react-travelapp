import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

// funzione per ottenere le stelle 
function StarRating({ rating = 0, max = 5 }) {
  const safe = Math.max(0, Math.min(rating, max)); // clamp 0..5

  return (
    <span className="inline-flex items-center">
      {Array.from({ length: max }).map((_, i) => {
        // quanto di questa stella va riempito (0..1)
        const fill = Math.max(0, Math.min(1, safe - i));
        const width = `${fill * 100}%`; // es. 50% per mezza stella

        return (
          <span
            key={i}
            className="relative inline-block w-5 h-5 mr-0.5 align-middle"
            aria-hidden="true"
          >
            {/* stella vuota */}
            <span className="absolute inset-0 text-white text-lg leading-5 select-none flex items-center gap-2 mt-0.5">☆</span>

            {/* porzione riempita (da 0% a 100%) */}
            <span className="absolute inset-0 overflow-hidden" style={{ width }}>
              <span className="text-yellow-400 text-lg leading-5 select-none">★</span>
            </span>
          </span>
        );
      })}
      {/* per accessibilità: testo nascosto con il valore numerico */}
      <span className="sr-only">{safe} su {max}</span>
    </span>
  );
}


function Home() {
  const [travels, setTravels] = useState([]);
  const [openTravel, setOpenTravel] = useState(null); // id viaggio aperto
  const [deleteId, setDeleteId] = useState(null); // id viaggio da eliminare

  // uso lo useEffect per ottenere i dati dei viaggi
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/travels")
      .then((res) => setTravels(res.data))
      .catch((err) => console.error(err));
  }, []);

  // mi serve per ottenere l'effetto di apertura e chiusura dell'accordion
  const toggleAccordion = (id) => {
    setOpenTravel(openTravel === id ? null : id);
  };

  // con questa cancello tutti i dati del viaggio
  const handleDelete = () => {
    axios
      .delete(`http://127.0.0.1:8000/travels/${deleteId}`)
      .then(() => {
        setTravels(travels.filter((t) => t.id !== deleteId)); // aggiorna lista
        setDeleteId(null); // chiudi modale
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="min-h-screen bg-transparent p-8">
      <h1 className="text-3xl font-bold text-center text-white mb-8">
        🌍 I miei viaggi
      </h1>

      <AnimatePresence> { /* produrrà un effetto zoom su tutto l'accordion */}
        <motion.div
          key="content"
          initial={{ opacity: 1, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 1, scale: 0.5 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="max-w-3xl mx-auto space-y-6">
          {travels.map((v) => (
            <div
              key={v.id}
              className="backdrop-blur-xl bg-gray-800/30 shadow-lg rounded-2xl border border-gray-700"
            >
              {/* intestazione accordion */}
              <button
                onClick={() => toggleAccordion(v.id)}
                className="w-full flex flex-wrap sm:flex-nowrap justify-between items-center p-4 text-left gap-2 cursor-pointer"
              >
                <div className="flex-1 min-w-[200px]">
                  <h2 className="text-lg font-semibold text-white">
                    {v.town} - {v.city}
                  </h2>
                  <p className="text-white text-sm">
                    📅 {v.start_date} → {v.end_date}
                  </p>
                </div>
                <span className="text-gray-300 text-xl">
                  {openTravel === v.id ? "▲" : "▼"}
                </span>
              </button>

              {/* contenuto accordion */}
              <AnimatePresence>
                {openTravel === v.id && (
                  <motion.div
                    key="accordion-content" // produrrà un effetto zoom sul contenuto 
                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                    animate={{ opacity: 1, height: "auto", scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="px-4 pb-4 border-t border-gray-700">
                    <p className="text-white font-medium mt-3 mb-4 flex items-center gap-2">
                      Anno: {v.year}
                    </p>
                    <p className="text-white font-medium mt-2 mb-3 flex items-center gap-2">Media Voto:{" "}
                      <StarRating rating={v.general_vote ?? 0} /> {/* chiamo la funzione StarRating per il numero delle stelle*/}
                    </p>

                    {/* voti dettagliati */}
                    {v.votes && (
                      <div className="mb-4">
                        <h3 className="font-semibold text-white mb-2">Voti:</h3>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-white">
                          {Object.entries(v.votes).map(([key, value]) => (
                            <li key={key} className="flex justify-between items-center">
                              <span className="capitalize">{key}:</span>
                              <StarRating rating={value} /> {/* chiamo la funzione StarRating per il numero delle stelle*/}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Pulsanti sotto l'accordion */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
                      <Link
                        to={`/travels/${v.id}/days`}
                        className="px-4 py-2 flex items-center gap-2  bg-blue-500 hover:bg-blue-400 rounded-lg text-white font-medium shadow-md transition hover:scale-105 text-center">
                        <i className="fa-solid fa-calendar-day"></i>
                        Dettagli Viaggio
                      </Link>

                      <Link
                        to={`/travels/${v.id}/edit`}
                        className="px-4 py-2 flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 rounded-lg text-white font-medium shadow-md transition hover:scale-105 text-center">
                        <i className="fa-solid fa-edit"></i>
                        Modifica Viaggio
                      </Link>

                      <button
                        onClick={() => setDeleteId(v.id)}
                        className="px-4 py-2 flex items-center gap-2 bg-red-600 hover:bg-red-500 rounded-lg text-white font-medium shadow-md transition hover:scale-105 cursor-pointer">
                        <i className="fa-solid fa-trash"></i>
                        Elimina Viaggio
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Modale di conferma eliminazione */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent z-50">
          <div className="backdrop-blur-xl p-6 rounded-xl shadow-lg w-11/12 max-w-md text-center">
            <h2 className="text-xl font-bold mb-4 text-white">
              Sei sicuro di voler cancellare il viaggio?
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition hover:scale-105 cursor-pointer">
                <i className="fa-solid fa-check"></i>
                Sì
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition hover:scale-105 cursor-pointer">
                <i className="fa-solid fa-xmark"></i>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
