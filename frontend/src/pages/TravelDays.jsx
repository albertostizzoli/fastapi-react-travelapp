import { Link } from "react-router-dom"; // importo Link per la navigazione interna
import { motion, AnimatePresence } from "framer-motion"; // importo framer-motion per le animazioni
import { FaArrowDown, FaArrowLeft, FaArrowRight, FaBookOpen, FaCheckCircle, FaEdit, FaPlus, FaTrash, FaTimesCircle } from "react-icons/fa"; // importo le icone necessarie
import DayInfoModal from "../components/Modals/DayInfoModal"; // importo il modale Scopri di più
import ModalDeleteDay from "../components/DeleteModals/ModalDeleteDay"; // importo il modale di conferma eliminazione tappa
import TravelDaysController from "../controllers/TravelDaysController"; // importo la logica della pagina TravelDays

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
    setOpenCardId,              // stato per indicare la card aperta
    selectedCity,               // indica la città selezionata
    setSelectedCity,            // stato per indicare la città selezionata
    allCities,                  // per prendere le città nella select
    filteredDays,               // funzione per filtrare in modo combinato le tappe in base a esperienze e città
    selectedExperience,         // indica l'esperienza selezionata
    setSelectedExperience,      // stato per indicare l'esperienza selezionata
    allExperiences,             // per prendere le esperienze nella select
  } = TravelDaysController();   // utilizzo il controller per ottenere la logica della pagina

  if (!travel) return <p className="text-center mt-8">⏳ Caricamento...</p>;


  return (
    <div className="min-h-screen bg-transparent sm:p-12 overflow-x-hidden px-2 sm:px-12 relative">

      {/* Header */}
      <motion.div className="relative flex flex-row items-center justify-between
        sm:flex-row sm:items-center mb-10 gap-4 flex-1 p-4 rounded-3xl
        bg-linear-to-br from-white/20 via-white/10 to-transparent
        backdrop-blur-2xl border border-white/40 shadow-xl"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}>

        {/* Pulsante Torna ai Viaggi */}
        <Link
          to="/travels"
          className="font-semibold px-6 py-2 inline-flex items-center justify-center gap-2
          bg-linear-to-br from-red-600 to-rose-500 backdrop-blur-md border border-white/40
        text-white rounded-full shadow-md transition-all duration-300 hover:scale-105
          hover:shadow-[0_0_15px_rgba(255,255,255,0.30)] w-fit">
          <FaArrowLeft size={20} /> Torna ai Viaggi
        </Link>

        {/* Titolo */}
        <h1 className="text-4xl font-extrabold text-white text-center
            md:absolute md:left-1/2 md:-translate-x-1/2">
          Le mie tappe
        </h1>
      </motion.div>

      {/* Layout principale */}
      <div className=" flex flex-col gap-8">

        {/* Select per Filtro Città + Info Viaggio + Aggiungi Tappa */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between 
        gap-4 p-6 rounded-3xl bg-linear-to-br from-white/20 via-white/10 to-transparent
        backdrop-blur-2xl border border-white/40 shadow-xl w-full">

          {/* Paese + Date */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}>

            { /* Paese */}
            <h2 className="text-3xl font-extrabold text-white drop-shadow-2xl mb-2">
              {travel.town}
            </h2>

            {/* Date */}
            <h2 className="text-2xl font-bold text-white drop-shadow-xl flex items-center">
              {travel.start_date}
              <FaArrowRight size={20} className="mx-2" />
              {travel.end_date}
            </h2>
          </motion.div>

          {/* Select Filtro Esperienze + Select Filtro Città + Pulsante Aggiungi Tappa */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col sm:flex-row sm:items-center">

            <div className="flex flex-row justify-between w-full sm:w-auto sm:justify-start sm:gap-4">

              {/* Select Filtro Esperienze */}
              <select
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="w-[48%] sm:w-56 px-4 py-2 font-semibold rounded-full bg-white/10 
                border border-white/40 text-white focus:ring-2 focus:ring-blue-300 focus:border-transparent 
                transition cursor-pointer scrollbar">
                <option value="" className="bg-blue-500 text-white dark:bg-slate-500">Tutte le Esperienze</option>
                {allExperiences.map(exp => (
                  <option key={exp} value={exp} className="bg-blue-500 text-white dark:bg-slate-500">{exp}</option>
                ))}
              </select>

              {/* Select Filtro Città */}
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-[48%] sm:w-56 px-4 py-2 font-semibold rounded-full bg-white/10 
                border border-white/40 text-white focus:ring-2 focus:ring-blue-300 focus:border-transparent 
                transition cursor-pointer scrollbar">
                <option value="" className="bg-blue-500 text-white dark:bg-slate-500">Tutte le Città</option>
                {allCities.map(city => (
                  <option key={city} value={city} className="bg-blue-500 text-white dark:bg-slate-500">{city}</option>
                ))}
              </select>
            </div>

            {/* Pulsante Aggiungi Tappa */}
            <Link
              to="/addDay"
              state={{ travelId: id }}
              className="font-semibold mt-3 sm:ms-3 sm:mt-0 px-6 py-2 inline-flex items-center justify-center gap-2
              bg-linear-to-br from-green-600 to-teal-500 backdrop-blur-md border border-white/40
            text-white rounded-full shadow-md transition-all duration-300 hover:scale-105
              hover:shadow-[0_0_15px_rgba(255,255,255,0.30)] w-full sm:w-56">
              <FaPlus size={20} /> Aggiungi Tappa
            </Link>
          </motion.div>
        </div>

        {/* Lista Giorni */}
        <div className="flex-1 mt-3">

          {travel.days?.length > 0 ? (
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-4 items-start"
              variants={{
                hidden: { opacity: 1 },
                visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
              }}
              initial="hidden"
              animate="visible">

              <AnimatePresence>
                {filteredDays.map((d) => {

                  const isOpen = openCardId === d.id; // questo mi permette di aprire una card e l'ultima si chiude automaticamente

                  return (
                    <motion.div
                      key={d.id}
                      variants={{
                        hidden: { scale: 0, opacity: 0 },
                        visible: { scale: 1, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
                      }}
                      exit={{ opacity: 0, scale: 0.9, y: 20 }}
                      style={{
                        boxShadow: isOpen
                          ? "0px 0px 35px rgba(255,255,255,0.40)"
                          : "0px 0px 0px rgba(255,255,255,0)",
                      }}
                      className="group bg-linear-to-br from-white/20 via-white/10 to-transparent 
                      backdrop-blur-2xl border border-white/40 p-6 rounded-3xl shadow-xl
                      transition-all duration-300">

                      {/* Città + Tappa + Date */}
                      <div className="flex justify-between items-center gap-3">
                        <div>
                          <p className="text-white font-extrabold text-2xl drop-shadow-xl">
                            {d.city},{" "}
                            {d.title?.length > 15 ? `${d.title.slice(0, 15)}...` : d.title}
                          </p>

                          <p className="text-white text-2xl font-bold opacity-80 drop-shadow-md mt-2">
                            {d.date}
                          </p>
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
                          <FaArrowDown size={20} />
                        </motion.button>
                      </div>

                      {/* FOTO PREVIEW */}
                      {d.photo.length > 0 && (
                        <div className="flex gap-2 flex-wrap mt-4">
                          {d.photo.slice(0, 3).map((p, i) => (
                            <img
                              key={i}
                              src={p}
                              className="w-28 h-28 object-cover rounded-2xl border border-white/40 shadow-md"
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
                              <p className="text-white mt-4 text-2sm text-justify font-semibold">
                                {d.description.length > 120
                                  ? d.description.slice(0, 120) + "..."
                                  : d.description}
                              </p>
                            )}

                            {/* esperienze */}
                            {d.experiences && d.experiences.length > 0 && (
                              <div className="mt-4 flex flex-wrap gap-2">

                                {/* prime 3 esperienze */}
                                {d.experiences.slice(0, 3).map((c, i) => (
                                  <span
                                    key={i}
                                    className="font-semibold px-4 py-2 backdrop-blur-md text-2sm rounded-full 
                                  bg-linear-to-br from-blue-600 to-red-500 text-white">
                                    {c}
                                  </span>
                                ))}

                                {/* badge per esperienze extra */}
                                {d.experiences.length > 3 && (
                                  <span
                                    className="font-semibold px-4 py-2 backdrop-blur-md text-2sm rounded-full 
                                  bg-linear-to-br from-blue-600 to-red-500 text-white italic">
                                    +{d.experiences.length - 3}
                                  </span>
                                )}
                              </div>
                            )}


                            {/* BOTTONI */}
                            <div className="flex flex-col lg:flex-row justify-center items-center gap-3 mt-7">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedDay(d);
                                }}
                                className="flex-1 w-full font-semibold mx-2 my-2 px-4 py-2 flex items-center justify-center gap-2 
                                bg-linear-to-br from-blue-600 to-cyan-500 backdrop-blur-md border border-white/40 text-white 
                                rounded-full shadow-md transition-all duration-300 cursor-pointer hover:scale-105
                                hover:shadow-[0_0_15px_rgba(255,255,255,0.25)]">
                                <FaBookOpen size={20} /> Leggi
                              </button>

                              <Link
                                to={`/days/${d.id}/edit`}
                                onClick={(e) => e.stopPropagation()}
                                className="flex-1 w-full font-semibold px-4 py-2 flex items-center justify-center gap-2 
                                bg-linear-to-br from-orange-600 to-yellow-500 backdrop-blur-md border border-white/40 text-white 
                                rounded-full shadow-md transition-all duration-300 cursor-pointer hover:scale-105
                                hover:shadow-[0_0_15px_rgba(255,255,255,0.25)]">
                                <FaEdit size={20} /> Modifica
                              </Link>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteDayId(d.id);
                                }}
                                className="flex-1 w-full font-semibold mx-2 my-2 px-4 py-2 flex items-center justify-center gap-2 
                                bg-linear-to-br from-red-600 to-rose-500 backdrop-blur-md border border-white/40 text-white 
                                rounded-full shadow-md transition-all duration-300 cursor-pointer hover:scale-105
                                hover:shadow-[0_0_15px_rgba(255,255,255,0.25)]">
                                <FaTrash size={20} /> Cancella
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
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
            <FaCheckCircle size={20} className="text-green-400 text-2xl mr-2" />
          )}
          {message.icon === "error" && (
            <FaTimesCircle size={20} className="text-red-400 text-2xl mr-2" />
          )}
          <p className="text-xl font-semibold">{message.text}</p>
        </motion.div>
      )}
    </div>
  );

}

export default TravelDays;
