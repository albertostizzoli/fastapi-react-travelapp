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

  // gestisce cambio file locale
  const handlePhotoFileChange = (index, file) => {
    const newPhotos = [...form.photo];
    newPhotos[index] = file; // salvo l'oggetto File
    setForm({ ...form, photo: newPhotos });
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

        {/* Foto */}
        <div className="md:col-span-2">
          <label className="block text-white">Foto *</label>
          {form.photo.map((p, index) => (
            <div key={index} className="flex flex-col gap-2 mb-2">
              {/* Contenitore con input di testo + pulsante */}
              <div className="relative w-full">
                {/* Input file nascosto */}
                <input
                  id={`fileUpload-${index}`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePhotoFileChange(index, e.target.files[0])}
                  className="hidden"
                />

                {/* Campo di testo che mostra il nome del file selezionato */}
                <input
                  type="text"
                  readOnly
                  value={p instanceof File ? p.name : ""}
                  placeholder="Nessun file selezionato"
                  className="w-full p-2 border border-white text-white rounded-lg bg-transparent"
                />

                {/* Bottone personalizzato */}
                <label
                  htmlFor={`fileUpload-${index}`}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-500 hover:bg-green-400 text-white px-3 py-1 rounded-lg cursor-pointer">
                  Carica Foto
                </label>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addPhotoField}
            className="px-4 py-2 flex items-center justify-center gap-2 bg-green-500 text-white rounded-lg hover:bg-green-400 cursor-pointer transition hover:scale-105">
            <i className="fa-solid fa-plus"></i>
            Aggiungi Foto
          </button>
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
    </motion.div>
  );
}

export default AddDay;
