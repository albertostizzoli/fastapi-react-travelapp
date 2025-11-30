import { Link } from "react-router-dom"; // importo il componente Link per la navigazione
import { motion } from "framer-motion"; // importo motion per le animazioni
import { FaArrowLeft, FaCamera, FaCheckCircle, FaBars, FaPlus, FaTimes, FaTimesCircle } from "react-icons/fa"; // importo le icone necessarie
import ModalAddCategory from "../components/Modals/ModalAddCategory"; // importo la modale per l'aggiunta delle categorie
import FormAddDay from "../controllers/FormAddDay"; // importo il controller personalizzato per la logica del form per aggiungere una tappa

function AddDay() {

  const {
    travels,             // Lista dei viaggi disponibili
    selectedTravel,      // Viaggio selezionato
    setSelectedTravel,   // Funzione per impostare il viaggio selezionato
    form,                // Stato del form
    setForm,             // Funzione per aggiornare lo stato del form
    handleChange,        // Gestore per i cambiamenti nei campi del form
    handlePhotoSelect,   // Funzione per aprire il selettore di file
    fileInputRef,        // Riferimento all'input file nascosto
    handleFileChange,    // Gestore per il cambiamento dei file selezionati
    removePhoto,         // Funzione per rimuovere una foto selezionata
    setQuery,            // Funzione per impostare la query di ricerca dei suggerimenti
    suggestions,         // Suggerimenti per il titolo basati sulla query
    setSuggestions,      // Funzione per impostare i suggerimenti
    isCategoryModalOpen, // Stato della modale delle categorie
    setIsCategoryModalOpen, // Funzione per impostare lo stato della modale delle categorie
    handleSubmit,        // Gestore per la sottomissione del form
    message,             // Messaggio di conferma o errore
    isUploading,         // Stato di caricamento durante l'upload
    uploadProgress,      // Percentuale di progresso dell'upload
    openImage,           // Immagine attualmente aperta in modale
    setOpenImage,        // Funzione per impostare l'immagine aperta in modale
  } = FormAddDay();      // Custom hook per la logica del form per aggiungere una tappa

  return (
    <motion.div
      className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-start bg-transparent sm:p-8 p-4 gap-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}>

      {/* Glow morbido dietro al form */}
      <div className="absolute -z-10 w-[90%] h-[90%] rounded-3xl bg-linear-to-br from-blue-900/30 via-blue-800/10 to-orange-900/20
       blur-3xl" />

      {/* Barra di caricamento durante upload */}
      {isUploading && (
        <div className="w-full max-w-4xl mb-6">
          {/* Percentuale testuale */}
          <div className="text-right text-white font-semibold mb-1">
            {uploadProgress}%
          </div>

          {/* Barra di caricamento */}
          <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-600 h-3 transition-all duration-300 ease-in-out"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="relative grid grid-cols-1 md:grid-cols-2 gap-8 rounded-3xl
        bg-linear-to-br from-white/20 via-white/10 to-transparent backdrop-blur-2xl
        p-6 w-full max-w-5xl border border-white/40 shadow-[inset_0_0_20px_rgba(255,255,255,0.1)] 
        overflow-hidden">

        {/* HEADER / INTESTAZIONE */}
        <div className="absolute top-0 left-0 w-full backdrop-blur-2xl bg-linear-to-r from-black/10 to-transparent 
              border-b border-white/20 px-6 py-4 rounded-t-3xl">
          <div className="relative flex sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
            <Link
              to={`/travels/${selectedTravel}/days`}
              className="font-semibold px-2 py-2 sm:px-4 sm:py-2 flex items-center justify-center gap-2 bg-linear-to-br from-red-600 to-rose-500 
              dark:from-red-600/70 dark:to-rose-500/70 backdrop-blur-md border border-white/40 text-white rounded-full cursor-pointer transition-all duration-300 ease-in-out 
              hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]">
              <FaArrowLeft size={20} />
              Torna alle Tappe
            </Link>

            <h2 className="text-2xl text-center font-extrabold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]
                sm:absolute md:left-1/2 md:-translate-x-1/2  sm:left-auto sm:translate-x-0">
              Aggiungi Tappa
            </h2>
          </div>
        </div>

        {/* COLONNA SINISTRA */}
        <div className="flex flex-col gap-6 mt-22 sm:mt-20"> {/* mt-20 per lasciare spazio all’intestazione */}

          <p className="text-white text-sm italic text-right">* Il campo è obbligatorio</p>

          {/* Viaggio */}
          <div>
            <label className="block font-bold text-white mb-2">Viaggio *</label>
            <select
              value={selectedTravel}
              onChange={(e) => setSelectedTravel(e.target.value)}
              className="w-full p-2 font-semibold border border-white/40 rounded-full bg-white/10 text-white placeholder-white/70 
              focus:ring-2 focus:ring-orange-400 dark:focus:ring-blue-400 focus:border-transparent transition"
              required>
              <option value="" className=" text-black">-- Seleziona --</option>
              {travels.map((t) => (
                <option key={t.id} value={t.id} className=" text-black">
                  {t.town} ({t.year})
                </option>
              ))}
            </select>
          </div>

          { /* Città */}
          <div>
            <label className="block font-bold text-white mb-2">Città *</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              required
              className="w-full p-2 font-semibold border border-white/40 rounded-full bg-white/10 text-white
               placeholder-white/70 focus:ring-2 focus:ring-orange-400 dark:focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          {/* Data */}
          <div>
            <label className="block font-bold text-white mb-2">Data *</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="w-full p-2 font-semibold border border-white/40 rounded-full bg-white/10 text-white
               placeholder-white/70 focus:ring-2 focus:ring-orange-400 dark:focus:ring-blue-400 focus:border-transparent 
               transition scheme-dark"
            />
          </div>

          {/* Titolo */}
          <div className="relative">
            <label className="block font-bold text-white mb-2">Titolo *</label>
            <input
              name="title"
              value={form.title}
              onChange={(e) => {
                const value = e.target.value;
                setForm((prev) => ({ ...prev, title: value }));
                setQuery(value);
              }}
              required
              className="w-full p-2 font-semibold border border-white/40 rounded-full bg-white/10 text-white 
              placeholder-white/70 focus:ring-2 focus:ring-orange-400 dark:focus:ring-blue-400 focus:border-transparent transition"
            />
            { /* Suggerimenti */}
            {suggestions.length > 0 && (
              <ul className="absolute bg-blue-500 dark:bg-slate-500 text-white backdrop-blur-3xl border border-white/40 w-full mt-1 
              shadow-lg rounded-xl z-10">
                {suggestions.map((s, i) => (
                  <li
                    key={i}
                    className="p-2 hover:bg-blue-400 cursor-pointer"
                    onClick={() => {
                      setForm((prev) => ({ ...prev, title: s.name }));
                      setSuggestions([]);
                    }}>
                    {s.name}, {s.city}, {s.country}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Descrizione */}
          <div>
            <label className="block font-bold text-white mb-2">Riassunto della giornata *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              className="w-full p-2 font-semibold border border-white/40 rounded-3xl bg-white/10 text-white 
              placeholder-white/70 focus:ring-2 focus:ring-orange-400 dark:focus:ring-blue-400 focus:border-transparent transition scrollbar"
              rows="4"
            />
          </div>
        </div>

        {/* DIVIDER VERTICALE (solo desktop) */}
        <div className="hidden md:block absolute left-1/2 top-20 bottom-6 w-0.5 bg-linear-to-b from-transparent via-white/40 to-transparent 
        rounded-full pointer-events-none" />

        {/* COLONNA DESTRA */}
        <div className="flex flex-col gap-6 justify-start sm:mt-20 scrollbar overflow-y-auto p-2">
          {/* Pulsanti principali */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <button
              type="button"
              onClick={() => setIsCategoryModalOpen(true)}
              className="w-full sm:w-auto font-semibold px-6 py-2 bg-linear-to-br from-orange-600 to-rose-500 dark:from-orange-600/70 dark:to-rose-500/70
              backdrop-blur-md border border-white/40 text-white rounded-full shadow-md transition-all duration-300 ease-in-out 
              hover:scale-105 cursor-pointer flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]">
              <FaBars size={20} /> Seleziona Esperienza
            </button>
            <button
              type="button"
              onClick={handlePhotoSelect}
              className="w-full sm:w-auto font-semibold px-6 py-2 bg-linear-to-br from-blue-600 to-cyan-500 dark:from-blue-600/70 dark:to-cyan-500/70 
              backdrop-blur-md border border-white/40 text-white rounded-full shadow-md transition-all duration-300 ease-in-out 
              hover:scale-105 cursor-pointer flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]">
              <FaCamera size={20} /> Carica Foto
            </button>
          </div>

          {/* esperienze selezionate */}
          {form.experiences.length > 0 && (
            <div className="mt-3 flex gap-3 w-full justify-center flex-wrap">
              {form.experiences.map((experience, i) => (
                <span
                  key={i}
                  className="flex items-center justify-between bg-linear-to-br from-blue-600 to-cyan-500 dark:from-blue-600/70 dark:to-cyan-500/70
                  backdrop-blur-md border border-white/40 text-white px-4 py-2 rounded-full text-base font-semibold 
                  shadow-md transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer">
                  <span>{experience}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        experiences: form.experiences.filter((c) => c !== experience),
                      })
                    }
                    className="ml-3 text-white hover:text-red-400 transition cursor-pointer">
                    <FaTimes size={20} className="text-sm" />
                  </button>
                </span>
              ))}
            </div>
          )}

          { /* Modale di Aggiunta delle Categorie */}
          <ModalAddCategory
            isOpen={isCategoryModalOpen}
            onClose={() => setIsCategoryModalOpen(false)}
            form={form}
            setForm={setForm}
          />

          {/* Foto */}
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-2">
              {form.photo.map((item, index) => {
                const src = typeof item === "string"
                  ? item.startsWith("http")
                    ? item
                    : `http://127.0.0.1:8000/${item}`
                  : URL.createObjectURL(item);
                return (
                  <div key={index} className="relative group">
                    <img
                      onClick={() => setOpenImage(src)}
                      src={src}
                      alt={`Foto ${index + 1}`}
                      className="w-full mt-3 h-32 object-cover rounded-3xl border border-white shadow-md cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 bg-red-600 hover:bg-red-500 text-white rounded-full p-1 opacity-0 
                      group-hover:opacity-100 transition">
                      <FaTimes size={20} />
                    </button>

                    { /* Modale Foto */}
                    {openImage && (
                      <div
                        onClick={() => setOpenImage(null)}
                        className="fixed inset-0 z-9999 flex items-center justify-center p-4">
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="relative w-full max-w-4xl mx-auto  bg-black/30 backdrop-blur-xl">
                          <button
                            onClick={() => setOpenImage(null)}
                            className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 shadow-lg 
                          hover:bg-red-400 transition cursor-pointer">
                            <FaTimes size={20} className="text-lg" />
                          </button>
                          <img
                            src={openImage.replace("w=400", "w=1600")}
                            alt="Immagine ingrandita"
                            className="w-full h-auto max-h-[70vh] object-contain rounded-xl shadow-xl"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              multiple
              style={{ display: "none" }}
            />
          </div>

          {/* Pulsante finale */}
          <div className="flex justify-end">
            <button
              type="submit"
              className=" w-full sm:w-auto font-semibold px-6 py-2 flex items-center justify-center gap-2 bg-linear-to-br from-green-600 to-teal-500 
              dark:from-green-600/70 dark:to-teal-500/70 backdrop-blur-md border border-white/40 text-white rounded-full cursor-pointer transition-all duration-300 ease-in-out 
              hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]">
              <FaPlus size={20} />
              Aggiungi Tappa
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

export default AddDay;
