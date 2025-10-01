import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

function EditDay() {
  const { id } = useParams();   // recupero l'ID del giorno dall'URL
  const navigate = useNavigate(); // hook per navigare fra le pagine
  const [day, setDay] = useState(null); // per salvare i dati del giorno
  const [newPhotos, setNewPhotos] = useState([]); // per i file caricati
  const [loading, setLoading] = useState(true); // stato di caricamento

  // recupero i dati del giorno dal backend
  useEffect(() => {
    const userId = localStorage.getItem("userId"); // recupero id utente
    if (!userId) return; // se non c'è, non faccio nulla
    axios
      .get(`http://127.0.0.1:8000/travels?user_id=${userId}`) // recupero tutti i viaggi
      .then((res) => { // cerco il giorno con l'ID specificato
        let dayFound = null; // inizializzo la variabile per il giorno trovato
        res.data.forEach((travel) => {
          const d = travel.days.find((day) => day.id === parseInt(id)); // cerco il giorno nel viaggio corrente
          if (d) { // se il giorno è trovato
            dayFound = { ...d, travelId: travel.id }; // aggiungo anche l'id del viaggio
          }
        });
        setDay(dayFound); // salvo il giorno nello stato
        setLoading(false); // imposto lo stato di caricamento a false
      })
      .catch((err) => console.error(err)); // gestisco gli errori
  }, [id]);


  // gestione cambiamento dei campi
  const handleChange = (e) => {
    const { name, value } = e.target; // prendo il nome e il valore del campo
    setDay({ ...day, [name]: value }); // aggiorno lo stato del giorno
  };

  // gestione cambio delle foto
  const handlePhotoChange = (index, value) => {
    const finalUrl = value.trim(); // rimuovo eventuali spazi vuoti all'inizio/fine dell'URL inserito

    const newPhotos = [...day.photo]; // creo una copia dell'array delle foto (immutabilità in React)

    newPhotos[index] = finalUrl;  // aggiorno l'URL della foto corrispondente all'indice passato

    setDay({ ...day, photo: newPhotos }); // aggiorno lo stato "day" con il nuovo array di foto
  };


  // rimuovi foto
  const removePhoto = (index) => {
    const newPhotos = day.photo.filter((_, i) => i !== index); // filtro l'array delle foto per rimuovere quella all'indice specificato
    setDay({ ...day, photo: newPhotos }); // aggiorno lo stato del giorno
  };

  // invio al backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("date", day.date);
    formData.append("title", day.title);
    formData.append("description", day.description);

    // foto già esistenti
    day.photo.forEach((url) => {
      formData.append("existing_photos", url);
    });

    // nuove foto (file upload)
    newPhotos.forEach((file) => {
      formData.append("photos", file);
    });

    try {
      await axios.put(
        `http://127.0.0.1:8000/travels/${day.travelId}/days/${id}`,

        formData,
        { headers: { "Content-Type": "multipart/form-data" }, }

      );
      navigate(`/travels/${day.travelId}/days`);
    } catch (error) {
      console.error("Errore nell'aggiornamento:", error);
    }
  };


  if (loading) return <p>Caricamento...</p>;
  if (!day) return <p>Tappa non trovata</p>;


  return (
    <motion.div className="flex items-center justify-center bg-transparent p-8 min-h-screen"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 1.5 }}>
      <form onSubmit={handleSubmit} className="backdrop-blur-xl shadow-lg rounded-2xl p-6 w-full max-w-4xl border border-white grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Titolo + nota obbligatorio */}
        <div className="flex items-center justify-between md:col-span-2 mb-4">
          <h2 className="text-2xl font-bold text-white">✏️ Modifica Tappa</h2>
          <p className="text-sm italic text-white">* Il campo è obbligatorio</p>
        </div>

        {/* Data */}
        <div className="md:col-span-1">
          <label className="block font-medium text-white">Data *</label>
          <input
            type="text"
            name="date"
            value={day.date}
            onChange={handleChange}
            className="w-full border border-white text-white rounded-lg p-2" />
        </div>

        {/* Titolo */}
        <div className="md:col-span-1">
          <label className="block font-medium text-white">Titolo *</label>
          <input
            type="text"
            name="title"
            value={day.title}
            onChange={handleChange}
            className="w-full border border-white text-white rounded-lg p-2" />
        </div>

        {/* Descrizione */}
        <div className="md:col-span-2">
          <label className="block font-medium text-white">Descrizione *</label>
          <textarea
            name="description"
            value={day.description}
            onChange={handleChange}
            className="w-full border border-white text-white rounded-lg p-2"
            rows="4" />
        </div>

        {/* Foto */}
        <div className="md:col-span-2">
          <label className="block font-medium text-white">Foto *</label>
          {day.photo.map((url, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={url}
                onChange={(e) => handlePhotoChange(index, e.target.value)}
                className="w-full border border-white text-white rounded-lg p-2" />

              {/* Pulsante rimuovi foto */}
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="bg-red-500 hover:bg-red-400 text-white px-3 rounded cursor-pointer transition hover:scale-105">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          ))}

          {/* Input nuova foto */}
          <div className="mt-4">
            <label className="block font-medium text-white">Carica nuove foto</label>
            <div className="relative w-full">
              {/* Input file nascosto */}
              <input
                id="fileUpload"
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setNewPhotos([...newPhotos, ...Array.from(e.target.files)])}
                className="hidden"
              />

              {/* Campo di testo che simula l'input */}
              <input
                type="text"
                readOnly
                value={newPhotos.map(file => file.name).join(", ")}
                placeholder="Nessun file selezionato"
                className="w-full p-2 border border-white text-white rounded-lg bg-transparent"
              />

              {/* Bottone Carica Foto */}
              <label
                htmlFor="fileUpload"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-500 hover:bg-green-400 text-white px-3 py-1 rounded-lg cursor-pointer">
                Carica Foto
              </label>
            </div>
          </div>
        </div>

        {/* Pulsante di salvataggio */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full px-4 py-2 flex items-center justify-center gap-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 cursor-pointer transition hover:scale-105">
            <i className="fa-solid fa-edit"></i>
            Salva Modifiche
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default EditDay;
