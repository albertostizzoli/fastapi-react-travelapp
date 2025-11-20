import { Link } from "react-router-dom"; // importo Link per la navigazione interna
import { motion } from "framer-motion"; // importo framer-motion per le animazioni
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // importo FontAwesomeIcon per le icone
import { faArrowRight, faBookOpen, faCheckCircle, faEdit, faPlus, faTrash, faXmarkCircle } from "@fortawesome/free-solid-svg-icons"; // importo le icone necessarie
import DayInfoModal from "../components/Modals/DayInfoModal"; // importo il modale Scopri di più
import ModalDeleteDay from "../components/DeleteModals/ModalDeleteDay"; // importo il modale di conferma eliminazione tappa
import TravelDaysController from "../hooks/TravelDaysController"; // importo la logica della pagina TravelDays

function TravelDays() {

  const {
    id,                         // id del viaggio dai parametri URL
    travel,                     // dati del viaggio
    message,                    // messaggio di successo o errore
    deleteDayId,                // id della tappa da cancellare
    selectedDay,                // tappa selezionata per il modale Scopri di più
    setSelectedDay,             // funzione per settare la tappa selezionata
    setDeleteDayId,             // funzione per settare l'id della tappa da eliminare
    handleDeleteDay             // funzione per eliminare una tappa
  } = TravelDaysController();   // utilizzo il controller per ottenere la logica della pagina

  if (!travel) return <p className="text-center mt-8">⏳ Caricamento...</p>;

  return (
    <div className="min-h-screen bg-transparent sm:p-12 overflow-x-hidden px-2 sm:px-12 relative">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 max-w-6xl mx-auto gap-4">

        {/* Titolo */}
        <motion.h1
          className="text-3xl font-extrabold text-white flex-1 min-w-[200px] p-3 rounded-3xl
          bg-linear-to-br from-white/20 via-white/10 to-transparent backdrop-blur-2xl 
          border border-white/40 shadow-lg"
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
             bg-linear-to-br from-green-600 to-teal-500 backdrop-blur-md border border-white/40
             text-white rounded-full shadow-md transition-all duration-300 hover:scale-105
             hover:shadow-[0_0_20px_rgba(255,255,255,0.30)]">
            <FontAwesomeIcon icon={faPlus} /> Aggiungi Tappa
          </Link>
        </motion.div>
      </div>

      {/* Layout principale */}
      <div className="flex flex-col lg:flex-row max-w-6xl mx-auto gap-8">
        <div className="flex-1 flex flex-col h-full">

          {/* Info Viaggio */}
          <motion.div
            className="p-4 rounded-3xl bg-linear-to-br from-white/20 via-white/10 to-transparent 
            backdrop-blur-2xl border border-white/40 shadow-xl"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}>

            <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-2xl">
              {travel.town} - {travel.city}
            </h2>

            <p className="text-xl font-bold text-white mb-2 drop-shadow-2xl">
              {travel.start_date} <FontAwesomeIcon icon={faArrowRight} /> {travel.end_date}
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
                    className="group relative bg-linear-to-br from-white/20 via-white/10 to-transparent backdrop-blur-2xl
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
                            transition-transform duration-300 group-hover:scale-105 group-hover:brightness-100"
                          />
                        ))}
                      </div>
                    )}

                    {/* Bottoni Card */}
                    <div className="flex flex-col gap-2 mt-auto">
                      <button
                        onClick={() => setSelectedDay(d)}
                        className="font-semibold px-4 py-2 flex items-center justify-center gap-2 
                        bg-linear-to-br from-blue-600 to-cyan-500 backdrop-blur-md border border-white/40 text-white 
                        rounded-full shadow-md transition-all duration-300 cursor-pointer hover:scale-105
                        hover:shadow-[0_0_15px_rgba(255,255,255,0.25)]">
                        <FontAwesomeIcon icon={faBookOpen} /> Leggi Tappa
                      </button>

                      <Link
                        to={`/days/${d.id}/edit`}
                        className="font-semibold px-4 py-2 flex items-center justify-center gap-2 
                        bg-linear-to-br from-orange-600 to-yellow-500 backdrop-blur-md border border-white/40 text-white 
                        rounded-full shadow-md transition-all duration-300 cursor-pointer hover:scale-105
                        hover:shadow-[0_0_15px_rgba(255,255,255,0.25)]">
                        <FontAwesomeIcon icon={faEdit} /> Modifica Tappa
                      </Link>

                      <button
                        onClick={() => setDeleteDayId(d.id)}
                        className="font-semibold px-4 py-2 flex items-center justify-center gap-2 
                        bg-linear-to-br from-red-600 to-rose-500 backdrop-blur-md border border-white/40 text-white 
                        rounded-full shadow-md transition-all duration-300 cursor-pointer hover:scale-105
                        hover:shadow-[0_0_15px_rgba(255,255,255,0.25)]">
                        <FontAwesomeIcon icon={faTrash} /> Cancella Tappa
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

      {/* Modale Scopri di più */}
      <DayInfoModal
        selectedDay={selectedDay}
        onClose={() => setSelectedDay(null)}
        travelDays={travel.days}
      />
      {/* Modale Conferma Eliminazione Tappa */}
      <ModalDeleteDay
        isOpen={!!deleteDayId}
        onConfirm={handleDeleteDay}
        onCancel={() => setDeleteDayId(null)}
      />

      {/* Modale di Conferma */}
      {message && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.5 }}
          className="fixed top-6 right-6 flex items-center gap-3bg-white/10 backdrop-blur-lg 
          border border-white/40 text-white px-6 py-3 rounded-full shadow-xl z-9999
          bg-linear-to-r from-blue-500 to-orange-500 dark:from-slate-900 dark:to-slate-500">
          {message.icon === "success" && (
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-2xl mr-2" />
          )}
          {message.icon === "error" && (
            <FontAwesomeIcon icon={faXmarkCircle} className="text-red-500 text-2xl mr-2" />
          )}
          <p className="text-xl font-semibold">{message.text}</p>
        </motion.div>
      )}
    </div>
  );

}

export default TravelDays;
