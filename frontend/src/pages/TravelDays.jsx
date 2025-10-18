import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import WorldMap from "../components/WorldMap";
import { motion, AnimatePresence } from "framer-motion";

function TravelDays() {
  const { id } = useParams(); // prendo l'id del viaggio dai parametri URL
  const [travel, setTravel] = useState(null); // stato per ottenere i dati del viaggio
  const [message, setMessage] = useState(""); // messaggio di successo o errore
  const [deleteDayId, setDeleteDayId] = useState(null); //  stato per il modale di conferma eliminazione giorno (Apri / Chiudi)
  const [selectedDay, setSelectedDay] = useState(null); //  stato per il modale Leggi Tutto (Apri / Chiudi)
  const [openImage, setOpenImage] = useState(null); // stato per l'immagine ingrandita (Apri / Chiudi)
  const [showMapModal, setShowMapModal] = useState(false); // stato per mostrare il modale della mappa ingrandita 
  const mapRef = useRef(null); // per ridisegnare la mappa quando è ingrandita

  // Fetch dati viaggio all'inizio e quando cambia l'id
  useEffect(() => {
    fetchTravel(); // chiamo la funzione per caricare i dati del viaggio
  }, [id]); // dipendenza sull'id

  // Quando è aperto il modale per leggere le informazioni delle tappe la barra di scorrimento verticale principale viene disattivata
  useEffect(() => {
    if (selectedDay) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [selectedDay]);


  // Funzione per caricare i dati del viaggio
  const fetchTravel = () => {
    const token = localStorage.getItem("token"); // prendo il token

    axios
      .get(`http://127.0.0.1:8000/travels/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTravel(res.data))
      .catch((err) => console.error("Errore nel caricamento del viaggio:", err));
  };


  // Funzione per eliminare un giorno
  const handleDeleteDay = () => {
    const token = localStorage.getItem("token");

    axios
      .delete(`http://127.0.0.1:8000/travels/${id}/days/${deleteDayId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        // aggiorna la lista dei giorni nel viaggio
        setTravel({
          ...travel,
          days: travel.days.filter((d) => d.id !== deleteDayId),
        });
        setDeleteDayId(null);

        // mostra messaggio di successo
        setMessage("✅ Tappa cancellata!");

        // fa sparire il messaggio dopo 2 secondi
        setTimeout(() => {
          setMessage("");
        }, 2000);
      })
      .catch((err) => {
        console.error("Errore nell'eliminazione del giorno:", err);
        // mostra messaggio di errore
        setMessage("❌ Errore durante la cancellazione della tappa.");
        setTimeout(() => setMessage(""), 2500);
      });
  };



  if (!travel) return <p className="text-center mt-8">⏳ Caricamento...</p>;


  return (
    <div className="min-h-screen bg-transparent sm:p-12 overflow-x-hidden px-2 sm:px-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 max-w-6xl mx-auto gap-4">

        { /* Titolo */}
        <motion.h1 className="text-3xl font-bold text-white flex-1 min-w-[200px]"
          initial={{ x: -100, opacity: 0 }} // animazione parte da sinistra
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}>
          🗓️ Tappe del viaggio
        </motion.h1>

        { /* Link Aggiungi Tappa */}
        <motion.div
          initial={{ x: 100, opacity: 0 }} // animazione parte da destra
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}>
          <Link
            to="/addDay"
            state={{ travelId: id }}
            className="font-semibold mt-4 sm:mt-0 px-4 py-2 flex items-center gap-2 bg-green-500 hover:bg-green-400 rounded-full text-white shadow-md transition hover:scale-105">
            <i className="fa-solid fa-plus"></i> Aggiungi Tappa
          </Link>
        </motion.div>
      </div>

      {/* Layout principale */}
      <div className="flex flex-col lg:flex-row max-w-6xl mx-auto gap-8">
        {/* Info Viaggio + Giorni */}
        <div className="flex-1 flex flex-col h-full">
          {/* Info Viaggio */}
          <motion.div className="p-6 bg-transparent rounded-xl"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}>
            <h2 className="text-2xl font-semibold text-white mb-2">
              📍 {travel.town} - {travel.city} {/* Paese e Città */}
            </h2>
            <p className="text-xl text-white mb-4">
              📅 {travel.start_date} → {travel.end_date} { /* Data Inizio e Data Fine */}
            </p>
            {travel.title && <p className="text-gray-200 italic">{travel.title}</p>} { /* Titolo */}
          </motion.div>

          {/* Lista Giorni in griglia */}
          <div className="flex-1 overflow-y-auto pr-2">
            {travel.days?.length > 0 ? (
              <motion.div className="flex flex-wrap gap-4"
                variants={{
                  hidden: { opacity: 1 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.5 } },
                }}
                initial="hidden"
                animate="visible">
                {travel.days.map((d) => (
                  <motion.div
                    key={d.id}
                    className="backdrop-blur-xl p-4 rounded-3xl shadow-lg border border-gray-700 flex flex-col justify-between w-full sm:w-64"
                    variants={{
                      hidden: { scale: 0, opacity: 0 },
                      visible: {
                        scale: 1,
                        opacity: 1,
                        transition: { duration: 0.8, ease: "easeOut" }
                      }
                    }}>
                    <div className="mb-4">
                      <p className="text-gray-300 text-lg">{d.date}</p> { /* Data */}
                      <p className="text-white font-semibold text-xl">{d.title}</p> { /* Titolo */}
                    </div>

                    { /* Foto */}
                    {d.photo.length > 0 && (
                      <div className="flex gap-2 flex-wrap mb-4">
                        {d.photo.slice(0, 2).map((p, i) => ( // mostro solo le prime 2 foto come anteprima
                          <img
                            key={i}
                            src={p}
                            alt="foto viaggio"
                            loading="lazy"
                            className="w-20 h-20 object-cover rounded-3xl border border-gray-600 shadow-sm"
                          />
                        ))}
                      </div>
                    )}

                    { /* Bottoni Card */}
                    <div className="flex flex-col gap-2">
                      {/* Mostra il resto delle informazioni della tappa */}
                      <button
                        onClick={() => setSelectedDay(d)}
                        className="font-semibold px-4 py-2 flex items-center justify-center bg-blue-500 hover:bg-blue-400 text-white rounded-full shadow-md transition hover:scale-105 cursor-pointer">
                        <i className="fa-solid fa-book-open mr-2"></i> Leggi Tutto
                      </button>

                      { /* Va nella pagina Modifica Tappa */}
                      <Link
                        to={`/days/${d.id}/edit`}
                        className=" font-semibold px-4 py-2 flex items-center justify-center bg-yellow-500 hover:bg-yellow-400 text-white rounded-full shadow-md transition hover:scale-105 cursor-pointer">
                        <i className="fa-solid fa-edit mr-2"></i>
                        Modifica Tappa
                      </Link>

                      { /* Cancella la Tappa */}
                      <button
                        onClick={() => setDeleteDayId(d.id)}
                        className="font-semibold px-4 py-2 flex items-center justify-center bg-red-500 hover:bg-red-400 text-white rounded-full shadow-md transition hover:scale-105 cursor-pointer">
                        <i className="fa-solid fa-trash mr-2"></i> Cancella Tappa
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              // se non ci sono giorni del viaggio mostra questo messaggio
              <p className="text-white font-semibold text-center mt-4">Nessuna Tappa Presente</p>
            )}
          </div>
        </div>
      </div>

      {/* Modale Leggi Tutto */}
      <AnimatePresence>
        {selectedDay && (
          <motion.div className="fixed inset-0 flex items-center justify-center bg-black/50 p-2 sm:p-4 z-[9999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <motion.div className="bg-gray-800 rounded-3xl w-full max-w-full sm:max-w-5xl h-[90vh] shadow-lg flex flex-col overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}>
              {/* Header: pulsanti Chiudi e Mappa */}
              <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <button
                  onClick={() => setSelectedDay(null)}
                  className="font-semibold px-3 py-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-400 text-white rounded-full shadow-md transition hover:scale-105 cursor-pointer">
                  <i className="fa-solid fa-arrow-left"></i> Torna alle Tappe
                </button>

                {/*  Pulsante per aprire la mappa come modale */}
                <button
                  onClick={() => setShowMapModal(true)}
                  className="font-semibold px-3 py-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white rounded-full shadow-md transition hover:scale-105 cursor-pointer">
                  <i className="fa-solid fa-map-location-dot"></i> Vai alla Mappa
                </button>
              </div>

              {/* Contenuto scrollabile */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto scrollbar-custom max-h-full">
                {/* Titolo */}
                <div className="mb-3">
                  <h1 className="text-2xl sm:text-2xl font-bold text-white">{selectedDay.title}</h1>
                </div>

                {/* Data */}
                <div className="mb-3">
                  <p className="sm:text-xl text-white">{selectedDay.date}</p>
                </div>

                {/* Descrizione */}
                <p className="text-white text-justify mb-3">{selectedDay.description}</p>

                {/* Categorie  */}
                {selectedDay.tags?.length > 0 && (
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {selectedDay.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="font-semibold bg-blue-500 hover:bg-blue-400 text-white px-3 py-2 rounded-full text-sm shadow-md mt-2">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Foto */}
                {selectedDay.photo.length > 0 && (
                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                    variants={{
                      hidden: { opacity: 1 },
                      visible: { opacity: 1, transition: { staggerChildren: 0.5 } },
                    }}
                    initial="hidden"
                    animate="visible">
                    {selectedDay.photo.map((p, i) => (
                      <motion.img
                        key={i}
                        src={p}
                        alt="foto viaggio"
                        loading="lazy"
                        onClick={() => setOpenImage(p)}
                        className="w-full h-40 sm:h-40 object-cover rounded-3xl border-3 border-gray-500 shadow-sm cursor-pointer hover:border-white"
                        variants={{
                          hidden: { scale: 0, opacity: 0 },
                          visible: {
                            scale: 1,
                            opacity: 1,
                            transition: { duration: 0.8, ease: 'easeOut' },
                          },
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Modale Foto */}
            {openImage && (
              <div
                className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[10000]"
                onClick={() => setOpenImage(null)}>
                <div onClick={(e) => e.stopPropagation()} className="relative">
                  <button
                    onClick={() => setOpenImage(null)}
                    className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full p-2 shadow-lg cursor-pointer">
                    <i className="fa-solid fa-xmark text-lg"></i>
                  </button>
                  <motion.img
                    src={openImage.replace('w=400', 'w=1600')}
                    alt="foto ingrandita"
                    loading="lazy"
                    className="w-auto h-full max-h-[90vh] max-w-[90vw] rounded-3xl shadow-lg object-contain"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}

            {/* Modale Mappa */}
            {showMapModal && (
              <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[10001]">
                <div className="relative sm:w-[70vw] sm:h-[90vh] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl">
                  {/* Bottone Chiudi Mappa */}
                  <div onClick={(e) => e.stopPropagation()} className="relative">
                    <button
                      onClick={() => setShowMapModal(false)}
                      className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-3 shadow-lg cursor-pointer z-[1000] hover:bg-red-400 transition">
                      <i className="fa-solid fa-xmark text-lg"></i>
                    </button>
                  </div>
                  <WorldMap
                    days={travel.days}
                    selectedDay={selectedDay}
                    mapRef={mapRef}
                    isModal={true}
                  />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>


      {/* Modale di conferma eliminazione giorno */}
      <AnimatePresence>
        {deleteDayId && ( // se deleteDayId non è null, mostro il modale
          <motion.div className="fixed inset-0 flex items-center justify-center bg-transparent z-[9999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <motion.div className="backdrop-blur-xl p-6 rounded-3xl shadow-lg w-80 text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.5 }}>
              <h2 className="text-xl font-bold mb-4 text-white">
                Sei sicuro di voler cancellare la tappa?
              </h2>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleDeleteDay}
                  className="font-semibold flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded-full shadow-md transition hover:scale-105 cursor-pointer">
                  <i className="fa-solid fa-check"></i> Sì
                </button>
                <button
                  onClick={() => setDeleteDayId(null)}
                  className="font-semibold flex items-center gap-2 bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-full shadow-md transition hover:scale-105 cursor-pointer">
                  <i className="fa-solid fa-xmark"></i> No
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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

export default TravelDays;
