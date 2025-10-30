import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import ModalAddTag from "../components/Modals/ModalAddTag";

function AddDay() {
  const location = useLocation(); // per ottenere lo stato passato da TravelDays
  const navigate = useNavigate(); // per reindirizzare dopo l'aggiunta del giorno
  const travelIdFromState = location.state?.travelId || ""; // id passato da TravelDays per avere il viaggio già selezionato
  const [travels, setTravels] = useState([]); // lista viaggi esistenti
  const [message, setMessage] = useState(""); // messaggio di successo o errore
  const [selectedTravel, setSelectedTravel] = useState(""); // viaggio selezionato
  const fileInputRef = useRef(null); // riferimento all’input nascosto
  const [openImage, setOpenImage] = useState(null); // stato per l'immagine ingrandita (Apri / Chiudi)
  const [isTagModalOpen, setIsTagModalOpen] = useState(false); // apre / chiude il modale dei tags
  const [query, setQuery] = useState(""); // stato per ottenre i luoghi dall'API  Photon
  const [suggestions, setSuggestions] = useState([]); // stato per i suggerimenti dall'API Photon

  const [form, setForm] = useState({ // stato del form
    date: "",
    title: "",
    description: "",
    tags: [], // array di tags
    photo: [], // array di foto
  });

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

  useEffect(() => {
    if (query.length < 2) return; // evita richieste troppo frequenti

    const timeoutId = setTimeout(() => {
      fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=10`) // chiamo l'API di Photon per ottenere i luoghi
        .then(res => res.json())
        .then(data => {
          if (data.features) {
            setSuggestions(
              data.features.map(f => ({
                name: f.properties.name,
                city: f.properties.city,
                country: f.properties.country,
                lat: f.geometry.coordinates[1],
                lng: f.geometry.coordinates[0],
              }))
            );
          }
        });
    }, 300); // debounce 300ms

    return () => clearTimeout(timeoutId);
  }, [query]);


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

      setForm({ date: "", title: "", description: "", tags: [], photo: [] }); // resetto il form
      setMessage("✅ Tappa aggiunta!");

      // reindirizzo alla pagina delle tappe
      setTimeout(() => {
        setMessage(""); // fa sparire il modale
        navigate(`/travels/${selectedTravel}/days`);
      }, 2000);

    } catch (err) {
      console.error(err);
      setMessage("❌ Errore durante l'aggiunta della tappa.");
    }
  };

  return (
    <motion.div
      className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-start bg-transparent sm:p-8 p-4 gap-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}>
        
      {/* Glow morbido dietro al form */}
      <div className="absolute -z-10 w-[90%] h-[90%] rounded-3xl bg-gradient-to-br from-blue-900/30 via-blue-800/10 to-orange-900/20
       blur-3xl" />

      <form
        onSubmit={handleSubmit}
        className="backdrop-blur-xl bg-gradient-to-br from-white/20 via-white/10 to-transparent rounded-3xl p-6 w-full 
        max-w-4xl border border-white/40 shadow-[inset_0_0_20px_rgba(255,255,255,0.1)]">

        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute w-[28rem] h-[28rem] bg-gradient-to-br from-blue-500/20 to-orange-400/10 rounded-full 
          blur-3xl top-10 left-10 animate-[pulse_6s_ease-in-out_infinite]" />
          <div className="absolute w-[32rem] h-[32rem] bg-gradient-to-br from-orange-500/20 to-blue-400/10 rounded-full 
          blur-3xl bottom-10 right-10 animate-[pulse_6s_ease-in-out_infinite]" />
        </div>

        {/* Titolo + nota obbligatorio */}
        <div className="flex items-center justify-between md:col-span-2 mb-4">
          <h2 className="text-2xl font-extrabold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"> Aggiungi una tappa al viaggio</h2>
          <p className="text-white text-sm italic">* Il campo è obbligatorio</p>
        </div>

        {/* Griglia a due colonne */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Selezione viaggio */}
          <div>
            <label className="block font-bold text-white mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">Viaggio *</label>
            <select
              value={selectedTravel}
              onChange={(e) => setSelectedTravel(e.target.value)}
              className="w-full p-2 font-semibold border border-white/40 rounded-full bg-white/10 text-white
              placeholder-white/70 focus:ring-2 focus:ring-orange-300 focus:border-transparent transition"
              required>
              <option value="" className="bg-black text-white">-- Seleziona --</option>
              {travels.map((t) => (
                <option key={t.id} value={t.id} className="bg-black text-white">
                  {t.city} ({t.year})
                </option>
              ))}
            </select>
          </div>

          {/* Data */}
          <div>
            <label className="block font-bold text-white mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">Data *</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="w-full p-2 font-semibold border border-white/40 rounded-full bg-white/10 text-white
              placeholder-white/70 focus:ring-2 focus:ring-orange-300 focus:border-transparent transition [color-scheme:dark]"
            />
          </div>

          {/* Titolo */}
          <div className="md:col-span-2 relative">
            <label className="block font-bold text-white mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">Titolo *</label>
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
              placeholder-white/70 focus:ring-2 focus:ring-orange-300 focus:border-transparent transition"
            />
            
             { /* Suugerimenti */ }
            {suggestions.length > 0 && (
              <ul className="absolute bg-black/80 backdrop-blur-3xl border border-white/40 text-white w-full 
              mt-1 shadow-lg rounded-xl z-10">
                {suggestions.map((s, i) => (
                  <li
                    key={i}
                    className="p-2 hover:bg-blue-400 cursor-pointer"
                    onClick={() => {
                      setForm((prev) => ({ ...prev, title: s.name }));
                      setSuggestions([]);
                    }}
                  >
                    {s.name}, {s.city}, {s.country}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="md:col-span-2 border-t border-white/40 my-4"></div>

        {/* Descrizione */}
        <div className="md:col-span-2">
          <label className="block font-bold text-white mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">Riassunto della giornata *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            className="w-full p-2 font-semibold border border-white/40 rounded-3xl bg-white/10 text-white
            placeholder-white/70 focus:ring-2 focus:ring-orange-300 focus:border-transparent transition scrollbar"
            rows="6"
          />
        </div>

        {/* Divider */}
        <div className="md:col-span-2 border-t border-white/40 my-4"></div>

        {/* Pulsanti principali: Seleziona categorie + Carica foto */}
        <div className="md:col-span-2 flex justify-between gap-4">
          <button
            type="button"
            onClick={() => setIsTagModalOpen(true)}
            className="font-semibold px-6 py-2 bg-gradient-to-r from-orange-600 to-rose-500 backdrop-blur-md 
            border border-white/40 text-white rounded-full shadow-md transition-all duration-100 ease-in-out 
            hover:scale-105 cursor-pointer flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]">
            <i className="fa-solid fa-list-check"></i> Seleziona Tag
          </button>
          <button
            type="button"
            onClick={handlePhotoSelect}
            className="font-semibold px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 backdrop-blur-md 
            border border-white/40 text-white rounded-full shadow-md transition-all duration-100 ease-in-out 
            hover:scale-105 cursor-pointer flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]">
            <i className="fa-solid fa-camera"></i> Carica Foto
          </button>
        </div>

        {/* Mostra i tags selezionati */}
        {form.tags.length > 0 && (
          <div className="mt-3 flex gap-3 w-full justify-center flex-wrap">
            {form.tags.map((tag, i) => (
              <span
                key={i}
                className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-cyan-500
                backdrop-blur-md border border-white/40 text-white px-4 py-2 rounded-full text-base font-semibold 
                shadow-md transition-all duration-100 ease-in-out hover:scale-105 cursor-pointer">
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

        <ModalAddTag
          isOpen={isTagModalOpen}
          onClose={() => setIsTagModalOpen(false)}
          form={form}
          setForm={setForm}
        />

        {/* Foto */}
        <div className="md:col-span-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-2">
            {form.photo.map((item, index) => {
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
                    className="w-full mt-3 h-32 object-cover rounded-3xl border border-white shadow-md cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 bg-red-600 hover:bg-red-500 text-white rounded-full p-1 opacity-0 
                    group-hover:opacity-100 transition">
                    <i className="fa-solid fa-xmark"></i>
                  </button>

                  {openImage && (
                    <div
                      onClick={() => setOpenImage(null)}
                      className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-4xl mx-auto">
                        <button
                          onClick={() => setOpenImage(null)}
                          className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 shadow-lg 
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
        <div className="md:col-span-2 border-t border-white/40 my-4"></div>

        {/* Pulsante Aggiungi Tappa */}
        <div className="md:col-span-2 flex justify-between gap-2">
          <Link
            to={`/travels/${selectedTravel}/days`}
            className="font-semibold px-6 py-2 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-500
            backdrop-blur-md border border-white/40 text-white rounded-full cursor-pointer transition-all duration-100 ease-in-out 
            hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]">
            <i className="fa-solid fa-arrow-left"></i>
            Torna alle Tappe
          </Link>
          <button
            type="submit"
            className="font-semibold px-6 py-2 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-teal-500 
            backdrop-blur-md border border-white/40 text-white rounded-full cursor-pointer transition-all duration-100 ease-in-out 
            hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]">
            <i className="fa-solid fa-plus"></i>
            Aggiungi Tappa
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
          className="fixed top-6 right-6 backdrop-blur-xl border border-white text-white px-6 py-3 
          rounded-full shadow-lg z-[9999] bg-gradient-to-r from-blue-500 to-orange-500">
          <p className="text-lg font-semibold">{message}</p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default AddDay;
