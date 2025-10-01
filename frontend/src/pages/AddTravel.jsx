import { useState } from "react";
import { useNavigate } from "react-router-dom"; // use Navigate serve per il reindirizzamento fra le pagine
import axios from "axios";
import { motion } from "framer-motion";

function AddTravel() {

  const navigate = useNavigate(); // inizializzo useNavigate

  // stato del form con tutti i campi del viaggio
  const [form, setForm] = useState({
    town: "",
    city: "",
    year: "",
    start_date: "",
    end_date: "",
    cibo: "",
    paesaggio: "",
    attività: "",
    relax: "",
    prezzo: "",
  });

  // stato per mostrare messaggi di conferma/errore
  const [message, setMessage] = useState("");

  // gestisce il cambiamento dei campi input del form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value }); // aggiorna il campo specifico
  };

  // calcolo la media dei voti 
  const calculateGeneralVote = () => {
    const votes = ["cibo", "paesaggio", "attività", "relax", "prezzo"] // campi da considerare
      .map((field) => parseFloat(form[field])) // converto in numeri
      .filter((v) => !isNaN(v)); // filtro quelli validi

    if (votes.length === 0) return null; // nessun voto valido

    const avg = votes.reduce((a, b) => a + b, 0) / votes.length; // calcolo la media
    return avg.toFixed(1); // restituisce una stringa con 1 decimale, es. "3.6"
  };


  // gestisce l’invio del form e salva un nuovo viaggio nel backend
  const handleSubmit = async (e) => {
    e.preventDefault(); // previene il comportamento di default del form

    try {
      // calcolo il voto generale come media
      const general_vote = calculateGeneralVote() // se c’è almeno un voto
        ? parseFloat(calculateGeneralVote()) // lo converto in numero
        : null; // altrimenti null

      const userId = localStorage.getItem("userId");  // recupero l’id salvato

      // creo l'oggetto viaggio da inviare al backend
      const newTravel = {
        town: form.town,
        city: form.city,
        year: parseInt(form.year), // converto in numero
        start_date: form.start_date,
        end_date: form.end_date,
        general_vote: general_vote, // calcolato
        days: [], // inizialmente vuoto
        votes: {
          cibo: form.cibo ? parseInt(form.cibo) : null,
          paesaggio: form.paesaggio ? parseInt(form.paesaggio) : null,
          attività: form.attività ? parseInt(form.attività) : null,
          relax: form.relax ? parseInt(form.relax) : null,
          prezzo: form.prezzo ? parseInt(form.prezzo) : null,
        },
        user_id: parseInt(userId),
      };

      // invio al backend
      await axios.post("http://127.0.0.1:8000/travels", newTravel);
      setMessage("✅ Viaggio aggiunto con successo!");

      // il form si resetta dopo l'invio
      setForm({
        town: "",
        city: "",
        year: "",
        start_date: "",
        end_date: "",
        cibo: "",
        paesaggio: "",
        attività: "",
        relax: "",
        prezzo: "",
      });

      // reindirizzo alla pagina dei viaggi
      navigate("/travels");

    } catch (err) {
      console.error(err);
      setMessage("❌ Errore durante l'aggiunta del viaggio.");
    }
  };

  return (
    <motion.div className="flex flex-col items-center justify-center bg-transparent w-full overflow-hidden min-h-screen p-8"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 1.5 }}>
      {/* Container del form */}
      <div className="w-full max-w-4xl h-full sm:max-h-[calc(100vh-4rem)] overflow-auto backdrop-blur-xl shadow-lg rounded-2xl p-6 border border-white">

        {/* Titolo + nota obbligatorio */}
        <div className="flex items-center justify-between md:col-span-2 mb-4">
          <h2 className="text-2xl font-bold text-white">➕ Aggiungi un nuovo viaggio</h2>
          <p className="text-sm italic text-white">* Il campo è obbligatorio</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Paese */}
          <div className="flex flex-col">
            <label className="mb-1 text-white">Paese *</label>
            <input
              type="text"
              name="town"
              value={form.town}
              onChange={handleChange}
              required
              className="w-full p-2 border border-white text-white rounded-lg" />
          </div>

          {/* Città */}
          <div className="flex flex-col">
            <label className="mb-1 text-white">Città *</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              required
              className="w-full p-2 border border-white text-white rounded-lg" />
          </div>

          {/* Anno */}
          <div className="flex flex-col">
            <label className="mb-1 text-white">Anno *</label>
            <input
              type="number"
              name="year"
              value={form.year}
              onChange={handleChange}
              required
              className="w-full p-2 border border-white text-white rounded-lg" />
          </div>

          {/* Media Voto */}
          <div className="flex flex-col">
            <label className="mb-1 text-white">Media Voto</label>
            <input
              type="text"
              value={calculateGeneralVote() ?? "-"}
              readOnly
              className="w-full p-2 border border-white text-white font-semibold rounded" />
          </div>

          {/* Date */}
          <div className="flex flex-col">
            <label className="mb-1 text-white">Data Inizio *</label>
            <input
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              required
              className="w-full p-2 border border-white text-white rounded-lg [color-scheme:dark]" />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-white">Data Fine *</label>
            <input
              type="date"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
              required
              className="w-full p-2 border border-white text-white rounded-lg [color-scheme:dark]" />
          </div>

          {/* Voti dettagliati con flex-wrap */}
          <div className="md:col-span-2">
            <h3 className="font-semibold text-lg mt-6 mb-2 text-white">Voti *</h3>
            <div className="flex flex-wrap gap-4">
              {["cibo", "paesaggio", "attività", "relax", "prezzo"].map((field) => ( // mappa i campi dei voti
                <div key={field} className="flex flex-col w-28">
                  <label className="mb-1 text-white capitalize">{field}</label>
                  <input
                    type="number"
                    name={field}
                    min="1"
                    max="5"
                    value={form[field]}
                    onChange={handleChange}
                    className="w-full p-2 border border-white text-white rounded-lg" />
                </div>
              ))}
            </div>
          </div>

          {/* Pulsante */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full px-4 py-2 mt-4 flex items-center justify-center gap-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 cursor-pointer transition hover:scale-105">
              <i className="fa-solid fa-plus"></i>
              Aggiungi Viaggio
            </button>
          </div>

          {message && <p className="mt-4 text-center md:col-span-2">{message}</p>}
        </form>
      </div>
    </motion.div>
  );
}

export default AddTravel;
