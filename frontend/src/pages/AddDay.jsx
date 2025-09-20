import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function AddDay() {
  const location = useLocation(); // per ottenere lo stato passato da TravelDays
  const navigate = useNavigate(); // per reindirizzare dopo l'aggiunta del giorno
  const travelIdFromState = location.state?.travelId || ""; // id passato da TravelDays per avere il viaggio già selezionato

  const [travels, setTravels] = useState([]); // lista viaggi esistenti
  const [selectedTravel, setSelectedTravel] = useState(""); // viaggio selezionato
  const [form, setForm] = useState({ // stato del form
    date: "",
    title: "",
    description: "",
    photo: [""], // inizialmente una foto vuota
  });
  const [message, setMessage] = useState(""); // messaggio di successo o errore

  // carico i viaggi dal backend
  useEffect(() => {
    const fetchTravels = async () => { // funzione asincrona per fetch
      try {
        const res = await axios.get("http://127.0.0.1:8000/travels"); // richiesta GET
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

  // gestisce il cambiamento di un campo foto specifico
  const handlePhotoChange = (index, value) => {
    let finalUrl = value.trim();

    // se l'URL non ha già parametri, aggiungo i parametri Pexels
    if (finalUrl && !finalUrl.includes("?")) {
      finalUrl += "?auto=compress&cs=tinysrgb&w=400";
    }

    const newPhotos = [...form.photo]; // creo una copia dell'array foto
    newPhotos[index] = finalUrl; // aggiorno la foto specifica
    setForm({ ...form, photo: newPhotos }); // aggiorno lo stato del form
  };

  // aggiunge un nuovo campo foto vuoto al form
  const addPhotoField = () => {
    setForm({ ...form, photo: [...form.photo, ""] }); // aggiungo una nuova stringa vuota all'array foto
  };

  // gestisce l'invio del form e salva il nuovo giorno nel backend
  const handleSubmit = async (e) => {
    e.preventDefault(); // previene il comportamento di default del form

    if (!selectedTravel) {
      setMessage("❌ Devi selezionare un viaggio!");
      return;
    }

    try {
      const newDay = { // creo l'oggetto del nuovo giorno
        date: form.date,
        title: form.title,
        description: form.description,
        photo: form.photo.filter((p) => p.trim() !== ""), // tolgo vuoti
      };

      await axios.post(
        `http://127.0.0.1:8000/travels/${selectedTravel}/days`, // endpoint per aggiungere un giorno a un viaggio specifico
        newDay
      );

      setMessage("✅ Giorno aggiunto con successo!");
      setForm({ date: "", title: "", description: "", photo: [""] }); // resetto il form

      // reindirizzo alla pagina dei giorni del viaggio selezionato
      navigate(`/travels/${selectedTravel}/days`);

    } catch (err) {
      console.error(err);
      setMessage("❌ Errore durante l'aggiunta del giorno.");
    }
  };

  // Animazione
  const addDay = {
    initial: {
      scale: 0.9, // leggermente più piccolo
      opacity: 0, // invisibile
    },
    animate: {
      scale: 1,   // zoom fino alla dimensione reale
      opacity: 1, // visibile
      transition: {
        duration: 1.5,
        ease: "easeInOut",
        staggerChildren: 0.1, // opzionale se hai figli animati
      },
    },
    exit: {
      scale: 0.9, // quando esce torna piccolo
      opacity: 0,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };


  return (
    <motion.div className="flex items-center justify-center bg-transparent min-h-screen p-8" variants={addDay} initial="initial" animate="animate" exit="exit">
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

        {/* Foto */}
        <div className="md:col-span-2">
          <label className="block text-white">Foto (URL) *</label>
          {form.photo.map((p, index) => (
            <input
              key={index}
              type="text"
              value={p}
              onChange={(e) => handlePhotoChange(index, e.target.value)}
              placeholder="Inserisci URL immagine"
              required
              className="w-full p-2 border border-white text-white rounded-lg mb-2" />
          ))}
          <button
            type="button"
            onClick={addPhotoField}
            className="text-white text-sm hover:underline">
            Aggiungi un'altra foto
          </button>
        </div>

        {/* Pulsante */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full px-4 py-2 flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 cursor-pointer transition hover:scale-105">
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
