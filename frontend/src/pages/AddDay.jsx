import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function AddDay() {
  const location = useLocation();
  const navigate = useNavigate(); 
  const travelIdFromState = location.state?.travelId || ""; // id passato da TravelDays per avere il viaggio già selezionato

  const [travels, setTravels] = useState([]); // lista viaggi esistenti
  const [selectedTravel, setSelectedTravel] = useState("");
  const [form, setForm] = useState({
    date: "",
    notes: "",
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
        notes: form.notes,
        description: form.description,
        photo: form.photo.filter((p) => p.trim() !== ""), // tolgo vuoti
      };

      await axios.post(
        `http://127.0.0.1:8000/travels/${selectedTravel}/days`,
        newDay
      );

      setMessage("✅ Giorno aggiunto con successo!");
      setForm({ date: "", notes: "", description: "", photo: [""] });

      // <-- reindirizzo alla pagina dei giorni del viaggio selezionato
      navigate(`/travels/${selectedTravel}/days`);

    } catch (err) {
      console.error(err);
      setMessage("❌ Errore durante l'aggiunta del giorno.");
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent p-6">
      <form
        onSubmit={handleSubmit}
        className="backdrop-blur-xl shadow-lg rounded-2xl p-6 w-full max-w-lg border border-white"
      >
        <h2 className="text-2xl font-bold mb-4 text-white">➕ Aggiungi un giorno al viaggio</h2>

        {/* Selezione viaggio */}
        <div className="mb-4">
          <label className="block text-white">Seleziona viaggio</label>
          <select
            value={selectedTravel}
            onChange={(e) => setSelectedTravel(e.target.value)}
            className="w-full p-2 border border-white rounded-lg bg-transparent text-white"
            required
          >
            <option value="" className="bg-black text-white">-- Seleziona --</option>
            {travels.map((t) => (
              <option key={t.id} value={t.id} className="bg-black text-white">
                {t.city} ({t.year})
              </option>
            ))}
          </select>
        </div>

        {/* Data */}
        <div className="mb-4">
          <label className="block text-white">Data</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full p-2 border border-white rounded-lg text-white bg-transparent 
               [color-scheme:dark]"
          />
        </div>


        {/* Titolo */}
        <div className="mb-4">
          <label className="block text-white">Titolo</label>
          <input
            name="notes"
            value={form.notes}
            onChange={handleChange}
            className="w-full p-2 border border-white text-white rounded-lg"
          />
        </div>

        {/* Descrizione */}
        <div className="mb-4">
          <label className="block text-white">Riassunto della giornata</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-2 border border-white text-white rounded-lg"
            rows="3"
          />
        </div>

        {/* Foto */}
        <div className="mb-4">
          <label className="block text-white">Foto (URL)</label>
          {form.photo.map((p, index) => (
            <input
              key={index}
              type="text"
              value={p}
              onChange={(e) => handlePhotoChange(index, e.target.value)}
              placeholder="Inserisci URL immagine"
              className="w-full p-2 border border-white text-white rounded-lg mb-2"
            />
          ))}
          <button
            type="button"
            onClick={addPhotoField}
            className="text-white text-sm hover:underline">
            Aggiungi un'altra foto
          </button>
        </div>

        {/* Pulsante */}
        <button
          type="submit"
          className="w-full px-4 py-2 flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 cursor-pointer transition hover:scale-105">
          <i className="fa-solid fa-plus"></i>
          Aggiungi Giorno
        </button>

        {message && <p className="mt-4 text-center">{message}</p>}
      </form>
    </div>
  );
}

export default AddDay;
