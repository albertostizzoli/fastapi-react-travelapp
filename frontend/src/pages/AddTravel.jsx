import { Link } from "react-router-dom"; // use Navigate serve per il reindirizzamento fra le pagine
import { motion } from "framer-motion"; // per le animazioni
import { FaArrowLeft, FaCheckCircle, FaPlus, FaTimesCircle } from "react-icons/fa"; // importo le icone necessarie
import FormAddTravel from "../controllers/FormAddTravel.jsx"; // controller per gestire il form di aggiunta viaggio

function AddTravel() {

  const {
    form,                   // stato del form
    handleChange,           // gestore cambiamenti input
    handleSubmit,           // gestore invio form
    calculateGeneralVote,   // calcolo media voti
    message                 // messaggio di conferma/errore
  } = FormAddTravel();      // uso il custom hook del form di aggiunta viaggio

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
        className="relative backdrop-blur-2xl rounded-3xl p-6 bg-linear-to-br from-white/20 via-white/10 to-transparent
        w-full max-w-5xl border border-white/40 shadow-[inset_0_0_20px_rgba(255,255,255,0.1)] grid grid-cols-1 md:grid-cols-2 gap-8 overflow-hidden">

        {/* INTESTAZIONE */}
        <div className="absolute top-0 left-0 w-full backdrop-blur-2xl bg-linear-to-r from-black/10 to-transparent 
            border-b border-white/20 px-6 py-4 rounded-t-3xl flex justify-between items-center">

          <Link
            to="/travels"
            className="font-semibold px-2 py-2 sm:px-4 sm:py-2 flex items-center justify-center gap-2 bg-linear-to-br from-red-600 to-rose-500 
            dark:from-red-600/70 dark:to-rose-500/70 backdrop-blur-md border border-white/40 text-white rounded-full cursor-pointer transition-all duration-300 ease-in-out 
            hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]">
            <FaArrowLeft size={20} />
            Torna ai Viaggi
          </Link>

          <h2 className="text-2xl text-center font-extrabold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]
            sm:absolute md:left-1/2 md:-translate-x-1/2 sm:left-auto sm:translate-x-0">
            Aggiungi Viaggio
          </h2>
        </div>

        {/* Divider verticale desktop */}
        <div className="hidden md:block absolute left-1/2 top-24 bottom-6 w-0.5 bg-linear-to-b from-transparent via-white/40 
            to-transparent rounded-full pointer-events-none" />

        {/* COLONNA SINISTRA */}
        <div className="flex flex-col gap-6 mt-22">

          <p className="text-sm italic text-white text-right">* Il campo è obbligatorio</p>
          {/* Paese */}
          <div>
            <label className="block font-bold text-white mb-2">Paese *</label>
            <input
              type="text"
              name="town"
              value={form.town}
              onChange={handleChange}
              required
              className="w-full font-semibold border border-white/40 rounded-full bg-white/10 text-white
              p-2 focus:ring-2 focus:ring-orange-400 dark:focus:ring-blue-400 focus:border-transparent transition"
            />
          </div>

          {/* Anno */}
          <div>
            <label className="block font-bold text-white mb-2">Anno *</label>
            <input
              type="number"
              name="year"
              value={form.year}
              onChange={handleChange}
              required
              className="w-full font-semibold border border-white/40 rounded-full bg-white/10 text-white p-2 
              focus:ring-2 focus:ring-orange-400 dark:focus:ring-blue-400 focus:border-transparent transition"
            />
          </div>

          {/* Data inizio */}
          <div>
            <label className="block font-bold text-white mb-2">Data Inizio *</label>
            <input
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              required
              className="w-full font-semibold border border-white/40 rounded-full bg-white/10 text-white p-2 
              focus:ring-2 focus:ring-orange-400 dark:focus:ring-blue-400 focus:border-transparent transition scheme-dark"
            />
          </div>

          {/* Data fine */}
          <div>
            <label className="block font-bold text-white mb-2">Data Fine *</label>
            <input
              type="date"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
              required
              className="w-full font-semibold border border-white/40 rounded-full bg-white/10 text-white p-2 
              focus:ring-2 focus:ring-orange-400 dark:focus:ring-blue-400 focus:border-transparent transition scheme-dark"
            />
          </div>
        </div>

        {/* COLONNA DESTRA */}
        <div className="flex flex-col gap-8 sm:mt-22">
          {/* Voti */}
          <div>
            <h3 className="font-bold mb-4 text-white text-center text-xl">Voti *</h3>
            <div className="flex flex-wrap justify-center gap-6">
              {["cibo", "relax", "prezzo", "attività", "paesaggio"].map((field) => (
                <div key={field} className="flex flex-col items-center">
                  <label className="capitalize mb-1 font-bold text-white text-center">{field}</label>
                  <input
                    type="number"
                    name={field}
                    min="1"
                    max="5"
                    value={form[field]}
                    onChange={handleChange}
                    className="w-20 font-semibold p-2 border border-white/40 bg-white/10 text-white rounded-full text-center 
                    focus:ring-2 focus:ring-orange-400 dark:focus:ring-blue-400 focus:border-transparent transition"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Media voto */}
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

          { /* Azione */}
          <div className="flex justify-end mt-6.5">
            <button
              type="submit"
              className="w-full sm:w-auto font-semibold px-6 py-2 flex items-center justify-center gap-2 bg-linear-to-br from-green-600 to-teal-500 
              dark:from-green-600/70 dark:to-teal-500/70 backdrop-blur-md border border-white/40 text-white rounded-full cursor-pointer transition-all duration-100 ease-in-out
              hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]">
              <FaPlus size={20} />
              Aggiungi Viaggio
            </button>
          </div>
        </div>
      </form>


      {/* Modale conferma */}
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
            <FaCheckCircle size={20} className="text-green-400 text-2xl mr-2" />
          )}
          {message.icon === "error" && (
            <FaTimesCircle size={20} className="text-red-400 text-2xl mr-2" />
          )}
          <p className="text-xl font-semibold">{message.text}</p>
        </motion.div>
      )}
    </motion.div>
  );

}

export default AddTravel;
