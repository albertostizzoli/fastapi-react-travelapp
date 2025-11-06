import { Link } from "react-router-dom"; // per i link di navigazione
import { motion } from "framer-motion";  // per le animazioni
import ModalEditTag from "../components/Modals/ModalEditTag"; // modale per modificare i tag
import FormEditDay from "../hooks/FormEditDay"; // custom hook per la logica del form di modifica tappa

function EditDay() {

  const {
    day,                // dati del giorno
    setDay,             // funzione per aggiornare i dati del giorno
    loading,            // stato di caricamento
    handleChange,       // gestione cambiamento dei campi
    fileInputRef,       // riferimento all’input nascosto
    handlePhotoSelect,  // funzione per gestire la selezione della foto
    handleFileChange,   // gestione del cambiamento del file
    removePhoto,        // funzione per rimuovere una foto
    handleSubmit,       // gestione dell’invio del form
    openImage,          // stato per l’immagine aperta in modale
    setOpenImage,       // funzione per chiudere/aprire l’immagine in modale
    isTagModalOpen,     // stato per il modale dei tag
    setIsTagModalOpen,  // funzione per aprire/chiudere il modale dei tag
    isUploading,        // stato per il caricamento
    uploadProgress,     // stato per mostrare la barra di caricamento
    message,            // messaggio di successo o errore
    travelId,           // ID del viaggio per il link di ritorno
  } = FormEditDay();    // uso il custom hook per la logica del form di modifica tappa


  if (loading) return <p>Caricamento...</p>;
  if (!day) return <p>Tappa non trovata</p>;

  return (
    <motion.div
      className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-start bg-transparent sm:p-8 p-4 gap-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}>

      {/* Glow morbido dietro al form */}
      <div className="absolute -z-10 w-[90%] h-[90%] rounded-3xl bg-linear-to-br from-blue-900/30 via-blue-800/10 to-orange-900/20
       blur-3xl" />

      {/* Barra di caricamento */}
      {isUploading && (
        <div className="w-full max-w-4xl mb-4">
          <div className="text-right text-white font-semibold mb-1">
            {uploadProgress}%
          </div>
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
        className="relative grid grid-cols-1 md:grid-cols-2 gap-8 backdrop-blur-xl
        bg-linear-to-br from-blue-500/40 to-orange-500/30 dark:from-slate-900 dark:to-slate-500
        rounded-3xl p-6 w-full max-w-5xl border border-white/40 shadow-[inset_0_0_20px_rgba(255,255,255,0.1)] 
        overflow-hidden">

        {/* HEADER / INTESTAZIONE */}
        <div className="absolute top-0 left-0 w-full backdrop-blur-2xl bg-linear-to-r from-black/10 to-transparent 
            border-b border-white/20 px-6 py-4 rounded-t-3xl">

          <div className="flex justify-between items-center gap-4">
            <Link
              to={travelId ? `/travels/${travelId}/days` : `/travels`}
              className="font-semibold px-4 py-2 flex items-center justify-center gap-2 bg-linear-to-r from-red-600 to-rose-500 
              backdrop-blur-md border border-white/40 text-white rounded-full cursor-pointer transition-all duration-150 ease-in-out 
              hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]">
              <i className="fa-solid fa-arrow-left"></i>
              Torna alle Tappe
            </Link>

            <h2 className="text-2xl text-center font-extrabold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              Modifica Tappa
            </h2>

            <p className="text-white text-sm italic">* Il campo è obbligatorio</p>
          </div>
        </div>

        {/* COLONNA SINISTRA */}
        <div className="flex flex-col gap-6 mt-20"> {/* mt-20 per spazio intestazione */}
          {/* Data */}
          <div>
            <label className="block font-bold text-white mb-2">Data *</label>
            <input
              type="text"
              name="date"
              value={day.date}
              onChange={handleChange}
              className="w-full p-2 font-semibold border border-white/40 rounded-full bg-white/10 text-white placeholder-white/70 
              focus:ring-2 focus:ring-orange-400 dark:focus:ring-blue-400 focus:border-transparent transition"
            />
          </div>

          {/* Titolo */}
          <div>
            <label className="block font-bold text-white mb-2">Titolo *</label>
            <input
              type="text"
              name="title"
              value={day.title}
              onChange={handleChange}
              className="w-full p-2 font-semibold border border-white/40 rounded-full bg-white/10 text-white placeholder-white/70 
              focus:ring-2 focus:ring-orange-400 dark:focus:ring-blue-400 focus:border-transparent transition"
            />
          </div>

          {/* Descrizione */}
          <div>
            <label className="block font-bold text-white mb-2">Riassunto della giornata *</label>
            <textarea
              name="description"
              value={day.description}
              onChange={handleChange}
              rows="4"
              className="w-full p-2 font-semibold border border-white/40 rounded-3xl bg-white/10 text-white 
            placeholder-white/70 focus:ring-2 focus:ring-orange-400 dark:focus:ring-blue-400 focus:border-transparent transition scrollbar"
            />
          </div>
        </div>

        {/* DIVIDER VERTICALE (solo desktop) */}
        <div className="hidden md:block absolute left-1/2 top-20 bottom-6 w-0.5 bg-linear-to-b from-transparent via-white/40 to-transparent 
        rounded-full pointer-events-none" />

        {/* COLONNA DESTRA */}
        <div className="flex flex-col gap-6 justify-start sm:mt-20 scrollbar overflow-y-auto p-2">

          {/* Pulsanti principali */}
          <div className="flex justify-between gap-4">
            <button
              type="button"
              onClick={() => setIsTagModalOpen(true)}
              className="font-semibold px-6 py-2 bg-linear-to-r from-orange-600 to-rose-500 backdrop-blur-md 
              border border-white/40 text-white rounded-full shadow-md transition-all duration-100 ease-in-out 
              hover:scale-105 cursor-pointer flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]">
              <i className="fa-solid fa-list-check"></i> Seleziona Tag
            </button>

            <button
              type="button"
              onClick={handlePhotoSelect}
              className="font-semibold px-6 py-2 bg-linear-to-r from-blue-600 to-cyan-500 backdrop-blur-md 
              border border-white/40 text-white rounded-full shadow-md transition-all duration-100 ease-in-out 
              hover:scale-105 cursor-pointer flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]">
              <i className="fa-solid fa-camera"></i> Carica Foto
            </button>
          </div>

          {/* Tag selezionati */}
          {day.tags.length > 0 && (
            <div className="mt-3 flex gap-3 w-full justify-center flex-wrap">
              {day.tags.map((tag, i) => (
                <span
                  key={i}
                  className="flex items-center justify-between bg-linear-to-r from-blue-600 to-cyan-500
                  backdrop-blur-md border border-white/40 text-white px-4 py-2 rounded-full text-base font-semibold 
                  shadow-md transition-all duration-100 ease-in-out hover:scale-105 cursor-pointer">
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setDay({ ...day, tags: day.tags.filter((c) => c !== tag), })
                    }
                    className="ml-3 text-white hover:text-red-400 transition cursor-pointer">
                    <i className="fa-solid fa-xmark text-sm"></i>
                  </button>
                </span>
              ))}
            </div>
          )}

          { /* Modale di Modifica dei Tag */}
          <ModalEditTag
            isOpen={isTagModalOpen}
            onClose={() => setIsTagModalOpen(false)}
            tags={day.tags}
            setTags={(newTags) => setDay({ ...day, tags: newTags })}
          />

          {/* Foto */}
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-2">
              {day.photo.map((item, index) => {
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
                      <i className="fa-solid fa-xmark"></i>

                      { /* Modale Foto */}
                      {openImage && (
                        <div
                          onClick={() => setOpenImage(null)}
                          className="fixed inset-0 z-9999 flex items-center justify-center p-4">
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-4xl mx-auto bg-black/30 backdrop-blur-xl">
                            <button
                              onClick={() => setOpenImage(null)}
                              className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 shadow-lg 
                           hover:bg-red-400 transition cursor-pointer">
                              <i className="fa-solid fa-xmark text-lg"></i>
                            </button>
                            <img
                              src={openImage.replace("w=400", "w=1600")}
                              alt="Immagine ingrandita"
                              className="w-full h-auto max-h-[70vh] object-contain rounded-xl shadow-xl"
                            />
                          </div>
                        </div>
                      )}
                    </button>
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

          {/* Pulsante */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="font-semibold px-6 py-2 flex items-center justify-center gap-2 bg-linear-to-r from-green-600 to-teal-500 
              backdrop-blur-md border border-white/40 text-white rounded-full cursor-pointer transition-all duration-100 ease-in-out 
              hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]">
              <i className="fa-solid fa-edit"></i>
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
          className="fixed top-6 right-6 backdrop-blur-xl border border-white text-white px-6 py-3 
          rounded-full shadow-lg z-9999 bg-linear-to-r from-blue-500 to-orange-500 dark:from-slate-900 dark:to-slate-500">
          <p className="text-lg font-semibold">{message}</p>
        </motion.div>
      )}
    </motion.div>
  );

}

export default EditDay;
