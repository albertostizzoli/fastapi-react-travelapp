import { Link } from "react-router-dom"; // importo Link per la navigazione interna
import { motion } from "framer-motion"; // importo framer-motion per le animazioni
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // importo FontAwesomeIcon per le icone
import { faArrowLeft, faCheckCircle, faEdit, faXmarkCircle } from "@fortawesome/free-solid-svg-icons"; // importo le icone necessarie
import FormEditTravel from "../controllers/FormEditTravel"; // importo la logica del form di modifica viaggio

function EditTravel() {

  const {
    travel,                  // dati del viaggio
    handleChange,            // gestore cambiamenti input
    handleVoteChange,        // gestore cambiamenti voti
    calculateGeneralVote,    // calcolo media voti
    handleSubmit,            // gestore invio form
    message                  // messaggio di conferma/errore
  } = FormEditTravel();      // uso il custom hook del form di modifica viaggio

  if (!travel) return <p className="text-center">Caricamento...</p>;

  return (
    <motion.div
      className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-start bg-transparent sm:p-8 p-4 gap-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}>

      {/* Glow morbido dietro al form */}
      <div className="absolute -z-10 w-[90%] h-[90%] rounded-3xl bg-linear-to-br from-blue-900/30 via-blue-800/10 to-orange-900/20
       blur-3xl" />

      <form
        onSubmit={handleSubmit}
        className="relative bg-linear-to-br from-white/20 via-white/10 to-transparent backdrop-blur-2xl
        rounded-3xl p-6 w-full max-w-5xl border border-white/40 shadow-[inset_0_0_20px_rgba(255,255,255,0.1)] grid grid-cols-1 md:grid-cols-2 
        gap-8 overflow-hidden">

        {/* INTESTAZIONE */}
        <div className="absolute top-0 left-0 w-full backdrop-blur-2xl bg-linear-to-r from-black/10 to-transparent 
          border-b border-white/20 px-6 py-4 rounded-t-3xl flex justify-between items-center">

          <Link
            to="/travels"
            className="font-semibold px-4 py-2 flex items-center justify-center gap-2 bg-linear-to-br from-red-600 to-rose-500 
            backdrop-blur-md border border-white/40 text-white rounded-full cursor-pointer transition-all duration-300 ease-in-out 
            hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]">
            <FontAwesomeIcon icon={faArrowLeft} />
            Torna ai Viaggi
          </Link>

          <h2 className="text-2xl font-extrabold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] text-center">
            Modifica Viaggio
          </h2>

          <p className="text-sm italic text-white/90">* Il campo è obbligatorio</p>
        </div>

        {/* Divider verticale desktop */}
        <div className="hidden md:block absolute left-1/2 top-24 bottom-6 w-0.5 bg-linear-to-b from-transparent via-white/40 
          to-transparent rounded-full pointer-events-none" />

        {/* COLONNA SINISTRA */}
        <div className="flex flex-col gap-6 mt-24">
          {/* Paese */}
          <div>
            <label className="block font-bold text-white mb-2">Paese *</label>
            <input
              type="text"
              name="town"
              value={travel.town}
              onChange={handleChange}
              className="w-full p-2 font-semibold border border-white/40 rounded-full bg-white/10 text-white placeholder-white/70 
              focus:ring-2 focus:ring-orange-400 dark:focus:ring-blue-400 focus:border-transparent transition"
            />
          </div>

          {/* Anno */}
          <div>
            <label className="block font-bold text-white mb-2">Anno *</label>
            <input
              type="number"
              name="year"
              value={travel.year}
              onChange={handleChange}
              className="w-full p-2 font-semibold border border-white/40 rounded-full bg-white/10 text-white placeholder-white/70 
              focus:ring-2 focus:ring-orange-400 dark:focus:ring-blue-400 focus:border-transparent transition"
            />
          </div>

          {/* Data Inizio */}
          <div>
            <label className="block font-bold text-white mb-2">Data Inizio *</label>
            <input
              type="text"
              name="start_date"
              value={travel.start_date}
              onChange={handleChange}
              className="w-full p-2 font-semibold border border-white/40 rounded-full bg-white/10 text-white placeholder-white/70 
              focus:ring-2 focus:ring-orange-400 dark:focus:ring-blue-400 focus:border-transparent transition "
            />
          </div>

          {/* Data Fine */}
          <div>
            <label className="block font-bold text-white mb-2">Data Fine *</label>
            <input
              type="text"
              name="end_date"
              value={travel.end_date}
              onChange={handleChange}
              className="w-full p-2 font-semibold border border-white/40 rounded-full bg-white/10 text-white placeholder-white/70 
              focus:ring-2 focus:ring-orange-400 dark:focus:ring-blue-400 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* COLONNA DESTRA */}
        <div className="flex flex-col gap-8 sm:mt-24">
          {/* Voti */}
          <div>
            <h3 className="font-bold mb-4 text-white text-center text-xl">Voti *</h3>
            <div className="flex flex-wrap justify-center gap-6">
              {Object.entries(travel.votes).map(([key, value]) => (
                <div key={key} className="flex flex-col items-center">
                  <label className="capitalize mb-1 font-bold text-white text-center">{key}</label>
                  <input
                    type="number"
                    name={key}
                    min="1"
                    max="5"
                    value={value}
                    onChange={handleVoteChange}
                    className="w-20 p-2 font-semibold border border-white/40 rounded-full bg-white/10 text-white 
                    text-center focus:ring-2 focus:ring-orange-400 dark:focus:ring-blue-400 focus:border-transparent transition"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Media Voti */}
          <div className="flex justify-center">
            <div className="flex flex-col items-center">
              <label className="font-bold text-white mb-1">Media Voti</label>
              <input
                type="text"
                value={calculateGeneralVote() ?? "-"}
                readOnly
                className="w-20 p-2 font-semibold border border-white/40 bg-white/10 text-white rounded-full text-center"
              />
            </div>
          </div>

          {/* Pulsanti */}
          <div className="flex justify-end mt-20 gap-4">

            <button
              type="submit"
              className="font-semibold px-6 py-2 flex items-center justify-center gap-2 bg-linear-to-br from-green-600 to-teal-500 
              backdrop-blur-md border border-white/40 text-white rounded-full cursor-pointer transition-all duration-300 ease-in-out 
              hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]">
              <FontAwesomeIcon icon={faEdit} />
              Salva Modifiche
            </button>
          </div>
        </div>
      </form>

      {/* Modale di conferma */}
      {message && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.5 }}
          className="fixed top-6 right-6 flex items-center gap-3 backdrop-blur-lg 
          border border-white/40 text-white px-6 py-3 rounded-full shadow-xl z-9999
          bg-linear-to-br from-blue-600 to-orange-600 dark:from-slate-900 dark:to-slate-500">
          {message.icon === "success" && (
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-400 text-2xl mr-2" />
          )}
          {message.icon === "error" && (
            <FontAwesomeIcon icon={faXmarkCircle} className="text-red-400 text-2xl mr-2" />
          )}
          <p className="text-xl font-semibold">{message.text}</p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default EditTravel;
