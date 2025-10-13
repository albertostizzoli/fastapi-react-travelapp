import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

function EditDay() {
  const { id } = useParams();   // recupero l'ID del giorno dall'URL
  const navigate = useNavigate(); // hook per navigare fra le pagine
  const [day, setDay] = useState(null); // per salvare i dati del giorno
  const [loading, setLoading] = useState(true); // stato di caricamento
  const fileInputRef = useRef(null); // riferimento all’input nascosto
  const [openImage, setOpenImage] = useState(null); // stato per l'immagine ingrandita (Apri / Chiudi) 

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

  // Funzione per gestire la selezione della foto
  const handlePhotoSelect = () => {
    fileInputRef.current.click(); // simula il click sull’input file nascosto
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);

    if (newFiles.length > 0) {
      setDay((prevForm) => {
        const updatedPhotos = [...(prevForm.photo || []), ...newFiles];
        return { ...prevForm, photo: updatedPhotos };
      });
    }
    e.target.value = null; // reset input
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
    day.photo.forEach((item) => {
      if (typeof item === "string") {
        // URL già salvato
        formData.append("existing_photos", item);
      } else {
        // File nuovo
        formData.append("photos", item);
      }
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
    <motion.div className="flex items-center justify-center bg-transparent sm:p-8 p-4 min-h-screen"
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
          {/* Foto esistenti + nuove foto */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
            {day.photo.map((item, index) => {
              // se è una stringa, è un URL dal DB
              const src =
                typeof item === "string"
                  ? item.startsWith("http")
                    ? item
                    : `http://127.0.0.1:8000/${item}`
                  // se è un File (nuova foto)
                  : URL.createObjectURL(item);

              // visualizzo le foto
              return (
                <div key={index} className="relative group">
                  <img
                    onClick={() => setOpenImage(src)} // apri immagine cliccata
                    src={src}
                    alt={`Foto ${index + 1}`}
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
                      className="fixed inset-0 backdrop-blur-3xl flex items-center justify-center z-[9999]">
                      {/* prevengo la chiusura quando clicco sull'immagine o sulla X */}
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative">
                        {/* Bottone X */}
                        <button
                          onClick={() => setOpenImage(null)} // chiude il modale
                          className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full p-2 shadow-lg cursor-pointer">
                          <i className="fa-solid fa-xmark text-lg"></i>
                        </button>

                        {/* Immagine ingrandita */}
                        <img
                          src={openImage.replace("w=400", "w=1600")}
                          alt="Immagine ingrandita"
                          className="sm:max-w-4xl max-h-[90vh] rounded-lg shadow-lg"
                        />
                      </div>
                    </div>
                  )}
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
