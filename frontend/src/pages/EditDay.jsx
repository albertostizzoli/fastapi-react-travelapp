import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

function EditDay() {
  const { id } = useParams();   // recupero l'ID del giorno dall'URL
  const navigate = useNavigate(); // hook per navigare fra le pagine
  const [day, setDay] = useState(null); // per salvare i dati del giorno
  const [loading, setLoading] = useState(true); // stato di caricamento

  // recupero i dati del giorno dal backend
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/travels`) // recupero tutti i viaggi
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
    const newPhotos = [...day.photo]; // creo una copia dell'array delle foto
    newPhotos[index] = value; // aggiorno la foto all'indice specificato
    setDay({ ...day, photo: newPhotos }); // aggiorno lo stato del giorno
  };

  // aggiungi nuova foto
  const addPhoto = () => {
    setDay({ ...day, photo: [...day.photo, ""] }); // aggiungo una nuova foto vuota
  };

  // rimuovi foto
  const removePhoto = (index) => {
    const newPhotos = day.photo.filter((_, i) => i !== index); // filtro l'array delle foto per rimuovere quella all'indice specificato
    setDay({ ...day, photo: newPhotos }); // aggiorno lo stato del giorno
  };

  // invio al backend
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevengo il comportamento di default del form
    try {
      await axios.put(`http://127.0.0.1:8000/travels/${day.travelId}/days/${id}`, day); // invio i dati aggiornati al backend
      navigate(`/travels/${day.travelId}/days`); // torna alla lista
    } catch (error) {
      console.error("Errore nell'aggiornamento:", error); // gestisco gli errori
    }
  };

  if (loading) return <p>Caricamento...</p>;
  if (!day) return <p>Tappa non trovata</p>;

  // Animazione
  const editDay = {
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
    <motion.div className="flex items-center justify-center bg-transparent" variants={editDay} initial="initial" animate="animate" exit="exit">
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
            rows="3" />
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

          {/*Pulsante aggiungi foto */}
          <button
            type="button"
            onClick={addPhoto}
            className="px-4 py-2 flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 cursor-pointer transition hover:scale-105">
            <i className="fa-solid fa-plus"></i>
            Aggiungi Foto
          </button>
        </div>

        {/* Pulsante di salvataggio */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full px-4 py-2 flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 cursor-pointer transition hover:scale-105">
            <i className="fa-solid fa-edit"></i>
            Salva Modifiche
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default EditDay;
