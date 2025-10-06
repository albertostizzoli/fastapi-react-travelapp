import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function AddDay() {
  const location = useLocation(); // per ottenere lo stato passato da TravelDays
  const navigate = useNavigate(); // per reindirizzare dopo l'aggiunta del giorno
  const travelIdFromState = location.state?.travelId || ""; // id passato da TravelDays per avere il viaggio già selezionato
  const [travels, setTravels] = useState([]); // lista viaggi esistenti
  const [selectedTravel, setSelectedTravel] = useState(""); // viaggio selezionato
  const [photo, setPhoto] = useState([]); // stato per le foto
  const fileInputRef = useRef(null); // riferimento all’input nascosto
  const [messagePhoto, setMessagePhoto] = useState(""); // stato per i messaggi di caricamento foto

  const [form, setForm] = useState({ // stato del form
    date: "",
    title: "",
    description: "",
    photo: [], // array di foto
  });
  const [message, setMessage] = useState(""); // messaggio di successo o errore

  // carico i viaggi dal backend
  useEffect(() => {
    const fetchTravels = async () => { // funzione asincrona per fetch
      const userId = localStorage.getItem("userId"); // recupero id utente
      if (!userId) return; // se non c'è, non faccio nulla
      try {
        const res = await axios.get(`http://127.0.0.1:8000/travels?user_id=${userId}`); // richiesta GET
        setTravels(res.data); // aggiorno lo stato con i viaggi ricevuti
      } catch (err) {
        console.error(err); // log dell'errore
      }
    };
    fetchTravels(); // chiamo la funzione
  }, []);

  // per ottenre l'id del viaggio
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
    const newFiles = Array.from(e.target.files); // nuova selezione

    if (newFiles.length > 0) {
      setPhoto((prev) => {
        const updatedPhotos = [...prev, ...newFiles]; // aggiungo le nuove foto a quelle esistenti

        // Aggiorna anche lo stato del form
        setForm((prevForm) => ({
          ...prevForm,
          photo: updatedPhotos, // aggiorno l'array delle foto nel form
        }));

        // Messaggio dinamico con tutte le foto
        const fileNames = updatedPhotos.map((f) => f.name).join(", "); // nomi dei file selezionati
        if (updatedPhotos.length === 1) { // se c'è una sola foto
          setMessagePhoto(` Foto selezionata: ${fileNames}`);
        } else {
          setMessagePhoto(` ${updatedPhotos.length} foto selezionate }`);
        }
        return updatedPhotos; // ritorno l'array aggiornato
      });
    }
    // Resetto l’input per permettere nuove selezioni
    e.target.value = null;
  };


  // gestisce l'invio del form e salva il nuovo giorno nel backend
  const handleSubmit = async (e) => {
    e.preventDefault(); // previene il comportamento di default del form

    if (!selectedTravel) {
      setMessage("❌ Devi selezionare un viaggio!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("date", form.date);
      formData.append("title", form.title);
      formData.append("description", form.description);

      // aggiungo tutti i file
      form.photo.forEach((file) => {
        formData.append("photos", file);
      });

      await axios.post(
        `http://127.0.0.1:8000/travels/${selectedTravel}/days`, // endpoint per aggiungere un giorno a un viaggio specifico
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setMessage("✅ Giorno aggiunto con successo!");
      setForm({ date: "", title: "", description: "", photo: [] }); // resetto il form
      setPhoto([]);
      setMessagePhoto("");

      // reindirizzo alla pagina dei giorni del viaggio selezionato
      navigate(`/travels/${selectedTravel}/days`);

    } catch (err) {
      console.error(err);
      setMessage("❌ Errore durante l'aggiunta del giorno.");
    }
  };

  return (
    <motion.div className="flex items-center justify-center bg-transparent min-h-screen p-8"
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

        {/*  Bottone per caricare la foto */}
        <button
          type="button"
          onClick={handlePhotoSelect}
          className=" px-4 py-2 flex items-center justify-center bg-green-500 hover:bg-green-400 text-white rounded-lg shadow-md transition hover:scale-105 cursor-pointer">
          <i className="fa-solid fa-camera mr-2"></i> Carica foto
        </button>

        {/* Input file nascosto */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple
          style={{ display: "none" }}
        />
        {messagePhoto && <p className="mt-4 text-center text-white md:col-span-2">{messagePhoto}</p>}

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
    </motion.div>
  );
}

export default AddDay;
