import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

function EditDay() {
  const { id } = useParams();   // recupero l'ID del giorno dall'URL
  const navigate = useNavigate(); // hook per navigare fra le pagine
  const [day, setDay] = useState(null); // per salvare i dati del giorno
  const [loading, setLoading] = useState(true);

  // recupero i dati del giorno dal backend
  useEffect(() => {
  axios
    .get(`http://127.0.0.1:8000/travels`)
    .then((res) => {
      let dayFound = null;
      res.data.forEach((travel) => {
        const d = travel.days.find((day) => day.id === parseInt(id));
        if (d) dayFound = d;
      });
      setDay(dayFound);
      setLoading(false);
    })
    .catch((err) => console.error(err));
}, [id]);


  // gestione cambiamento dei campi
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDay({ ...day, [name]: value });
  };

  // gestione cambio delle foto
  const handlePhotoChange = (index, value) => {
    const newPhotos = [...day.photo];
    newPhotos[index] = value;
    setDay({ ...day, photo: newPhotos });
  };

  // aggiungi nuova foto
  const addPhoto = () => {
    setDay({ ...day, photo: [...day.photo, ""] });
  };

  // rimuovi foto
  const removePhoto = (index) => {
    const newPhotos = day.photo.filter((_, i) => i !== index);
    setDay({ ...day, photo: newPhotos });
  };

  // invio al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:8000/days/${id}`, day);
      navigate("/days"); // torna alla lista
    } catch (error) {
      console.error("Errore nell'aggiornamento:", error);
    }
  };

  if (loading) return <p>Caricamento...</p>;
  if (!day) return <p>Giorno non trovato</p>;

  return (
    <motion.div
      className="max-w-2xl mx-auto p-6 backdrop-blur-xl shadow-lg rounded-2xl border"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold mb-4">Modifica Giorno</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Data */}
        <div>
          <label className="block font-medium">Data</label>
          <input
            type="text"
            name="date"
            value={day.date}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Titolo */}
        <div>
          <label className="block font-medium">Titolo</label>
          <input
            type="text"
            name="title"
            value={day.title}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Descrizione */}
        <div>
          <label className="block font-medium">Descrizione</label>
          <textarea
            name="description"
            value={day.description}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Foto */}
        <div>
          <label className="block font-medium">Foto</label>
          {day.photo.map((url, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={url}
                onChange={(e) => handlePhotoChange(index, e.target.value)}
                className="w-full border rounded p-2"
              />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="bg-red-500 text-white px-3 rounded"
              >
                X
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addPhoto}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            + Aggiungi Foto
          </button>
        </div>

        {/* Latitudine */}
        <div>
          <label className="block font-medium">Latitudine</label>
          <input
            type="number"
            step="any"
            name="lat"
            value={day.lat}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Longitudine */}
        <div>
          <label className="block font-medium">Longitudine</label>
          <input
            type="number"
            step="any"
            name="lng"
            value={day.lng}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Pulsante di salvataggio */}
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded-lg shadow">
          Salva Modifiche
        </button>
      </form>
    </motion.div>
  );
}

export default EditDay;
