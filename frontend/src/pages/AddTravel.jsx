import { useState } from "react";
import axios from "axios";

function AddTravel() {
  // stato del form con tutti i campi del viaggio
  const [form, setForm] = useState({
    town: "",
    city: "",
    year: "",
    start_date: "",
    end_date: "",
    general_vote: "",
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

  // gestisce l’invio del form e salva un nuovo viaggio nel backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // creo l'oggetto viaggio da inviare all’API
      const newTravel = {
        town: form.town,
        city: form.city,
        year: parseInt(form.year),
        start_date: form.start_date,
        end_date: form.end_date,
        general_vote: form.general_vote ? parseInt(form.general_vote) : null,
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
        general_vote: "",
        cibo: "",
        paesaggio: "",
        attività: "",
        svago: "",
        relax: "",
      });
    } catch (err) {
      console.error(err);
      setMessage("❌ Errore durante l'aggiunta del viaggio.");
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg border"
      >
        <h2 className="text-2xl font-bold mb-4">➕ Aggiungi un nuovo viaggio</h2>
        {/* Paese e Città */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700">Paese</label>
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
            <label className="block text-gray-700">Città</label>
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

        {/* Anno e Voto generale */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700">Anno</label>
            <input
              type="number"
              name="year"
              value={form.year}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-700">Voto generale (1-5)</label>
            <input
              type="number"
              name="general_vote"
              min="1"
              max="5"
              value={form.general_vote}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>

        {/* Date */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700">Data inizio</label>
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
            <label className="block text-gray-700">Data fine</label>
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
        <h3 className="font-semibold text-lg mt-6 mb-2">Voti dettagliati</h3>
        <div className="grid grid-cols-2 gap-4">
          {["cibo", "paesaggio", "attività", "svago", "relax"].map((field) => (
            <div key={field}>
              <label className="block text-gray-700 capitalize">
                {field} (1-5)
              </label>
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
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 mt-4"
        >
          Aggiungi viaggio
        </button>

        {message && <p className="mt-4 text-center">{message}</p>}
      </form>
    </div>
  );
}

export default AddTravel;
