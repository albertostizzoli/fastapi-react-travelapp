import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // use Navigate serve per il reindirizzamento fra le pagine
import axios from "axios";
import { motion } from "framer-motion";

function AddTravel() {

  const navigate = useNavigate(); // inizializzo useNavigate
  const [message, setMessage] = useState(""); // stato per mostrare messaggi di conferma/errore

  // stato del form con tutti i campi del viaggio
  const [form, setForm] = useState({
    town: "",
    city: "",
    year: "",
    start_date: "",
    end_date: "",
    cibo: "",
    relax: "",
    prezzo: "",
    attività: "",
    paesaggio: "",
  });

  // gestisce il cambiamento dei campi input del form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value }); // aggiorna il campo specifico
  };

  // calcolo la media dei voti 
  const calculateGeneralVote = () => {
    const votes = ["cibo", "relax", "prezzo", "attività", "paesaggio"] // campi da considerare
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

      const token = localStorage.getItem("token"); //  prendo il token

      // creo l'oggetto viaggio da inviare al backend
      const newTravel = {
        town: form.town,
        city: form.city,
        year: parseInt(form.year), // converto in numero
        start_date: form.start_date,
        end_date: form.end_date,
        general_vote: general_vote, // calcolato
        votes: {
          cibo: form.cibo ? parseInt(form.cibo) : null,
          relax: form.relax ? parseInt(form.relax) : null,
          prezzo: form.prezzo ? parseInt(form.prezzo) : null,
          attività: form.attività ? parseInt(form.attività) : null,
          paesaggio: form.paesaggio ? parseInt(form.paesaggio) : null,
        }
      };

      // invio al backend
      await axios.post("http://127.0.0.1:8000/travels", newTravel, {
        headers: { Authorization: `Bearer ${token}` }, //  aggiungo token
      });
      setMessage("✅ Viaggio aggiunto!");

      // il form si resetta dopo l'invio
      setForm({
        town: "",
        city: "",
        year: "",
        start_date: "",
        end_date: "",
        cibo: "",
        relax: "",
        prezzo: "",
        attività: "",
        paesaggio: "",
      });

      // reindirizzo alla pagina dei viaggi
      setTimeout(() => {
        setMessage(""); // fa sparire il modale
        navigate("/travels");
      }, 2000);


    } catch (err) {
      console.error(err);
      setMessage("❌ Errore durante l'aggiunta del viaggio.");
    }
  };

  return (
    <motion.div className="flex flex-col items-center justify-center bg-transparent w-full overflow-hidden min-h-screen sm:p-8 p-4"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 1.5 }}>
      {/* Container del form */}
      <div className="w-full max-w-4xl h-full sm:max-h-[calc(100vh-4rem)] overflow-auto backdrop-blur-xl shadow-lg rounded-3xl p-6 border border-white">

        {/* Titolo + nota obbligatorio */}
        <div className="flex items-center justify-between md:col-span-2 mb-4">
          <h2 className="text-2xl font-bold text-white">➕ Aggiungi un nuovo viaggio</h2>
          <p className="text-sm italic text-white">* Il campo è obbligatorio</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Paese */}
          <div className="flex flex-col">
            <label className="block font-bold text-white mb-1">Paese *</label>
            <input
              type="text"
              name="town"
              value={form.town}
              onChange={handleChange}
              required
              className="w-full p-2 font-semibold border border-white text-white rounded-full" />
          </div>

          {/* Città */}
          <div className="flex flex-col">
            <label className="block font-bold text-white mb-1">Città *</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              required
              className="w-full p-2 font-semibold border border-white text-white rounded-full" />
          </div>

          {/* Anno */}
          <div className="flex flex-col">
            <label className="block font-bold text-white mb-1">Anno *</label>
            <input
              type="number"
              name="year"
              value={form.year}
              onChange={handleChange}
              required
              className="w-full p-2 font-semibold border border-white text-white rounded-full" />
          </div>

          {/* Date */}
          <div className="flex flex-col">
            <label className="block font-bold text-white mb-1">Data Inizio *</label>
            <input
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              required
              className="w-full p-2 font-semibold border border-white text-white rounded-full [color-scheme:dark]" />
          </div>

          <div className="flex flex-col">
            <label className="block font-bold text-white mb-1">Data Fine *</label>
            <input
              type="date"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
              required
              className="w-full p-2 font-semibold border border-white text-white rounded-full [color-scheme:dark]" />
          </div>

          {/* Voti dettagliati con flex-wrap */}
          <div className="md:col-span-2">
            <h3 className="font-bold mt-6 mb-2 text-white">Voti *</h3>
            <div className="flex flex-wrap gap-4">
              {["cibo", "relax", "prezzo", "attività", "paesaggio"].map((field) => ( // mappa i campi dei voti
                <div key={field} className="flex flex-col w-16">
                  <label className="capitalize mb-1 font-bold text-white">{field}</label>
                  <input
                    type="number"
                    name={field}
                    min="1"
                    max="5"
                    value={form[field]}
                    onChange={handleChange}
                    className="w-16 font-semibold p-2 border border-white text-white rounded-3xl" />
                </div>
              ))}
            </div>
          </div>

          {/* Media Voto */}
          <div className="md:col-span-2 mt-1">
            <label className="pe-3 font-bold text-white">Media Voti</label>
            <input
              type="text"
              value={calculateGeneralVote() ?? "-"}
              readOnly
              className="w-16 p-2 font-semibold border border-white text-white rounded-full" />
          </div>

          {/* Pulsante */}
          <div className="md:col-span-2 flex justify-center gap-2">
            <Link
              to="/travels"
              className="font-semibold w-full px-4 py-2 flex items-center justify-center gap-2 bg-red-500 text-white rounded-full hover:bg-red-400 cursor-pointer transition hover:scale-105">
              <i className="fa-solid fa-arrow-left"></i>
              Torna ai Viaggi
            </Link>
            <button
              type="submit"
              className="font-semibold w-full px-4 py-2  flex items-center justify-center gap-2 bg-green-500 text-white rounded-full hover:bg-green-400 cursor-pointer transition hover:scale-105">
              <i className="fa-solid fa-plus"></i>
              Aggiungi Viaggio
            </button>
          </div>
        </form>
      </div>
      {/* Modale di conferma */}
      {message && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.5 }}
          className="fixed top-6 right-6 backdrop-blur-xl border border-white
               text-white px-6 py-3 rounded-full shadow-lg z-[9999]">
          <p className="text-lg font-semibold">{message}</p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default AddTravel;
