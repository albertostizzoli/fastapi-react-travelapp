import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import travellers from "../store/travellers";

function AddDay() {
  const location = useLocation(); // per ottenere lo stato passato da TravelDays
  const navigate = useNavigate(); // per reindirizzare dopo l'aggiunta del giorno
  const travelIdFromState = location.state?.travelId || ""; // id passato da TravelDays per avere il viaggio già selezionato
  const [travels, setTravels] = useState([]); // lista viaggi esistenti
  const [selectedTravel, setSelectedTravel] = useState(""); // viaggio selezionato
  const fileInputRef = useRef(null); // riferimento all’input nascosto
  const [openImage, setOpenImage] = useState(null); // stato per l'immagine ingrandita (Apri / Chiudi)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false); // apre / chiude il modale delle categorie

  const [form, setForm] = useState({ // stato del form
    date: "",
    title: "",
    description: "",
    categories: [], // array di categorie
    photo: [], // array di foto
  });
  const [message, setMessage] = useState(""); // messaggio di successo o errore

  // carico i viaggi dal backend
  useEffect(() => {
    const fetchTravels = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`http://127.0.0.1:8000/travels`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTravels(res.data); // array di viaggi per la select
      } catch (err) {
        console.error(err);
      }
    };

    fetchTravels();
  }, []);


  // per ottenere l'id del viaggio
  useEffect(() => {
    if (travelIdFromState) { // se c'è un id passato dallo stato
      setSelectedTravel(travelIdFromState); // lo imposto come viaggio selezionato
    }
  }, [travelIdFromState]); // dipende da travelIdFromState

  // gestisce il cambiamento di input generico (date, notes, ecc.)
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value }); // aggiorno il campo specifico
  };

  // Funzione per gestire la selezione della foto
  const handlePhotoSelect = () => {
    fileInputRef.current.click(); // simula il click sull’input file nascosto
  };

  // Funzione per gestire la selezione delle foto
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files); // converto FileList in array
    if (newFiles.length > 0) { // se ci sono file selezionati
      setForm((prevForm) => ({ // aggiorno lo stato del form
        ...prevForm, // mantengo gli altri campi
        photo: [...prevForm.photo, ...newFiles], // aggiungo i nuovi file all'array delle foto
      }));
    }
    e.target.value = null; // reset input
  };

  // rimuovi foto
  const removePhoto = (index) => {
    const newPhotos = form.photo.filter((_, i) => i !== index); // filtro l'array delle foto per rimuovere quella all'indice specificato
    setForm({ ...form, photo: newPhotos }); // aggiorno lo stato del giorno
  };


  // gestisce l'invio del form e salva il nuovo giorno nel backend
  const handleSubmit = async (e) => {
    e.preventDefault(); // previene il comportamento di default del form

    if (!selectedTravel) {
      setMessage(" Devi selezionare un viaggio!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("date", form.date);
      formData.append("title", form.title);
      formData.append("description", form.description);

      // aggiungo tutte le categorie
      form.categories.forEach((cat) => {
        formData.append("categories", cat);
      });

      // aggiungo tutte le foto
      form.photo.forEach((file) => {
        formData.append("photos", file);
      });

      await axios.post(
        `http://127.0.0.1:8000/travels/${selectedTravel}/days`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMessage(" Giorno aggiunto con successo!");
      setForm({ date: "", title: "", description: "", categories: [], photo: [] }); // resetto il form

      // reindirizzo alla pagina dei giorni del viaggio selezionato
      navigate(`/travels/${selectedTravel}/days`);

    } catch (err) {
      console.error(err);
      setMessage(" Errore durante l'aggiunta del giorno.");
    }
  };

  return (
    <motion.div className="flex items-center justify-center bg-transparent min-h-screen sm:p-8 p-4"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 1.5 }}>
      <form
        onSubmit={handleSubmit}
        className="backdrop-blur-xl shadow-lg rounded-2xl p-6 w-full max-w-4xl border border-white grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Titolo + nota obbligatorio */}
        <div className="flex items-center justify-between md:col-span-2 mb-4">
          <h2 className="text-2xl font-bold text-white">
            ➕ Aggiungi una tappa al viaggio
          </h2>
          <p className="text-white text-sm italic">* Il campo è obbligatorio</p>
        </div>

        {/* Selezione viaggio */}
        <div>
          <label className="block text-white">Viaggio *</label>
          <select
            value={selectedTravel}
            onChange={(e) => setSelectedTravel(e.target.value)} // aggiorno il viaggio selezionato
            className="w-full p-2 border border-white rounded-lg bg-transparent text-white"
            required>

            <option value="" className="bg-black text-white">-- Seleziona --</option>
            {travels.map((t) => (
              <option key={t.id} value={t.id} className="bg-black text-white"> {/* opzione per ogni viaggio */}
                {t.city} ({t.year})
              </option>
            ))}
          </select>
        </div>

        {/* Data */}
        <div>
          <label className="block text-white">Data *</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full p-2 border border-white rounded-lg text-white bg-transparent [color-scheme:dark]" />
        </div>

        {/* Titolo */}
        <div className="md:col-span-1">
          <label className="block text-white">Titolo *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full p-2 border border-white text-white rounded-lg" />
        </div>

        {/* Descrizione */}
        <div className="md:col-span-2">
          <label className="block text-white">Riassunto della giornata *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            className="w-full p-2 border border-white text-white rounded-lg"
            rows="4" />
        </div>

        {/* Pulsanti principali: Seleziona categorie + Carica foto */}
        <div className="md:col-span-2 flex flex-wrap gap-4">
          {/* Pulsante categorie */}
          <button
            type="button"
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-400 text-white rounded-lg shadow-md transition hover:scale-105 cursor-pointer flex items-center justify-center gap-2">
            <i className="fa-solid fa-list-check"></i> Seleziona Tag
          </button>

          {/* Pulsante foto */}
          <button
            type="button"
            onClick={handlePhotoSelect}
            className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-400 text-white rounded-lg shadow-md transition hover:scale-105 cursor-pointer flex items-center justify-center gap-2">
            <i className="fa-solid fa-camera"></i> Carica Foto
          </button>
        </div>


        {/* Mostra le categorie selezionate */}
        {form.categories.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {form.categories.map((cat, i) => (
              <span
                key={i}
                className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm shadow-md flex items-center gap-2">
                {cat}
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      categories: form.categories.filter((c) => c !== cat),
                    })
                  }
                  className="text-white hover:text-red-400">
                  <i className="fa-solid fa-xmark text-xs"></i>
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Modale Categorie */}
        <AnimatePresence>
          {isCategoryModalOpen && (
            <motion.div
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm rounded-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}>
              <motion.div
                className="bg-gray-900 rounded-2xl shadow-xl p-6 w-full max-w-6xl overflow-y-auto max-h-[80vh] border border-gray-700 scrollbar-custom"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}>
                <h2 className="text-white text-2xl font-bold mb-4 text-center">
                  🏷️ Seleziona i tuoi Tag per la Tappa del tuo Viaggio
                </h2>

                <div className="space-y-5">
                  {travellers.map((cat) => (
                    <div key={cat.category}>
                      <div className="flex flex-wrap gap-3">
                        {cat.experiences.map((experience) => (
                          <label
                            key={experience}
                            className={`flex items-center gap-2 px-3 py-1 border rounded-full cursor-pointer transition-all ${form.categories.includes(experience)
                              ? "bg-blue-600 border-blue-400 text-white"
                              : "bg-transparent border-gray-400 text-white hover:bg-blue-400/20"
                              }`}>
                            <input
                              type="checkbox"
                              className="accent-blue-500"
                              checked={form.categories.includes(experience)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setForm({
                                    ...form,
                                    categories: [...form.categories, experience],
                                  });
                                } else {
                                  setForm({
                                    ...form,
                                    categories: form.categories.filter(
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
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition hover:scale-105 cursor-pointer">
                    Conferma
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition hover:scale-105 cursor-pointer">
                    Chiudi
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="md:col-span-2">
          {/* Foto esistenti + nuove foto */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
            {form.photo.map((item, index) => {
              // se è una stringa, è un URL dal DB
              const src =
                typeof item === "string" // se è una stringa, è un URL dal DB
                  ? item.startsWith("http") // se inizia con http, è un URL completo
                    ? item
                    : `http://127.0.0.1:8000/${item}`
                  // se è un File (nuova foto)
                  : URL.createObjectURL(item);

              return (
                <div key={index} className="relative group">
                  <img
                    onClick={() => setOpenImage(src)} // apri immagine cliccata
                    src={src}
                    alt={`Foto ${index + 1}`} // alt descrittivo
                    className="w-full h-32 object-cover rounded-lg border border-white shadow-md cursor-pointer"
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
                      onClick={() => setOpenImage(null)} // chiude il modale
                      className="fixed inset-0 backdrop-blur-3xl flex items-center justify-center z-[9999]">
                      {/* prevengo la chiusura quando clicco sull'immagine o sulla X */}
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative">
                        {/* Bottone X */}
                        <button
                          onClick={() => setOpenImage(null)} // chiude il modale
                          className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full p-2 shadow-lg cursor-pointer">
                          <i className="fa-solid fa-xmark text-lg"></i>
                        </button>

                        {/* Immagine ingrandita */}
                        <img
                          src={openImage.replace("w=400", "w=1600")}
                          alt="Immagine ingrandita"
                          className="sm:max-w-4xl max-h-[90vh] rounded-lg shadow-lg"
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


        {/* Pulsante */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full px-4 py-2 flex items-center justify-center gap-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 cursor-pointer transition hover:scale-105">
            <i className="fa-solid fa-plus"></i>
            Aggiungi Tappa
          </button>
        </div>

        {message && <p className="mt-4 text-center md:col-span-2">{message}</p>}
      </form>
    </motion.div >
  );
}

export default AddDay;
