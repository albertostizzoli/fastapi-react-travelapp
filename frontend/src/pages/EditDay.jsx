import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import ModalEditTag from "../components/Modals/ModalEditTag";

function EditDay() {
  const { id } = useParams();   // recupero l'ID del giorno dall'URL
  const navigate = useNavigate(); // hook per navigare fra le pagine
  const [day, setDay] = useState(null); // per salvare i dati del giorno
  const [message, setMessage] = useState(""); // messaggio di successo o errore
  const [loading, setLoading] = useState(true); // stato di caricamento
  const fileInputRef = useRef(null); // riferimento all’input nascosto
  const [openImage, setOpenImage] = useState(null); // stato per l'immagine ingrandita (Apri / Chiudi)
  const [isTagModalOpen, setIsTagModalOpen] = useState(false); // apre / chiude il modale dei tags
  const [isUploading, setIsUploading] = useState(false); // stato per il caricamento
  const [uploadProgress, setUploadProgress] = useState(0); // stato per mostare la barra di caricamento
  const location = useLocation();
  const travelId = location.state?.travelId || day?.travelId; // uso location per tornare alle tappe

  const token = localStorage.getItem("token"); // prendo il token dal LocalStorage

  // recupero i dati del giorno dal backend
  useEffect(() => {
    const fetchDay = async () => {
      try {
        // recupera tutti i viaggi dell'utente
        const res = await axios.get(`http://127.0.0.1:8000/travels?user_id=${localStorage.getItem("userId")}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // cerca il giorno con l'id giusto
        let foundDay = null;
        res.data.forEach((travel) => {
          const d = travel.days.find((day) => day.id === parseInt(id));
          if (d) foundDay = { ...d, travelId: travel.id }; // aggiungi travelId
        });

        setDay(foundDay);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchDay();
  }, [id, token]);

  // gestione cambiamento dei campi
  const handleChange = (e) => {
    const { name, value } = e.target; // prendo il nome e il valore del campo
    setDay({ ...day, [name]: value }); // aggiorno lo stato del giorno
  };

  // Funzione per gestire la selezione della foto
  const handlePhotoSelect = () => {
    fileInputRef.current.click(); // simula il click sull’input file nascosto
  };

  // Ridimensiona e comprime le immagini prima dell'upload
  const resizeImage = (file, maxWidth = 1024, maxHeight = 1024) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        let { width, height } = img;
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            const resizedFile = new File([blob], file.name, { type: file.type });
            resolve(resizedFile);
          },
          file.type,
          0.5
        );
      };
    });
  };

  const handleFileChange = async (e) => {
    const newFiles = Array.from(e.target.files);
    if (newFiles.length === 0) return;

    try {
      // Ridimensiona tutte le immagini in parallelo
      const resizedFiles = await Promise.all(newFiles.map(file => resizeImage(file)));

      setDay((prevDay) => {
        const updatedPhotos = [...(prevDay.photo || []), ...resizedFiles];
        return { ...prevDay, photo: updatedPhotos };
      });
    } catch (error) {
      console.error("Errore nel ridimensionamento immagini:", error);
    } finally {
      e.target.value = null; // reset input
    }
  };


  // rimuovi foto
  const removePhoto = (index) => {
    const newPhotos = day.photo.filter((_, i) => i !== index); // filtro l'array delle foto per rimuovere quella all'indice specificato
    setDay({ ...day, photo: newPhotos }); // aggiorno lo stato del giorno
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("date", day.date);
    formData.append("title", day.title);
    formData.append("description", day.description);

    // aggiungo tutti i tags
    day.tags.forEach((tag) => {
      formData.append("tags", tag);
    });

    // foto già esistenti
    (day.photo || []).forEach((item) => {
      if (typeof item === "string") {
        formData.append("existing_photos", item);
      } else {
        formData.append("photos", item);
      }
    });

    try {
      // Attiva la barra di caricamento
      setIsUploading(true);
      setUploadProgress(0);

      await axios.put(
        `http://127.0.0.1:8000/travels/${day.travelId}/days/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentCompleted);
            }
          },
        }
      );
      setMessage("✅ Tappa modificata!");
      setIsUploading(false);

      // reindirizzo alla pagina delle tappe
      setTimeout(() => {
        setMessage(""); // fa sparire il modale
        navigate(`/travels/${day.travelId}/days`);
      }, 2000);
    } catch (error) {
      console.error("Errore nell'aggiornamento:", error);
      setMessage("❌ Errore durante la modifica della tappa.");
      setIsUploading(false);
    }
  };

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
        className="relative grid grid-cols-1 md:grid-cols-2 gap-8 backdrop-blur-xl bg-linear-to-br from-white/20 via-white/10 
        to-transparent rounded-3xl p-6 w-full max-w-5xl border border-white/40 shadow-[inset_0_0_20px_rgba(255,255,255,0.1)] 
        overflow-hidden">

        {/* Effetto sfondo */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute w-md h-112 bg-linear-to-br from-blue-500/20 to-orange-400/10 rounded-full 
              blur-3xl top-10 left-10" />
          <div className="absolute w-lg h-128 bg-linear-to-br from-orange-500/20 to-blue-400/10 rounded-full 
              blur-3xl bottom-10 right-10" />
        </div>

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
              focus:ring-2 focus:ring-orange-300 focus:border-transparent transition"
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
              focus:ring-2 focus:ring-orange-300 focus:border-transparent transition"
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
            placeholder-white/70 focus:ring-2 focus:ring-orange-300 focus:border-transparent transition scrollbar"
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
          rounded-full shadow-lg z-9999  bg-linear-to-r from-blue-500 to-orange-500">
          <p className="text-lg font-semibold">{message}</p>
        </motion.div>
      )}
    </motion.div>
  );

}

export default EditDay;
