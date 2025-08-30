import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditTravel() {
  const { id } = useParams(); // recupero l'ID del viaggio dall'URL
  const navigate = useNavigate(); // hook per navigare fra le pagine
  const [travel, setTravel] = useState(null); // per salvare i dati del viaggio

  // recupero i viaggi dal backend
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/travels`)
      .then((res) => {
        const t = res.data.find((tr) => tr.id === parseInt(id));
        setTravel(t);
      })
      .catch((err) => console.error(err));
  }, [id]);

  // gestisce il cambiamento dei campi principali ( town, city...)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTravel({ ...travel, [name]: value });
  };

  // gestisce il cambiamento dei voti (paesaggio, relax...)
  const handleVoteChange = (e) => {
    const { name, value } = e.target;
    setTravel({
      ...travel,
      votes: { ...travel.votes, [name]: parseInt(value) || 0 },
    });
  };

  // invio dal form e aggiorna il backend
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://127.0.0.1:8000/travels/${id}`, travel)
      .then(() => {
        alert("Viaggio aggiornato con successo!");
        navigate("/"); // torna alla home
      })
      .catch((err) => console.error(err));
  };

  if (!travel) return <p className="text-center">Caricamento...</p>;

  return (
    <div className="min-h-screen bg-transparent p-8">
      <h1 className="text-2xl font-bold text-center mb-6">
        ✏️ Modifica Viaggio
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-transparent shadow-lg rounded-2xl p-6 space-y-4"
      >
        <input
          type="text"
          name="town"
          value={travel.town}
          onChange={handleChange}
          placeholder="Nazione"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="city"
          value={travel.city}
          onChange={handleChange}
          placeholder="Città"
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="year"
          value={travel.year}
          onChange={handleChange}
          placeholder="Anno"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="start_date"
          value={travel.start_date}
          onChange={handleChange}
          placeholder="Data inizio"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="end_date"
          value={travel.end_date}
          onChange={handleChange}
          placeholder="Data fine"
          className="w-full p-2 border rounded"
        />

        {/* voto generale */}
        <input
          type="number"
          name="general_vote"
          value={travel.general_vote}
          onChange={handleChange}
          min="1"
          max="5"
          className="w-full p-2 border rounded"
        />

        {/* voti */}
        <div>
          <h3 className="font-semibold mb-2">Voti</h3>
          {Object.entries(travel.votes).map(([key, value]) => (
            <div key={key} className="flex justify-between mb-2">
              <label className="capitalize">{key}</label>
              <input
                type="number"
                name={key}
                value={value}
                onChange={handleVoteChange}
                min="1"
                max="5"
                className="w-20 p-1 border rounded"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-600 hover:bg-yellow-500 p-2 rounded-lg"
        >
          💾 Salva modifiche
        </button>
      </form>
    </div>
  );
}

export default EditTravel;
