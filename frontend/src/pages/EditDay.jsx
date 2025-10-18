import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import travellers from "../store/travellers";

function EditDay() {
  const { id } = useParams();   // recupero l'ID del giorno dall'URL
  const navigate = useNavigate(); // hook per navigare fra le pagine
  const [day, setDay] = useState(null); // per salvare i dati del giorno
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

      // aggiorna la pagina dei giorni
      navigate(`/travels/${day.travelId}/days`);
    } catch (error) {
      console.error("Errore nell'aggiornamento:", error);
      setMessage("❌ Errore durante la modifica del giorno.");
    }
  };

  if (loading) return <p>Caricamento...</p>;
  if (!day) return <p>Tappa non trovata</p>;


  return (
    <motion.div className="flex items-center justify-center bg-transparent sm:p-8 p-4 min-h-screen"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 1.5 }}>
      <form onSubmit={handleSubmit} className="backdrop-blur-xl shadow-lg rounded-3xl p-6 w-full max-w-4xl border border-white grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Titolo + nota obbligatorio */}
        <div className="flex items-center justify-between md:col-span-2 mb-4">
          <h2 className="text-2xl font-bold text-white">✏️ Modifica Tappa</h2>
          <p className="text-sm italic text-white">* Il campo è obbligatorio</p>
        </div>

        {/* Data */}
        <div className="md:col-span-1">
          <label className="block font-bold text-white mb-1">Data *</label>
          <input
            type="text"
            name="date"
            value={day.date}
            onChange={handleChange}
            className="w-full font-semibold border border-white text-white rounded-full p-2" />
        </div>

        {/* Titolo */}
        <div className="md:col-span-1">
          <label className="block font-bold text-white mb-1">Titolo *</label>
          <input
            type="text"
            name="title"
            value={day.title}
            onChange={handleChange}
            className="w-full font-semibold border border-white text-white rounded-full p-2" />
        </div>

        {/* Descrizione */}
        <div className="md:col-span-2">
          <label className="block font-bold text-white mb-1">Riassunto della giornata *</label>
          <textarea
            name="description"
            value={day.description}
            onChange={handleChange}
            className="w-full font-semibold border border-white text-white rounded-2xl p-2 scrollbar"
            rows="6" />
        </div>

        {/* Pulsanti principali: Seleziona categorie + Carica foto */}
        <div className="md:col-span-2 flex flex-wrap gap-4">
          {/* Pulsante categorie */}
          <button
            type="button"
            onClick={() => setIsTagModalOpen(true)}
            className="font-semibold flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-400 text-white rounded-full shadow-md transition hover:scale-105 cursor-pointer flex items-center justify-center gap-2">
            <i className="fa-solid fa-list-check"></i> Seleziona Tag
          </button>

          {/* Pulsante foto */}
          <button
            type="button"
            onClick={handlePhotoSelect}
            className="font-semibold flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-full shadow-md transition hover:scale-105 cursor-pointer flex items-center justify-center gap-2">
            <i className="fa-solid fa-camera"></i> Carica Foto
          </button>
        </div>


        {/* Mostra i tags selezionati */}
        {day.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3 w-full">
            {day.tags.map((tag, i) => (
              <span
                key={i}
                className="flex items-center justify-between bg-blue-600 text-white px-4 py-2 rounded-full text-base font-semibold shadow-md transition-transform hover:scale-105 cursor-pointer">
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() =>
                    setDay({
                      ...day,
                      tags: day.tags.filter((c) => c !== tag),
                    })
                  }
                  className="ml-3 text-white hover:text-red-400 transition cursor-pointer">
                  <i className="fa-solid fa-xmark text-sm"></i>
                </button>
              </span>
            ))}
          </div>
        )}


        {/* Modale Categorie */}
        <AnimatePresence>
          {isTagModalOpen && (
            <motion.div
              className="fixed inset-0 z-[9999] flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}>
              <motion.div
                className="bg-blue-500 rounded-3xl shadow-2xl p-6 w-[90%] max-w-4xl overflow-y-auto max-h-[75vh] border border-white flex flex-col"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}>

                <h2 className="text-white text-2xl font-bold mb-6 text-center">
                  🏷️ Cambia i tuoi Tag per la Tappa del tuo Viaggio
                </h2>

                <div className="space-y-6 flex-1 overflow-y-auto pr-2 scrollbar">
                  {travellers.map((cat) => (
                    <div key={cat.category}>
                      <h3 className="text-lg font-semibold text-white mb-2">{cat.category}</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {cat.experiences.map((experience) => (
                          <label
                            key={experience}
                            className={`font-semibold flex items-center justify-center text-center px-3 py-2 border rounded-full cursor-pointer text-sm transition-all ${day.tags.includes(experience)
                              ? "bg-blue-700 border-white text-white shadow-md"
                              : "bg-white text-black border-gray-300 hover:bg-blue-100"
                              }`}>
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={day.tags.includes(experience)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setDay({
                                    ...day,
                                    tags: [...day.tags, experience],
                                  });
                                } else {
                                  setDay({
                                    ...day,
                                    tags: day.tags.filter(
                                      (c) => c !== experience
                                    ),
                                  });
                                }
                              }}
                            />
                            <span>{experience}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setIsTagModalOpen(false)}
                    className="font-semibold px-4 py-2 bg-green-500 hover:bg-green-400 text-white rounded-full transition hover:scale-105 cursor-pointer">
                    Conferma
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsTagModalOpen(false)}
                    className="font-semibold px-4 py-2 bg-red-500 hover:bg-red-400 text-white rounded-full transition hover:scale-105 cursor-pointer">
                    Chiudi
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>


        {/* Foto */}
        <div className="md:col-span-2">
          {/* Foto esistenti + nuove foto */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
            {day.photo.map((item, index) => {
              // se è una stringa, è un URL dal DB
              const src =
                typeof item === "string"
                  ? item.startsWith("http")
                    ? item
                    : `http://127.0.0.1:8000/${item}`
                  // se è un File (nuova foto)
                  : URL.createObjectURL(item);

              // visualizzo le foto
              return (
                <div key={index} className="relative group">
                  <img
                    onClick={() => setOpenImage(src)} // apri immagine cliccata
                    src={src}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-32 object-cover rounded-3xl border border-white shadow-md cursor-pointer"
                  />

                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 bg-red-600 hover:bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition">
                    <i className="fa-solid fa-xmark"></i>
                  </button>

                  {/* Modale Foto Ingrandita */}
                  {openImage && (
                    <div
                      onClick={() => setOpenImage(null)}
                      className="fixed inset-0 z-[9999] bg-opacity-50 flex items-center justify-center p-4">
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-4xl mx-auto">

                        {/* Bottone X */}
                        <button
                          onClick={() => setOpenImage(null)}
                          className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600 transition cursor-pointer">
                          <i className="fa-solid fa-xmark text-lg"></i>
                        </button>

                        {/* Immagine ingrandita */}
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

          {/* Input file nascosto */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            multiple
            style={{ display: "none" }}
          />
        </div>

        {/* Pulsante di salvataggio */}
        <div className="md:col-span-2 flex justify-center gap-2">
          <Link
            to={travelId ? `/travels/${travelId}/days` : `/travels`}
            className="font-semibold w-full px-4 py-2 flex items-center justify-center gap-2 bg-red-500 text-white rounded-full hover:bg-red-400 cursor-pointer transition hover:scale-105">
            <i className="fa-solid fa-arrow-left"></i>
            Torna alle Tappe
          </Link>
          <button
            type="submit"
            className="font-semibold w-full px-4 py-2 flex items-center justify-center gap-2 bg-green-500 text-white rounded-full hover:bg-green-400 cursor-pointer transition hover:scale-105">
            <i className="fa-solid fa-edit"></i>
            Salva Modifiche
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default EditDay;
