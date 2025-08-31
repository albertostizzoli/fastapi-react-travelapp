import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddTravel() {

  const navigate = useNavigate();

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
    svago: "",
    relax: "",
  });

  // stato per mostrare messaggi di conferma/errore
  const [message, setMessage] = useState("");

  // gestisce il cambiamento dei campi input del form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // calcolo la media dei voti 
  const calculateGeneralVote = () => {
    const votes = ["cibo", "paesaggio", "attività", "svago", "relax"]
      .map((field) => parseFloat(form[field]))
      .filter((v) => !isNaN(v));

    if (votes.length === 0) return null;

    const avg = votes.reduce((a, b) => a + b, 0) / votes.length;
    return avg.toFixed(1); // restituisce una stringa con 1 decimale, es. "3.6"
  };


  // gestisce l’invio del form e salva un nuovo viaggio nel backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // calcolo il voto generale come media
      const general_vote = calculateGeneralVote()
        ? parseFloat(calculateGeneralVote())
        : null;

      // creo l'oggetto viaggio da inviare all’API
      const newTravel = {
        town: form.town,
        city: form.city,
        year: parseInt(form.year),
        start_date: form.start_date,
        end_date: form.end_date,
        general_vote: general_vote, // calcolato
        days: [], // inizialmente vuoto
        votes: {
          cibo: form.cibo ? parseInt(form.cibo) : null,
          paesaggio: form.paesaggio ? parseInt(form.paesaggio) : null,
          attività: form.attività ? parseInt(form.attività) : null,
          svago: form.svago ? parseInt(form.svago) : null,
          relax: form.relax ? parseInt(form.relax) : null,
        },
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
        svago: "",
        relax: "",
      });

      // <-- qui reindirizziamo alla Home
      navigate("/");

    } catch (err) {
      console.error(err);
      setMessage("❌ Errore durante l'aggiunta del viaggio.");
    }
  };

  return (
    <div className=" flex items-center justify-center bg-transparent p-6 overflow-hidden">
      <form
        onSubmit={handleSubmit}
        className="backdrop-blur-xl shadow-lg rounded-2xl p-6 w-full max-w-lg border"
      >
        <h2 className="text-2xl font-bold mb-4">➕ Aggiungi un nuovo viaggio</h2>

        {/* Paese e Città */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-black">Paese</label>
            <input
              type="text"
              name="town"
              value={form.town}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-black">Città</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>

        {/* Anno */}
        <div className="mb-4">
          <label className="block text-black">Anno</label>
          <input
            type="number"
            name="year"
            value={form.year}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Media Voto */}
        <div className="mb-4">
          <label className="mb-1 text-black">Media Voto</label>
          <input
            type="text"
            value={calculateGeneralVote() ?? "-"}
            readOnly
            className="w-full p-2 border font-semibold rounded "
          />
        </div>


        {/* Date */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-black">Data inizio</label>
            <input
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-black">Data fine</label>
            <input
              type="date"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>

        {/* Voti dettagliati */}
        <h3 className="font-semibold text-lg mt-6 mb-2">Voti</h3>
        <div className="grid grid-cols-2 gap-4">
          {["cibo", "paesaggio", "attività", "svago", "relax"].map((field) => (
            <div key={field}>
              <label className="block text-black capitalize">{field}</label>
              <input
                type="number"
                name={field}
                min="1"
                max="5"
                value={form[field]}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>
          ))}
        </div>

        {/* Pulsante */}
        <button
          type="submit"
          className="w-full px-4 py-2 mt-4 flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 cursor-pointer transition hover:scale-105">
          <i className="fa-solid fa-plus"></i>
          Aggiungi Viaggio
        </button>

        {message && <p className="mt-4 text-center">{message}</p>}
      </form>
    </div>
  );
}

export default AddTravel;
