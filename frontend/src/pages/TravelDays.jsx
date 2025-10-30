import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import DayInfoModal from "../components/Modals/DayInfoModal";
import ModalDeleteDay from "../components/DeleteModals/ModalDeleteDay";

function TravelDays() {
  const { id } = useParams(); // prendo l'id del viaggio dai parametri URL
  const [travel, setTravel] = useState(null); // stato per ottenere i dati del viaggio
  const [message, setMessage] = useState(""); // messaggio di successo o errore
  const [deleteDayId, setDeleteDayId] = useState(null); //  stato per il modale di conferma eliminazione giorno (Apri / Chiudi)
  const [selectedDay, setSelectedDay] = useState(null); //  stato per il modale Leggi Tutto (Apri / Chiudi)

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
    <div className="min-h-screen bg-transparent sm:p-12 overflow-x-hidden px-2 sm:px-12 relative">
      {/* Effetto Glow dinamico di sfondo */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute w-120 h-120 bg-linear-to-br from-blue-400/20 to-cyan-400/10 
        rounded-full blur-3xl top-10 left-10 animate-[pulse_6s_ease-in-out_infinite]" />
        <div className="absolute w-lg h-128 bg-linear-to-br from-orange-400/20 to-amber-400/10 
        rounded-full blur-3xl bottom-10 right-10 animate-[pulse_6s_ease-in-out_infinite]" />
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 max-w-6xl mx-auto gap-4">
        {/* Titolo */}
        <motion.h1
          className="text-4xl font-extrabold text-white flex-1 min-w-[200px] p-4 rounded-3xl
           bg-white/5 backdrop-blur-md border border-white/40 shadow-lg"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}>
          Tappe del viaggio
        </motion.h1>

        {/* Link Aggiungi Tappa */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}>

          <Link
            to="/addDay"
            state={{ travelId: id }}
            className="font-semibold mt-4 sm:mt-0 px-6 py-2 flex items-center justify-center gap-2
             bg-linear-to-r from-green-600 to-teal-500 backdrop-blur-md border border-white/40
             text-white rounded-full shadow-md transition-all duration-100 hover:scale-105
             hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]">
            <i className="fa-solid fa-plus"></i> Aggiungi Tappa
          </Link>
        </motion.div>
      </div>

      {/* Layout principale */}
      <div className="flex flex-col lg:flex-row max-w-6xl mx-auto gap-8">
        <div className="flex-1 flex flex-col h-full">
          {/* Info Viaggio */}
          <motion.div
            className="p-6 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/40 shadow-xl"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}>

            <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-2xl">
              {travel.town} - {travel.city}
            </h2>

            <p className="text-2xl font-semibold text-white mb-2 drop-shadow-2xl">
              {travel.start_date} → {travel.end_date}
            </p>

            {travel.title && (
              <p className="text-white/60 italic border-t border-white/10">
                {travel.title}
              </p>
            )}
          </motion.div>

          {/* Lista Giorni */}
          <div className="flex-1 pr-2 mt-6">
            {travel.days?.length > 0 ? (
              <motion.div
                className="flex flex-wrap gap-6"
                variants={{
                  hidden: { opacity: 1 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.4 } },
                }}
                initial="hidden"
                animate="visible">

                {travel.days.map((d) => (
                  <motion.div
                    key={d.id}
                    className="group relative backdrop-blur-2xl bg-linear-to-br from-blue-100/10 via-orange-100/5 to-transparent
                    border border-white/40 p-5 rounded-3xl shadow-xl flex flex-col justify-between w-full sm:w-64
                    transition-all duration-500 hover:scale-105 hover:shadow-[0_0_25px_rgba(255,255,255,0.25)]"
                    variants={{
                      hidden: { scale: 0.9, y: 20, opacity: 0 },
                      visible: {
                        scale: 1,
                        y: 0,
                        opacity: 1,
                        transition: { duration: 0.8, ease: "easeOut" },
                      },
                    }}>
                      
                    {/* Titolo e data */}
                    <div className="mb-4">
                      <p className="text-white font-extrabold text-2xl drop-shadow-xl">{d.title}</p>
                      <p className="text-white text-xl font-bold opacity-80 drop-shadow-md mt-2">{d.date}</p>
                    </div>

                    {/* Foto */}
                    {d.photo.length > 0 && (
                      <div className="flex gap-2 flex-wrap mb-4">
                        {d.photo.slice(0, 2).map((p, i) => (
                          <img
                            key={i}
                            src={p}
                            alt="foto viaggio"
                            loading="lazy"
                            className="w-20 h-20 object-cover rounded-2xl border border-white/40 shadow-md
                            transition-transform duration-300 group-hover:scale-110 group-hover:brightness-110"
                          />
                        ))}
                      </div>
                    )}

                    {/* Bottoni Card */}
                    <div className="flex flex-col gap-2 mt-auto">
                      <button
                        onClick={() => setSelectedDay(d)}
                        className="font-semibold px-4 py-2 flex items-center justify-center gap-2 
                        bg-linear-to-r from-blue-600 to-cyan-500 backdrop-blur-md border border-white/40
                      text-white rounded-full shadow-md transition-all duration-100 cursor-pointer hover:scale-105
                        hover:shadow-[0_0_15px_rgba(255,255,255,0.25)]">
                        <i className="fa-solid fa-book-open"></i> Scopri di più
                      </button>

                      <Link
                        to={`/days/${d.id}/edit`}
                        className="font-semibold px-4 py-2 flex items-center justify-center gap-2 
                        bg-linear-to-r from-orange-600 to-yellow-500 backdrop-blur-md border border-white/40
                      text-white rounded-full shadow-md transition-all duration-100 cursor-pointer hover:scale-105
                        hover:shadow-[0_0_15px_rgba(255,255,255,0.25)]">
                        <i className="fa-solid fa-pen"></i> Modifica Tappa
                      </Link>

                      <button
                        onClick={() => setDeleteDayId(d.id)}
                        className="font-semibold px-4 py-2 flex items-center justify-center gap-2 
                        bg-linear-to-r from-red-600 to-rose-500 backdrop-blur-md border border-white/40
                      text-white rounded-full shadow-md transition-all duration-100 cursor-pointer hover:scale-105
                        hover:shadow-[0_0_15px_rgba(255,255,255,0.25)]">
                        <i className="fa-solid fa-trash"></i> Cancella Tappa
                      </button>
                    </div>
                  </motion.div>
                ))}

              </motion.div>
            ) : (
              <p className="text-white/80 font-semibold text-center mt-6 italic">
                Nessuna tappa presente
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modali */}
      <DayInfoModal
        selectedDay={selectedDay}
        onClose={() => setSelectedDay(null)}
        travelDays={travel.days}
      />
      <ModalDeleteDay
        isOpen={!!deleteDayId}
        onConfirm={handleDeleteDay}
        onCancel={() => setDeleteDayId(null)}
      />

      {/* Messaggio */}
      {message && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.5 }}
          className="fixed top-6 right-6 backdrop-blur-2xl border border-white/40 text-white px-6 py-3
                   rounded-full shadow-lg z-9999 bg-linear-to-r from-blue-500 to-orange-500"
        >
          <p className="text-lg font-semibold">{message}</p>
        </motion.div>
      )}
    </div>
  );

}

export default TravelDays;
