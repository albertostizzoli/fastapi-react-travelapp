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
  const fileInputRef = useRef(null); // riferimento all’input nascosto

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
                    src={src}
                    alt={`Foto ${index + 1}`} // alt descrittivo
                    className="w-full h-32 object-cover rounded-lg border border-white shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 bg-red-600 hover:bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition">
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              );
            })}
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
