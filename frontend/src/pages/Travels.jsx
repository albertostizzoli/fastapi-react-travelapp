import { Link } from "react-router-dom"; // importo Link per la navigazione interna
import { motion, AnimatePresence } from "framer-motion"; // importo framer-motion per le animazioni
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // importo FontAwesomeIcon per le icone
import { faArrowDown, faArrowRight, faCalendarDay, faCheckCircle, faEdit, faTrash, faXmarkCircle } from "@fortawesome/free-solid-svg-icons"; // importo le icone necessarie
import ModalDeleteTravel from "../components/DeleteModals/ModalDeleteTravel"; // importo il modale di conferma eliminazione viaggio
import TravelsController from "../hooks/TravelsController"; // importo la logica della pagina viaggi

function Travels() {

  const {
    travels,                 // lista dei viaggi
    deleteId,                // id del viaggio da eliminare
    setDeleteId,             // funzione per settare l'id del viaggio da eliminare
    handleDelete,            // funzione per eliminare il viaggio
    message,                 // messaggio di conferma o errore
    StarRating,              // funzione per visualizzare le stelle
    activeCard,              // mostra la card aperta
    setActiveCard            // stato per indicare la card aperta
  } = TravelsController();   // uso la logica della pagina viaggi

  return (
    <div className="relative min-h-screen p-8 overflow-visible text-gray-50">

      {/* Titolo */}
      <h1 className="text-3xl font-extrabold text-center text-gray-50/90 drop-shadow-md mb-3">
        I miei viaggi
      </h1>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-4 mx-auto items-start"
        layout="position" // siccome uso una grid questo impedisce alle card di avere la stessa altezza al click
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.2 } },
        }}>

        <AnimatePresence>
          {travels.map((v) => (
            <motion.div
              key={v.id}
              className="group relative bg-linear-to-br from-white/20 via-white/10 to-transparent 
              backdrop-blur-2xl border border-white/20 
              rounded-3xl shadow-lg overflow-hidden transition-all duration-500 
              hover:shadow-[0_0_30px_rgba(255,255,255,0.30)]"
              variants={{
                hidden: { scale: 0.9, y: 20, opacity: 0 },
                visible: { scale: 1, y: 0, opacity: 1 },
              }}
              initial="hidden"
              animate="visible"
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}>

              {/* Immagine */}
              {v.days && v.days[0]?.photo?.[0] && (
                <div className="relative overflow-hidden">
                  <img
                    src={v.days[0].photo[0]}
                    alt={`Foto di ${v.town}`}
                    className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110 group-hover:brightness-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-80"></div>
                </div>
              )}

              {/* Contenuto */}
              <div className="p-6 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-extrabold text-white drop-shadow-md">
                    {v.town} - {v.city}
                  </h2>
                  <h3 className="text-xl font-bold text-white drop-shadow-md">{v.year}</h3>
                </div>

                <div className="flex justify-between items-center gap-3">
                  <div>
                    <p className="text-gray-100 text-xl font-medium">
                      {v.start_date} <FontAwesomeIcon icon={faArrowRight} /> {v.end_date}
                    </p>
                  </div>
                  <motion.button
                    onClick={() => setActiveCard(activeCard === v.id ? null : v.id)}
                    animate={{ rotate: activeCard === v.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    title={activeCard ? "Chiudi dettagli" : "Apri dettagli"}
                    className="cursor-pointer border border-white rounded-full p-3 text-white
                    transition-all duration-300 hover:bg-white hover:text-black">
                    <FontAwesomeIcon icon={faArrowDown} />
                  </motion.button>
                </div>

                { /* Voti + Pulsanti della Card */}
                <AnimatePresence>
                  {activeCard === v.id && ( // card aperta e mostra i voti e i pulsanti 
                    <motion.div
                      layout="position"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20, height: 0 }}
                      transition={{ type: "spring", stiffness: 120, damping: 20 }}>

                      { /* Voti */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-white font-medium text-xl">Media voto:</span>
                        <span className="ms-2 flex items-center capitalize font-semibold"><StarRating rating={v.general_vote ?? 0} /></span>
                      </div>

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
                          bg-linear-to-br from-blue-600 to-cyan-500 backdrop-blur-md border border-white/40 text-gray-50/90 
                          rounded-full shadow-md transition-all duration-300 hover:scale-105
                          hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]">
                          <FontAwesomeIcon icon={faCalendarDay} className="mr-1" /> Tappe
                        </Link>

                        <Link
                          to={`/travels/${v.id}/edit`}
                          className="flex-1 w-full font-semibold px-4 py-2 flex justify-center items-center gap-2 whitespace-nowrap
                          bg-linear-to-br from-orange-600 to-yellow-500 backdrop-blur-md border border-white/40 text-gray-50/90 
                          rounded-full shadow-md transition-all duration-300 hover:scale-105
                          hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]">
                          <FontAwesomeIcon icon={faEdit} className="mr-1" /> Modifica
                        </Link>

                        <button
                          onClick={() => setDeleteId(v.id)}
                          className="flex-1 w-full font-semibold px-4 py-2 flex justify-center items-center gap-2 whitespace-nowrap
                          bg-linear-to-br from-red-600 to-rose-500 backdrop-blur-md border border-white/40 text-gray-50/90 
                          rounded-full shadow-md transition-all duration-300 cursor-pointer hover:scale-105
                          hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]">
                          <FontAwesomeIcon icon={faTrash} className="mr-1" /> Cancella
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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

export default Travels;
