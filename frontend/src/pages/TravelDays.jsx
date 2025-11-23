import { Link } from "react-router-dom"; // importo Link per la navigazione interna
import { motion, AnimatePresence } from "framer-motion"; // importo framer-motion per le animazioni
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // importo FontAwesomeIcon per le icone
import { faArrowDown, faArrowRight, faBookOpen, faCheckCircle, faEdit, faPlus, faTrash, faXmarkCircle } from "@fortawesome/free-solid-svg-icons"; // importo le icone necessarie
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
    handleDeleteDay,            // funzione per eliminare una tappa
    openCardId,                 // mostra la card aperta
    setOpenCardId               // stato per indicare la card aperta
  } = TravelDaysController();   // utilizzo il controller per ottenere la logica della pagina

  if (!travel) return <p className="text-center mt-8">⏳ Caricamento...</p>;

  return (
    <div className="min-h-screen bg-transparent sm:p-12 overflow-x-hidden px-2 sm:px-12 relative">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 max-w-6xl mx-auto gap-4">

        {/* Titolo */}
        <motion.h1
          className="text-3xl font-extrabold text-white text-center flex-1 min-w-[200px] p-3 rounded-3xl
          bg-linear-to-br from-white/20 via-white/10 to-transparent backdrop-blur-2xl 
          border border-white/40 shadow-lg"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}>
          Tappe del viaggio
        </motion.h1>
      </div>

      {/* Layout principale */}
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        
          {/* Info Viaggio + Aggiungi Tappa */}
          <motion.div
            className="p-4 rounded-3xl bg-linear-to-br from-white/20 via-white/10 to-transparent 
            backdrop-blur-2xl border border-white/40 shadow-xl"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              {/* Testo */}
              <div>
                <h2 className="text-2xl font-extrabold text-white drop-shadow-2xl">
                  {travel.town} - {travel.city}
                </h2>

                <p className="text-xl font-bold text-white drop-shadow-2xl mt-2">
                  {travel.start_date} <FontAwesomeIcon icon={faArrowRight} /> {travel.end_date}
                </p>

                {travel.title && (
                  <p className="text-white/60 italic border-t border-white/10 mt-2">
                    {travel.title}
                  </p>
                )}
              </div>

              {/* Pulsante Aggiungi Tappa */}
              <Link
                to="/addDay"
                state={{ travelId: id }}
                className="font-semibold px-6 py-2 flex items-center justify-center gap-2
                bg-linear-to-br from-green-600 to-teal-500 backdrop-blur-md border border-white/40
                text-white rounded-full shadow-md transition-all duration-300 hover:scale-105
                hover:shadow-[0_0_15px_rgba(255,255,255,0.30)] w-full sm:w-auto">
                <FontAwesomeIcon icon={faPlus} /> Aggiungi Tappa
              </Link>

            </div>
          </motion.div>


          {/* Lista Giorni */}
          <div className="flex-1 mt-6">

            {travel.days?.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-4 items-start"
                variants={{
                  visible: { transition: { staggerChildren: 0.2 } },
                }}
                initial="hidden"
                animate="visible"
                layout="position">

                {travel.days.map((d) => {
                  const isOpen = openCardId === d.id;

                  return (
                    <motion.div
                      key={d.id}
                      variants={{
                        hidden: { opacity: 0, scale: 0.5, y: 20 },
                        visible: { opacity: 1, scale: 1, y: 0 },
                      }}
                      animate={{
                        boxShadow: isOpen
                          ? "0px 0px 35px rgba(255,255,255,0.40)"
                          : "0px 0px 0px rgba(255,255,255,0)"
                      }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="group bg-linear-to-br from-white/20 via-white/10 to-transparent 
                      backdrop-blur-2xl border border-white/40 p-6 rounded-3xl shadow-xl
                      transition-all duration-300 w-full">

                      {/* Header card */}
                      <div className="flex justify-between items-center gap-3">
                        <div>
                          <p className="text-white font-extrabold text-2xl drop-shadow-xl">{d.title}</p>
                          <p className="text-white text-xl font-bold opacity-80 drop-shadow-md mt-2">{d.date}</p>
                        </div>

                        {/* Icona Freccia */}
                        <motion.button
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.4 }}
                          title={isOpen ? "Chiudi dettagli" : "Apri dettagli"}
                          className="cursor-pointer border border-white rounded-full w-12 h-12 
                          flex items-center justify-center text-white
                          transition-all duration-300 hover:bg-white hover:text-black"
                          onClick={() => setOpenCardId(isOpen ? null : d.id)}>
                          <FontAwesomeIcon icon={faArrowDown} />
                        </motion.button>
                      </div>

                      {/* FOTO PREVIEW */}
                      {d.photo.length > 0 && (
                        <div className="flex gap-2 flex-wrap mt-4">
                          {d.photo.slice(0, 2).map((p, i) => (
                            <img
                              key={i}
                              src={p}
                              className="w-24 h-24 object-cover rounded-2xl border border-white/40 shadow-md"
                            />
                          ))}
                        </div>
                      )}

                      {/* CONTENUTO ESPANSO */}
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4 }}
                            className="overflow-hidden">

                            {/* descrizione */}
                            {d.description && (
                              <p className="text-white mt-4 text-sm text-justify font-semibold">
                                {d.description.length > 100
                                  ? d.description.slice(0, 100) + "..."
                                  : d.description}
                              </p>
                            )}

                            {/* categorie */}
                            {d.categories && d.categories.length > 0 && (
                              <div className="mt-4 flex flex-wrap gap-2">

                                {/* prime 3 categorie */}
                                {d.categories.slice(0, 3).map((c, i) => (
                                  <span
                                    key={i}
                                    className="font-semibold px-3 py-1 text-sm rounded-full bg-linear-to-br from-blue-600 to-red-500 text-white">
                                    {c}
                                  </span>
                                ))}

                                {/* badge per categorie extra */}
                                {d.categories.length > 3 && (
                                  <span
                                    className="font-semibold px-3 py-1 text-sm rounded-full bg-linear-to-br from-blue-600 to-red-500 text-white italic">
                                    +{d.categories.length - 3}
                                  </span>
                                )}
                              </div>
                            )}


                            {/* BOTTONI */}
                            <div className="flex flex-col gap-4 mt-6">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedDay(d);
                                }}
                                className="font-semibold mx-2 px-4 py-2 flex items-center justify-center gap-2 
                                bg-linear-to-br from-blue-600 to-cyan-500 backdrop-blur-md border border-white/40 text-white 
                                rounded-full shadow-md transition-all duration-300 cursor-pointer hover:scale-105
                                hover:shadow-[0_0_15px_rgba(255,255,255,0.25)]">
                                <FontAwesomeIcon icon={faBookOpen} /> Leggi di più
                              </button>

                              <Link
                                to={`/days/${d.id}/edit`}
                                onClick={(e) => e.stopPropagation()}
                                className="font-semibold mx-2 px-4 py-2 flex items-center justify-center gap-2 
                                bg-linear-to-br from-orange-600 to-yellow-500 backdrop-blur-md border border-white/40 text-white 
                                rounded-full shadow-md transition-all duration-300 cursor-pointer hover:scale-105
                                hover:shadow-[0_0_15px_rgba(255,255,255,0.25)]">
                                <FontAwesomeIcon icon={faEdit} /> Modifica Tappa
                              </Link>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteDayId(d.id);
                                }}
                                className="font-semibold mx-2 px-4 py-2 flex items-center justify-center gap-2 
                                bg-linear-to-br from-red-600 to-rose-500 backdrop-blur-md border border-white/40 text-white 
                                rounded-full shadow-md transition-all duration-300 cursor-pointer hover:scale-105
                                hover:shadow-[0_0_15px_rgba(255,255,255,0.25)]">
                                <FontAwesomeIcon icon={faTrash} /> Cancella Tappa
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <p className="text-white/80 font-semibold text-center mt-6 italic">
                Nessuna tappa presente
              </p>
            )}
          </div>
      </div>

      {/* Modale Leggi di più */}
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
          bg-linear-to-r from-blue-600 to-orange-600 dark:from-slate-900 dark:to-slate-500">
          {message.icon === "success" && (
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-400 text-2xl mr-2" />
          )}
          {message.icon === "error" && (
            <FontAwesomeIcon icon={faXmarkCircle} className="text-red-400 text-2xl mr-2" />
          )}
          <p className="text-xl font-semibold">{message.text}</p>
        </motion.div>
      )}
    </div>
  );

}

export default TravelDays;
