import { Link } from "react-router-dom"; // importo Link per la navigazione interna
import { motion, AnimatePresence } from "framer-motion"; // importo framer-motion per le animazioni
import { FaArrowDown, FaArrowLeft, FaArrowRight, FaRegImage, FaBookOpen, FaCheckCircle, FaEdit, FaPlus, FaTrash, FaTimesCircle, FaEllipsisV } from "react-icons/fa"; // importo le icone necessarie
import CitySelect from "../components/Selects/CitySelect"; // importo il componente per la select delle città
import DaysExperiencesSelect from "../components/Selects/DaysExperiencesSelect"; // importo il componente per la select delle esperienze
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
    cityOptions,                // opzioni per la select delle città
    filteredDays,               // funzione per filtrare in modo combinato le tappe in base a esperienze e città
    selectedExperience,         // indica l'esperienza selezionata
    setSelectedExperience,      // stato per indicare l'esperienza selezionata
    experienceOptions,          // opzioni per la select delle esperienze
    scrollRef,                  // ref per lo scroll del carosello
    cardRefs,                   // ref per tutte le card
    scrollLeft,                 // funzione per scrollare a sinistra
    scrollRight,                // funzione per scrollare a destra
    heroImages,                 // tutte le immagini del carosello
    currentImage,               // immagine corrente dell'hero
    openMenuId,                 // apre il menù dropdown
    setOpenMenuId,              //  stato per indicare l'apertura del menù dropdown
    menuRef                     // mi permette di chiudere il menù dropdown cliccando ovunque nel DOM
  } = TravelDaysController();   // utilizzo il controller per ottenere la logica della pagina

  if (!travel) return <p className="text-center mt-8">⏳ Caricamento...</p>;

  return (
    <div className="min-h-screen bg-transparent mt-6 sm:mt-0 sm:p-12 overflow-x-hidden px-2 sm:px-12 relative">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full h-[260px] sm:h-80 rounded-t-3xl overflow-hidden shadow-2xl">

        {/* Immagine */}
        <AnimatePresence>
          <motion.div
            key={heroImages[currentImage]}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${heroImages[currentImage]})`,
            }}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1.05 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1.2 },
              scale: { duration: 8, ease: "easeOut" }
            }}
          />
        </AnimatePresence>

        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />

        {/* Titolo + Date */}
        <div className="relative z-10 h-full p-6 sm:p-10 sm:mt-0 mt-8">
          <div className="absolute bottom-32 left-1/2 -translate-x-1/2 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-2xl">
              {travel.town}
            </h1>

            <p className="mt-3 text-xl sm:text-2xl font-semibold text-white/90 flex justify-center items-center gap-2">
              {travel.start_date}
              <FaArrowRight />
              {travel.end_date}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Select Filtri + Aggiungi Tappa  */}
      <div className="p-6 rounded-b-3xl w-full bg-linear-to-br from-white/20 via-white/10 to-transparent
          backdrop-blur-2xl border border-white/40 shadow-xl">

        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full justify-between">

          { /* Select Filtro Esperienze e Filtro Città */}
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4">
            <DaysExperiencesSelect
              selectedExperience={selectedExperience}
              setSelectedExperience={setSelectedExperience}
              experienceOptions={experienceOptions}
            />

            <CitySelect
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              cityOptions={cityOptions}
            />
          </div>

          { /* Pulsante Aggiungi Tappa */}
          <Link
            to="/addDay"
            state={{ travelId: id }}
            className="font-semibold mt-4 sm:mt-0 px-4 py-2 inline-flex items-center justify-center gap-2
            bg-linear-to-br from-green-600 to-teal-500 dark:from-green-600/70 dark:to-teal-500/70
            backdrop-blur-md border border-white/40 text-white rounded-full shadow-md 
            transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.30)]
            w-full sm:w-56">
            <FaPlus size={20} /> Aggiungi Tappa
          </Link>
        </motion.div>
      </div>

      <div className=" mt-10 rounded-4xl p-6 lg:p-10 bg-linear-to-br from-blue-500/80 to-orange-500/80 dark:from-slate-900/80 dark:to-slate-500/80
        backdrop-blur-2xl border border-white/20 shadow-2xl">

        <div className="flex flex-col lg:flex-row gap-8">

          { /* Titolo Sinistra */}
          <div className="lg:w-1/4 flex flex-col justify-start">
            <div>
              <h2 className="text-white text-3xl lg:text-4xl font-extrabold drop-shadow-xl">
                Le tue tappe
              </h2>
              <p className="text-white/70 mt-3 text-sm lg:text-base font-medium">
                Un racconto giorno per giorno del tuo viaggio
              </p>
            </div>
          </div>

          <div className="lg:w-3/4 lg:pl-4">
            {/* Lista Giorni */}
            <div className="flex-1 mt-3">

              {travel.days?.length > 0 ? (
                <div className="relative w-full overflow-hidden group">

                  { /* Le freccie scompaiono quando una card è aperta */}
                  <div className={`hidden lg:block absolute inset-0 pointer-events-none ${openCardId ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}>
                    {/* FRECCIA SINISTRA */}
                    <button
                      onClick={scrollLeft}
                      className="pointer-events-auto absolute left-0 top-1/2 -translate-y-1/2 z-20
                      opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/20 hover:bg-white 
                      backdrop-blur-xl cursor-pointer text-white hover:text-black border border-white/50
                      w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
                      <FaArrowLeft size={20} />
                    </button>

                    {/* FRECCIA DESTRA */}
                    <button
                      onClick={scrollRight}
                      className="pointer-events-auto absolute right-0 top-1/2 -translate-y-1/2 z-20
                      opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/20 hover:bg-white 
                      backdrop-blur-xl cursor-pointer text-white hover:text-black border border-white/50
                      w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
                      <FaArrowRight size={20} />
                    </button>
                  </div>

                  {/* CAROSELLO */}
                  <motion.div
                    ref={scrollRef}
                    className={`flex gap-6 px-6 py-4 scroll-smooth snap-x snap-mandatory
                    ${openCardId ? "overflow-x-hidden" : "overflow-x-auto"}`} // questo impedisce lo scroll quando una card è aperta
                    style={{ scrollbarWidth: "none" }}
                    variants={{
                      hidden: { opacity: 1 },
                      visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
                    }}
                    initial="hidden"
                    animate="visible">

                    <AnimatePresence>
                      {filteredDays.map((d) => {

                        const isOpen = openCardId === d.id; // questo mi permette di aprire e chiudere la card una alla volta
                        const showActions = isOpen || openMenuId === d.id; // questo mi permette di vedere i 2 bottoni di apertura card e menù finchè la card rimane aperta

                        return (
                          <motion.div
                            key={d.id}
                            ref={(el) => (cardRefs.current[d.id] = el)} // assegno il ref 
                            variants={{
                              hidden: { scale: 0.7, opacity: 0 },
                              visible: { scale: 1, opacity: 1, transition: { duration: 0.35, ease: "easeOut" } },
                            }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="min-w-[410px] sm:min-w-[450px] lg:min-w-[450px]">

                            { /* CARD DELLE TAPPE */}
                            <motion.div
                              style={{
                                boxShadow: isOpen ? "0px 0px 25px rgba(255,255,255,0.30)" : "0px 0px 0px rgba(255,255,255,0)",
                              }}
                              className="group/day bg-linear-to-br from-white/20 via-white/10 to-transparent 
                              backdrop-blur-2xl border border-white/40 p-6 rounded-3xl shadow-xl
                              transition-all duration-300">

                              {/* Città + Tappa + Data */}
                              <div className="flex justify-between items-center">
                                {/* Info città, tappa, data */}
                                <div>
                                  <p className="text-white font-extrabold text-2xl drop-shadow-xl">
                                    {d.city},
                                  </p>
                                  <p className="text-white font-extrabold text-2xl drop-shadow-xl">
                                    {d.title?.length > 10 ? `${d.title.slice(0, 10)}...` : d.title}
                                  </p>
                                  <p className="text-white text-2xl font-bold opacity-80 drop-shadow-md mt-2">
                                    {d.date}
                                  </p>
                                </div>

                                {/* Pulsanti freccia + menu dropdown */}
                                <div className="relative w-24 h-12">
                                  {/* Freccia */}
                                  <motion.button
                                    animate={{ rotate: isOpen ? 180 : 0 }}
                                    transition={{ duration: 0.4 }}
                                    title={isOpen ? "Chiudi Anteprima Tappe" : "Apri Anteprima Tappe"}
                                    onClick={() => setOpenCardId(isOpen ? null : d.id)}
                                    className={`absolute right-15 top-0 w-12 h-12 cursor-pointer
                                    border border-white rounded-full flex items-center justify-center text-white
                                    transition-all duration-300 hover:bg-white hover:text-black
                                    opacity-0 group-hover/day:opacity-100
                                    ${showActions ? "opacity-100" : ""}`}> {/* finche la card è aperta il bottone rimane visibile */}
                                    <FaArrowDown size={20} />
                                  </motion.button>

                                  {/* Bottone menu */}
                                  <div
                                    ref={menuRef}  // con questo il menù dropdown si può chiudere ovunque nel DOM
                                    className={`absolute right-0 top-0 w-12 h-12 transition-opacity duration-300
                                    opacity-0 group-hover/day:opacity-100
                                    ${showActions ? "opacity-100" : ""}`}>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenMenuId(openMenuId === d.id ? null : d.id);
                                      }}
                                      className="w-12 h-12 cursor-pointer border border-white rounded-3xl
                                      flex items-center justify-center text-white 
                                      transition-all duration-300 hover:bg-white hover:text-black"
                                      title={openMenuId ? "Chiudi Menù" : "Apri Menù"}>
                                      <FaEllipsisV size={20} />
                                    </button>

                                    {/* Dropdown */}
                                    <AnimatePresence>
                                      {openMenuId === d.id && (
                                        <motion.div
                                          initial={{ opacity: 0, y: -10, scale: 0.98 }}
                                          animate={{ opacity: 1, y: 0, scale: 1 }}
                                          exit={{ opacity: 0, y: -10, scale: 0.98 }}
                                          transition={{ duration: 0.2 }}
                                          className="absolute right-0 top-14 w-50
                                          border border-white/30 rounded-xl shadow-xl overflow-hidden z-50">
                                          <Link
                                            to={`/days/${d.id}/edit`}
                                            onClick={(e) => e.stopPropagation()}
                                            className="font-semibold flex items-center gap-3 px-4 py-3 text-white
                                            bg-linear-to-br from-orange-600 to-yellow-500">
                                            <FaEdit /> Modifica Tappa
                                          </Link>

                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setDeleteDayId(d.id);
                                            }}
                                            className="font-semibold w-full flex items-center gap-3 px-4 py-3 text-white
                                            bg-linear-to-br from-red-600 to-rose-500 cursor-pointer">
                                            <FaTrash /> Cancella Tappa
                                          </button>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                </div>
                              </div>


                              {/* FOTO PREVIEW */}
                              {d.photo.length > 0 ? (
                                <div className="flex gap-2 mt-4">
                                  {d.photo.slice(0, 2).map((p, i) => (
                                    <img
                                      key={i}
                                      src={p}
                                      className="w-37 h-28 sm:w-48 object-cover rounded-2xl border border-white/40 shadow-md"
                                    />
                                  ))}
                                </div>
                              ) : (
                                <div className="flex gap-2 mt-4">
                                  {[1, 2].map((_, i) => (
                                    <div
                                      key={i}
                                      className="w-37 h-28 sm:w-45 rounded-2xl border border-white/40 shadow-md
                                      bg-linear-to-br from-blue-200/40 to-orange-200/40 dark:from-slate-700/40 dark:to-slate-600/40
                                      flex items-center justify-center text-white/70">
                                      <FaRegImage className="text-2xl" />
                                    </div>
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
                                    className="overflow-hidden" >

                                    {/* descrizione */}
                                    {d.description && (
                                      <p className="text-white mt-4 text-2sm text-justify font-semibold">
                                        {d.description.length > 120 ? d.description.slice(0, 120) + "..." : d.description}
                                      </p>
                                    )}

                                    {/* esperienze */}
                                    {d.experiences && d.experiences.length > 0 ? (
                                      <div className="mt-4 flex flex-wrap gap-2">

                                        {/* prime 3 esperienze */}
                                        {d.experiences.slice(0, 3).map((c, i) => (
                                          <span
                                            key={i}
                                            className="font-semibold px-4 py-2 backdrop-blur-md text-2sm rounded-full 
                                            bg-linear-to-br from-blue-600 to-red-500 dark:from-blue-600/70 dark:to-red-500/70 text-white">
                                            {c}
                                          </span>
                                        ))}

                                        {/* badge per esperienze extra */}
                                        {d.experiences.length > 3 && (
                                          <span
                                            className="font-semibold px-4 py-2 backdrop-blur-md text-2sm rounded-full 
                                            bg-linear-to-br from-blue-600 to-red-500 dark:from-blue-600/70 dark:to-red-500/70 text-white italic">
                                            +{d.experiences.length - 3}
                                          </span>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="mt-4 flex flex-wrap gap-2">
                                        <span
                                          className="font-semibold px-4 py-2 backdrop-blur-md rounded-full 
                                          bg-linear-to-br from-blue-200/40 to-orange-200/40 dark:from-slate-700/40 dark:to-slate-600/40 
                                          text-2sm text-white/70 italic">
                                          Nessuna esperienza
                                        </span>
                                      </div>
                                    )}

                                    {/* BOTTONI */}
                                    <div className="flex flex-col lg:flex-row justify-center items-center mt-5 px-3 py-3">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedDay(d);
                                        }}
                                        className="flex-1 w-full font-semibold px-4 py-2 flex justify-center items-center gap-2 whitespace-nowrap
                                        bg-linear-to-br from-blue-600 to-cyan-500 dark:from-blue-600/70 dark:to-cyan-500/70
                                        backdrop-blur-md border border-white/40 text-white cursor-pointer 
                                        rounded-full shadow-md transition-all duration-300 hover:scale-105
                                        hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]">
                                        <FaBookOpen size={20} /> Leggi
                                      </button>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </motion.div>
                </div>
              ) : (
                <p className="font-semibold text-center px-4 py-2 backdrop-blur-md rounded-full 
                  bg-linear-to-br from-blue-200/40 to-orange-200/40 dark:from-slate-700/40 dark:to-slate-600/40 
                  text-2sm text-white/70 italic">
                  Nessuna tappa presente
                </p>
              )}
            </div>
          </div>
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
        day={travel?.days.find(d => d.id === deleteDayId)} // trova la tappa dall'id
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