import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLocation, useNavigate, Link } from "react-router-dom";
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
  const [isTagModalOpen, setIsTagModalOpen] = useState(false); // apre / chiude il modale dei tags

  const [form, setForm] = useState({ // stato del form
    date: "",
    title: "",
    description: "",
    tags: [], // array di tags
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

      // aggiungo tutti i tags
      form.tags.forEach((tag) => {
        formData.append("tags", tag);
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
      setForm({ date: "", title: "", description: "", tags: [], photo: [] }); // resetto il form

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
        className="backdrop-blur-xl shadow-lg rounded-3xl p-6 w-full max-w-4xl border border-white grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Titolo + nota obbligatorio */}
        <div className="flex items-center justify-between md:col-span-2 mb-4">
          <h2 className="text-2xl font-bold text-white">
            ➕ Aggiungi una tappa al viaggio
          </h2>
          <p className="text-white text-sm italic">* Il campo è obbligatorio</p>
        </div>

        {/* Selezione viaggio */}
        <div>
          <label className="block font-bold text-white mb-1">Viaggio *</label>
          <select
            value={selectedTravel}
            onChange={(e) => setSelectedTravel(e.target.value)} // aggiorno il viaggio selezionato
            className="w-full p-2 border border-white rounded-full bg-transparent text-white font-bold"
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
          <label className="block font-bold text-white mb-1">Data *</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full p-2 font-semibold border border-white rounded-full text-white bg-transparent [color-scheme:dark]" />
        </div>

        {/* Titolo */}
        <div className="md:col-span-1">
          <label className="block font-bold text-white mb-1">Titolo *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full p-2 font-semibold border border-white text-white rounded-full" />
        </div>

        {/* Descrizione */}
        <div className="md:col-span-2">
          <label className="block font-bold text-white mb-1">Riassunto della giornata *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            className="w-full p-2 font-semibold border border-white text-white rounded-3xl scrollbar"
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
        {form.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3 w-full">
            {form.tags.map((tag, i) => (
              <span
                key={i}
                className="flex items-center justify-between bg-blue-600 text-white px-4 py-2 rounded-full text-base font-semibold shadow-md transition-transform hover:scale-105 cursor-pointer">
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      tags: form.tags.filter((c) => c !== tag),
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
              className="fixed inset-0 z-[9999] rounded flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}>

              <motion.div
                className="bg-gray-900 rounded-3xl shadow-2xl p-6 w-[90%] max-w-4xl overflow-y-auto max-h-[75vh] border border-gray-700 flex flex-col"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}>

                <h2 className="text-white text-2xl font-bold mb-4 text-center">
                  🏷️ Seleziona i tuoi Tag per la Tappa del tuo Viaggio
                </h2>

                <div className="space-y-5 flex-1 overflow-y-auto pr-2 scrollbar-custom">
                  {/* Ciclo sullo store travellers category e experiences vengono dallo store mentre tags è la colonna sul database*/}
                  {travellers.map((cat) => (
                    <div key={cat.category}>
                      <h3 className="text-lg font-semibold text-blue-400 mb-2">{cat.category}</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {cat.experiences.map((experience) => (
                          <label
                            key={experience}
                            className={`font-semibold flex items-center justify-center text-center gap-2 px-3 py-2 border rounded-full cursor-pointer text-sm transition-all ${form.tags.includes(experience)
                              ? "bg-blue-600 border-blue-400 text-white shadow-md"
                              : "bg-transparent border-gray-500 text-white hover:bg-blue-400/20 hover:scale-105"
                              }`}>
                            <input
                              type="checkbox"
                              className="accent-blue-500 hidden"
                              checked={form.tags.includes(experience)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setForm({
                                    ...form,
                                    tags: [...form.tags, experience],
                                  });
                                } else {
                                  setForm({
                                    ...form,
                                    tags: form.tags.filter((c) => c !== experience),
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
                    className="font-semibold px-4 py-2 bg-red-500 hover:bg-red-500 text-white rounded-full transition hover:scale-105 cursor-pointer">
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
                      className="fixed inset-0 z-[9999] bg-opacity-50 flex items-center justify-center p-4">
                      {/* prevengo la chiusura quando clicco sull'immagine o sulla X */}
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-4xl mx-auto">
                        {/* Bottone X */}
                        <button
                          onClick={() => setOpenImage(null)} // chiude il modale
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


        {/* Pulsante */}
        <div className="md:col-span-2 flex justify-center gap-2">
          <Link
            to={`/travels/${selectedTravel}/days`}
            className="font-semibold w-full px-4 py-2 flex items-center justify-center gap-2 bg-red-500 text-white rounded-full hover:bg-red-400 cursor-pointer transition hover:scale-105">
            <i className="fa-solid fa-arrow-left"></i>
            Torna alle Tappe
          </Link>
          <button
            type="submit"
            className="font-semibold w-full px-4 py-2 flex items-center justify-center gap-2 bg-green-500 text-white rounded-full hover:bg-green-400 cursor-pointer transition hover:scale-105">
            <i className="fa-solid fa-plus"></i>
            Aggiungi Tappa
          </button>
        </div>

        {message && <p className="mt-4 text-center text-white font-bold md:col-span-2">{message}</p>}
      </form>
    </motion.div >
  );
}

export default AddDay;
