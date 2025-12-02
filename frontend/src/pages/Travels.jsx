import { useRef, useEffect } from "react";
import { Link } from "react-router-dom"; // importo Link per la navigazione interna
import { motion, AnimatePresence } from "framer-motion"; // importo framer-motion per le animazioni
import { FaArrowDown, FaArrowLeft, FaArrowRight, FaRegImage, FaCalendarDay, FaCheckCircle, FaEdit, FaTrash, FaTimesCircle } from "react-icons/fa"; // importo le icone necessarie
import Select from "react-select";
import ModalDeleteTravel from "../components/DeleteModals/ModalDeleteTravel"; // importo il modale di conferma eliminazione viaggio
import TravelsController from "../controllers/TravelsController"; // importo la logica della pagina viaggi

function Travels() {

  const scrollRef = useRef(null); // mi permette di fare lo scroll del carosello
  const cardRefs = useRef({}); // oggetto per salvare i ref di tutte le card

  const {
    deleteId,                // id del viaggio da eliminare
    setDeleteId,             // funzione per settare l'id del viaggio da eliminare
    handleDelete,            // funzione per eliminare il viaggio
    message,                 // messaggio di conferma o errore
    StarRating,              // funzione per visualizzare le stelle
    activeCard,              // mostra la card aperta
    setActiveCard,           // stato per indicare la card aperta
    selectedYear,            // anno selezionato
    setSelectedYear,         // stato per selezionare un anno
    yearOptions,             // anni nella select convertiti in stringhe
    filteredTravels          // per filtrare i viaggi in base agli anni
  } = TravelsController();   // uso la logica della pagina viaggi

  // Effetto per lo scroll alla card aperta o in alto quando si chiude
  useEffect(() => {
    if (activeCard && cardRefs.current[activeCard]) {
      // scroll verso la card aperta
      cardRefs.current[activeCard].scrollIntoView({
        behavior: "smooth",
        bottom: 0,
      });
    } else if (activeCard === null) {
      // scroll verso l'alto dopo breve ritardo
      const timeout = setTimeout(() => {
        window.scrollIntoView({ top: 0, behavior: "smooth" });
      }, 350); // adatta 350ms alla durata della exit animation

      return () => clearTimeout(timeout);
    }
  }, [activeCard]);



  // Customizzazione della select
  const customStyles = {

    // CSS generale
    control: (provided) => ({
      ...provided,
      backgroundColor: 'rgba(255,255,255,0.1)', // bg-white/10
      borderRadius: '9999px',
      borderColor: 'rgba(255,255,255,0.25)',
      padding: '0.16rem',
      color: 'white',
      cursor: 'pointer'
    }),

    // CSS delle option
    option: (provided, state) => {
      const isDark = document.documentElement.classList.contains('dark'); // gestione cambio colore da modalità light a dark e viceversa
      return {
        ...provided,
        backgroundColor: state.isFocused
          ? (isDark ? '#475569' : '#1E40AF')   // hover: slate-600 (dark) o blu scuro (light)
          : (isDark ? '#64748B' : '#2563EB'),  // normale: slate-500 (dark) o blu (light)
        color: 'white',
        padding: '0.5rem 1rem',
        cursor: 'pointer',
      };
    },

    // CSS singola option
    singleValue: (provided) => ({
      ...provided,
      color: 'white',
    }),

    // CSS placeholder
    placeholder: (provided) => ({
      ...provided,
      color: 'white',
      opacity: 1
    }),

    // CSS menu
    menu: (provided) => {
      const isDark = document.documentElement.classList.contains('dark');
      return {
        ...provided,
        zIndex: 3000, // z-index alto per stare sopra le card
        backgroundColor: isDark ? "#334155" : "#1E3A8A", // slate-700 (dark) vs blu (light)
        borderRadius: '1rem', // bordo generale del menu
        overflow: 'hidden', // per non far uscire le rounded
      }
    },
    menuList: (provided) => ({
      ...provided,
      padding: 0,
      maxHeight: '200px',
      overflowY: 'auto',
    }),
  };

  // questo mi permette di vedere tutti i viaggi
  const yearOptionsWithAll = [
    { value: null, label: "Tutti i viaggi" },
    ...yearOptions
  ];


  return (
    <div className="relative min-h-screen p-8 overflow-visible">

      {/* Paese + Select */}
      <div className="relative flex sm:flex-row flex-col items-center justify-between
          mb-10 gap-4 p-4 rounded-3xl bg-linear-to-br from-white/20 via-white/10 to-transparent
          backdrop-blur-2xl border border-white/40 shadow-xl">

        {/* Paese */}
        <motion.h1 className="text-4xl font-extrabold text-white text-center relative
        sm:absolute md:left-1/2 md:-translate-x-1/2  sm:left-auto sm:translate-x-0"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}>
          I miei viaggi
        </motion.h1>

        {/* Select Anni */}
        <motion.div className="sm:ml-auto sm:w-auto w-full"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}>
          <Select
            value={selectedYear !== null ? { value: selectedYear, label: selectedYear.toString() } : null}
            onChange={(option) => setSelectedYear(option ? option.value : null)}
            options={yearOptionsWithAll}
            styles={customStyles}
            isSearchable={false}             // blocca la scrittura sulla select
            classNamePrefix="custom"         // prefisso per le classi generate (prende le classi custom dall'index.css)
            menuPortalTarget={document.body} // forza il menu sopra tutto
            menuPosition="fixed"             // posizione fissa per evitare overflow del container
            placeholder="Filtra per anni"
          />
        </motion.div>
      </div>

      {/* CAROSELLO DEI VIAGGI */}
      <div className="relative w-full mt-6 group overflow-x-hidden">

        {/* Frecce laterali (nascoste quando una card è aperta) */}
        {!activeCard && (
          <div className="absolute inset-0 pointer-events-none hidden lg:block">

            {/* Freccia sinistra */}
            <button
              onClick={() => scrollRef.current.scrollBy({ left: -450, behavior: "smooth" })}
              className="pointer-events-auto absolute left-0 top-1/2 -translate-y-1/2 z-20
              opacity-0 group-hover:opacity-100 transition-all duration-300
            bg-white/20 hover:bg-white backdrop-blur-xl cursor-pointer
            text-white hover:text-black border border-white/50
              w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
              <FaArrowLeft size={20} />
            </button>

            {/* Freccia destra */}
            <button
              onClick={() => scrollRef.current.scrollBy({ left: 450, behavior: "smooth" })}
              className="pointer-events-auto absolute right-0 top-1/2 -translate-y-1/2 z-20
              opacity-0 group-hover:opacity-100 transition-all duration-300
            bg-white/20 hover:bg-white backdrop-blur-xl cursor-pointer
            text-white hover:text-black border border-white/50
              w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
              <FaArrowRight size={20} />
            </button>
          </div>
        )}

        {/* LISTA SCORREVOLE */}
        <motion.div
          ref={scrollRef}
          className="flex items-start gap-6 overflow-x-auto no-scrollbar px-6 py-4 scroll-smooth snap-x snap-mandatory"
          variants={{
            hidden: { opacity: 1 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
          }}
          initial="hidden"
          animate="visible">

          <AnimatePresence>
            {filteredTravels.map((v) => {

              const isOpen = activeCard === v.id; // questo mi permette di aprire e chiudere una card alla volta

              return (
                <motion.div
                  key={v.id}
                  ref={(el) => (cardRefs.current[v.id] = el)} // assegno il ref 
                  className="min-w-[350px] sm:min-w-[460px] lg:min-w-[460px] snap-center
                  group relative bg-linear-to-br from-white/20 via-white/10 to-transparent 
                  backdrop-blur-2xl border border-white/20 rounded-3xl overflow-hidden shadow-xl
                  transition-all duration-300"
                  variants={{
                    hidden: { scale: 0, opacity: 0 },
                    visible: { scale: 1, opacity: 1, transition: { duration: 0.35, ease: "easeOut" } },
                  }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  style={{
                    boxShadow: isOpen
                      ? "0px 0px 35px rgba(255,255,255,0.40)"
                      : "0px 0px 0px rgba(255,255,255,0)",
                  }}>

                  {/* Immagine */}
                  {v.days && v.days[0]?.photo?.[0] ? (
                    <div className="relative overflow-hidden">
                      <img
                        src={v.days[0].photo[0]}
                        alt={`Foto di ${v.town}`}
                        className="w-full h-52 object-cover transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-80"></div>
                    </div>
                  ) : (
                    <div className="w-full h-52 bg-linear-to-br from-blue-200/40 to-orange-200/40 
                        dark:from-slate-700/40 dark:to-slate-600/40 flex flex-col items-center justify-center text-gray-100">
                      <FaRegImage className="text-4xl opacity-60" />
                      <span className="text-xl opacity-70">Nessuna Foto</span>
                    </div>
                  )}

                  {/* Contenuto */}
                  <div className="p-6 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <h2 className="text-3xl font-extrabold text-white drop-shadow-md">
                        {v.town}
                      </h2>
                      <h3 className="text-3xl font-extrabold text-white drop-shadow-md">{v.year}</h3>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between sm:items-center items-start gap-3 mt-2">
                      <div>
                        <p className="text-white sm:text-2xl text-xl font-semibold inline-flex items-center gap-2">
                          {v.start_date} <FaArrowRight size={20} /> {v.end_date}
                        </p>
                      </div>

                      <motion.button
                        onClick={() => setActiveCard(activeCard === v.id ? null : v.id)}
                        animate={{ rotate: activeCard === v.id ? 180 : 0 }}
                        transition={{ duration: 0.4 }}
                        title={activeCard ? "Chiudi dettagli" : "Apri dettagli"}
                        className="cursor-pointer border border-white rounded-full w-12 h-12 
                        flex items-center justify-center text-white
                        transition-all duration-300 hover:bg-white hover:text-black">
                        <FaArrowDown size={20} />
                      </motion.button>
                    </div>

                    {/* Contenuto della card aperta */}
                    <AnimatePresence>
                      {activeCard === v.id && (
                        <motion.div
                          layout="position"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20, height: 0 }}
                          transition={{ type: "spring", stiffness: 120, damping: 20 }}>

                          {/* Media voto */}
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-white font-semibold text-xl">Media voto:</span>
                            <span className="ms-2 flex items-center capitalize font-semibold text-white text-xl">
                              {v.general_vote ?? 0}
                            </span>
                          </div>

                          {/* Lista voti */}
                          {v.votes && (
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-2sm text-white mt-5">
                              {Object.entries(v.votes).map(([key, value]) => (
                                <li key={key} className="flex justify-between items-center font-semibold">
                                  <span className="capitalize">{key}:</span>
                                  <StarRating rating={value} />
                                </li>
                              ))}
                            </ul>
                          )}

                          {/* Pulsanti */}
                          <div className="flex flex-col lg:flex-row justify-center items-center gap-3 mt-7">
                            <Link
                              to={`/travels/${v.id}/days`}
                              className=" flex-1 w-full font-semibold px-4 py-2 flex justify-center items-center gap-2 whitespace-nowrap
                              bg-linear-to-br from-blue-600 to-cyan-500 dark:from-blue-600/70 dark:to-cyan-500/70
                              backdrop-blur-md border border-white/40 text-white 
                              rounded-full shadow-md transition-all duration-300 hover:scale-105
                              hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]">
                              <FaCalendarDay size={20} className="mr-1" /> Tappe
                            </Link>

                            <Link
                              to={`/travels/${v.id}/edit`}
                              className="flex-1 w-full font-semibold px-4 py-2 flex justify-center items-center gap-2 whitespace-nowrap
                              bg-linear-to-br from-orange-600 to-yellow-500 dark:form-orange-600/70 dark:to-yellow-500/70
                              backdrop-blur-md border border-white/40 text-white
                              rounded-full shadow-md transition-all duration-300 hover:scale-105
                              hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]">
                              <FaEdit size={20} className="mr-1" /> Modifica
                            </Link>

                            <button
                              onClick={() => setDeleteId(v.id)}
                              className="flex-1 w-full font-semibold px-4 py-2 flex justify-center items-center gap-2 whitespace-nowrap
                              bg-linear-to-br from-red-600 to-rose-500 dark:from-red-600/70 dark:to-rose-500/70
                              backdrop-blur-md border border-white/40 text-white 
                              rounded-full shadow-md transition-all duration-300 cursor-pointer hover:scale-105
                              hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]">
                              <FaTrash size={20} className="mr-1" /> Cancella
                            </button>
                          </div>

                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

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

export default Travels;
