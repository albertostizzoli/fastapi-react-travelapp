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

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);

    if (newFiles.length > 0) {
      setDay((prevForm) => {
        const updatedPhotos = [...(prevForm.photo || []), ...newFiles];
        return { ...prevForm, photo: updatedPhotos };
      });
    }
    e.target.value = null; // reset input
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
      await axios.put(
        `http://127.0.0.1:8000/travels/${day.travelId}/days/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("✅ Tappa modificata!");

      // reindirizzo alla pagina delle tappe
      setTimeout(() => {
        setMessage(""); // fa sparire il modale
        navigate(`/travels/${day.travelId}/days`);
      }, 2000);
    } catch (error) {
      console.error("Errore nell'aggiornamento:", error);
      setMessage("❌ Errore durante la modifica della tappa.");
    }
  };

  if (loading) return <p>Caricamento...</p>;
  if (!day) return <p>Tappa non trovata</p>;

  return (
    <motion.div
      className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-start bg-transparent sm:p-8 p-4 gap-y-6"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 1.2 }}>

      {/* Glow morbido dietro al form */}
      <div className="absolute -z-10 w-[90%] h-[90%] rounded-3xl bg-white/10 blur-2xl" />

      <form
        onSubmit={handleSubmit}
        className="relative backdrop-blur-xl bg-gradient-to-br from-white/20 via-white/10 to-transparent rounded-3xl p-6 
        w-full max-w-4xl border border-white/30 shadow-[inset_0_0_20px_rgba(255,255,255,0.1)] grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* sfere animate */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute w-[28rem] h-[28rem] bg-gradient-to-br from-blue-500/20 to-cyan-400/10 rounded-full 
          blur-3xl top-10 left-10 animate-[pulse_6s_ease-in-out_infinite]" />
          <div className="absolute w-[32rem] h-[32rem] bg-gradient-to-br from-orange-400/20 to-pink-400/10 rounded-full
           blur-3xl bottom-10 right-10 animate-[pulse_6s_ease-in-out_infinite]" />
        </div>

        {/* Titolo + nota obbligatorio */}
        <div className="flex items-center justify-between md:col-span-2 mb-2">
          <h2 className="text-2xl font-bold text-white/90">✏️ Modifica Tappa</h2>
          <p className="text-sm italic text-white/90">* Il campo è obbligatorio</p>
        </div>

        {/* Data */}
        <div>
          <label className="block font-bold text-white/90 mb-2">Data *</label>
          <input
            type="text"
            name="date"
            value={day.date}
            onChange={handleChange}
            className="w-full font-semibold border border-white/30 rounded-full bg-white/10 text-white/90 placeholder-white/70 
            p-2 focus:ring-2 focus:ring-blue-300 focus:border-transparent transition"
          />
        </div>

        {/* Titolo */}
        <div>
          <label className="block font-bold text-white/90 mb-2">Titolo *</label>
          <input
            type="text"
            name="title"
            value={day.title}
            onChange={handleChange}
            className="w-full font-semibold border border-white/30 rounded-full bg-white/10 text-white/90 placeholder-white/70 
            p-2 focus:ring-2 focus:ring-blue-300 focus:border-transparent transition"
          />
        </div>

        {/* Divider */}
        <div className="md:col-span-2 border-t border-white/30 my-2"></div>

        {/* Descrizione */}
        <div className="md:col-span-2">
          <label className="block font-bold text-white/90 mb-2">Riassunto della giornata *</label>
          <textarea
            name="description"
            value={day.description}
            onChange={handleChange}
            rows="6"
            className="w-full font-semibold border border-white/30 rounded-3xl bg-white/10 text-white/90 p-3 placeholder-white/70 
            focus:ring-2 focus:ring-blue-300 focus:border-transparent transition scrollbar"
          />
        </div>

        {/* Divider */}
        <div className="md:col-span-2 border-t border-white/30 my-2"></div>

        {/* Pulsanti principali */}
        <div className="md:col-span-2 flex justify-between gap-4">
          <button
            type="button"
            onClick={() => setIsTagModalOpen(true)}
            className="font-semibold px-6 py-2 bg-gradient-to-r from-orange-500/60 to-rose-400/60 backdrop-blur-md border 
            border-white/20 text-white/90 rounded-full shadow-md transition-all duration-100 hover:scale-105 cursor-pointer 
            flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            <i className="fa-solid fa-list-check"></i> Seleziona Tag
          </button>

          <button
            type="button"
            onClick={handlePhotoSelect}
            className="font-semibold px-6 py-2 bg-gradient-to-r from-blue-500/60 to-cyan-400/60 backdrop-blur-md border 
            border-white/20 text-white/90 rounded-full shadow-md transition-all duration-300 hover:scale-105 cursor-pointer 
            flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            <i className="fa-solid fa-camera"></i> Carica Foto
          </button>
        </div>

        {/* Tag selezionati */}
        {day.tags.length > 0 && (
          <div className="md:col-span-2 mt-3 flex flex-wrap justify-center gap-3">
            {day.tags.map((tag, i) => (
              <span
                key={i}
                className="flex items-center justify-between bg-gradient-to-r from-blue-500/60 to-cyan-500/60 backdrop-blur-md 
                border border-white/20 text-white/90 px-4 py-2 rounded-full text-base font-semibold shadow-md transition 
                hover:scale-105 cursor-pointer">
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() =>
                    setDay({
                      ...day,
                      tags: day.tags.filter((c) => c !== tag),
                    })
                  }
                  className="ml-3 text-white/90 hover:text-red-400 transition">
                  <i className="fa-solid fa-xmark text-sm"></i>
                </button>
              </span>
            ))}
          </div>
        )}

        <ModalEditTag
          isOpen={isTagModalOpen}
          onClose={() => setIsTagModalOpen(false)}
          tags={day.tags}
          setTags={(newTags) => setDay({ ...day, tags: newTags })}
        />

        {/* Foto */}
        <div className="md:col-span-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
            {day.photo.map((item, index) => {
              const src =
                typeof item === "string"
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
                    className="w-full h-32 object-cover rounded-3xl border border-white shadow-md cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 bg-red-600 hover:bg-red-500 text-white/90 rounded-full p-1 
                    opacity-0 group-hover:opacity-100 transition">
                    <i className="fa-solid fa-xmark"></i>
                  </button>

                  {openImage && (
                    <div
                      onClick={() => setOpenImage(null)}
                      className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-md flex items-center justify-center p-4">
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-4xl mx-auto">
                        <button
                          onClick={() => setOpenImage(null)}
                          className="absolute -top-3 -right-3 bg-red-500 text-white/90 rounded-full p-2 shadow-lg 
                          hover:bg-red-400 transition cursor-pointer">
                          <i className="fa-solid fa-xmark text-lg"></i>
                        </button>
                        <img
                          src={openImage.replace("w=400", "w=1600")}
                          alt="Immagine ingrandita"
                          className="w-full h-auto max-h-[80vh] object-contain rounded-xl shadow-xl"
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

        {/* Divider */}
        <div className="md:col-span-2 border-t border-white/30 my-2"></div>

        {/* Pulsanti finali */}
        <div className="md:col-span-2 flex justify-between gap-2">
          <Link
            to={travelId ? `/travels/${travelId}/days` : `/travels`}
            className="font-semibold px-6 py-2 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500/60 to-rose-400/60 
            backdrop-blur-md border border-white/20 text-white/90 rounded-full cursor-pointer transition-all duration-100
            hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            <i className="fa-solid fa-arrow-left"></i>
            Torna alle Tappe
          </Link>
          <button
            type="submit"
            className="font-semibold px-6 py-2 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500/60 to-teal-400/60 
            backdrop-blur-md border border-white/20 text-white/90 rounded-full cursor-pointer transition-all duration-100 
            hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            <i className="fa-solid fa-edit"></i>
            Salva Modifiche
          </button>
        </div>
      </form>

      {/* Modale di conferma */}
      {message && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.5 }}
          className="fixed top-6 right-6 backdrop-blur-xl border border-white text-white/90 px-6 py-3 rounded-full shadow-lg z-[9999]">
          <p className="text-lg font-semibold">{message}</p>
        </motion.div>
      )}
    </motion.div>
  );

}

export default EditDay;
