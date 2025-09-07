import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function AddDay() {
  const location = useLocation();
  const navigate = useNavigate();
  const travelIdFromState = location.state?.travelId || ""; // id passato da TravelDays per avere il viaggio già selezionato

  const [travels, setTravels] = useState([]); // lista viaggi esistenti
  const [selectedTravel, setSelectedTravel] = useState("");
  const [form, setForm] = useState({
    date: "",
    title: "",
    address: "",
    description: "",
    photo: [""], // inizialmente una foto vuota
  });
  const [message, setMessage] = useState("");

  // carico i viaggi dal backend
  useEffect(() => {
    const fetchTravels = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/travels");
        setTravels(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTravels();
  }, []);

  // per ottenre l'id del viaggio
  useEffect(() => {
    if (travelIdFromState) {
      setSelectedTravel(travelIdFromState);
    }
  }, [travelIdFromState]);

  // gestisce il cambiamento di input generico (date, notes, ecc.)
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // gestisce il cambiamento di un campo foto specifico
  const handlePhotoChange = (index, value) => {
    const newPhotos = [...form.photo];
    newPhotos[index] = value;
    setForm({ ...form, photo: newPhotos });
  };

  // aggiunge un nuovo campo foto vuoto al form
  const addPhotoField = () => {
    setForm({ ...form, photo: [...form.photo, ""] });
  };

  // gestisce l'invio del form e salva il nuovo giorno nel backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTravel) {
      setMessage("❌ Devi selezionare un viaggio!");
      return;
    }

    try {
      const newDay = {
        date: form.date,
        title: form.title,
        address: form.address,
        description: form.description,
        photo: form.photo.filter((p) => p.trim() !== ""), // tolgo vuoti
      };

      await axios.post(
        `http://127.0.0.1:8000/travels/${selectedTravel}/days`,
        newDay
      );

      setMessage("✅ Giorno aggiunto con successo!");
      setForm({ date: "", title: "", address: "", description: "", photo: [""] });

      // <-- reindirizzo alla pagina dei giorni del viaggio selezionato
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
    <motion.div className="flex items-center justify-center bg-transparent" variants={addDay} initial="initial" animate="animate" exit="exit">
      <form
        onSubmit={handleSubmit}
        className="backdrop-blur-xl shadow-lg rounded-2xl p-6 w-full max-w-4xl border border-white grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Titolo + nota obbligatorio */}
        <div className="flex items-center justify-between md:col-span-2 mb-4">
          <h2 className="text-2xl font-bold text-white">
            ➕ Aggiungi un giorno al viaggio
          </h2>
          <p className="text-white text-sm italic">* Il campo è obbligatorio</p>
        </div>

        {/* Selezione viaggio */}
        <div>
          <label className="block text-white">Viaggio *</label>
          <select
            value={selectedTravel}
            onChange={(e) => setSelectedTravel(e.target.value)}
            className="w-full p-2 border border-white rounded-lg bg-transparent text-white"
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

        {/* Indirizzo */}
        <div className="md:col-span-1">
          <label className="block text-white">Indirizzo *</label>
          <input
            name="address"
            value={form.address}
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
            rows="3" />
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
            Aggiungi Giorno
          </button>
        </div>

        {message && <p className="mt-4 text-center md:col-span-2">{message}</p>}
      </form>
    </motion.div>
  );
}

export default AddDay;
