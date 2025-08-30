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
    <div className="min-h-screen bg-transparent p-4 flex justify-center items-center">
      <div className="w-full max-w-xl max-h-screen overflow-auto backdrop-blur-xl shadow-lg rounded-2xl p-6 space-y-4 border border-white">
        <h1 className="text-2xl font-bold text-center mb-6">
          ✏️ Modifica Viaggio
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              name="town"
              value={travel.town}
              onChange={handleChange}
              placeholder="Nazione"
              className="flex-1 p-2 border border-white rounded text-white"
            />
            <input
              type="text"
              name="city"
              value={travel.city}
              onChange={handleChange}
              placeholder="Città"
              className="flex-1 p-2 border border-white rounded text-white"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="number"
              name="year"
              value={travel.year}
              onChange={handleChange}
              placeholder="Anno"
              className="w-full p-2 border border-white text-white rounded"
            />
            <input
              type="text"
              name="start_date"
              value={travel.start_date}
              onChange={handleChange}
              placeholder="Data inizio"
              className="w-full p-2 border border-white text-white rounded"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <input
            type="text"
            name="end_date"
            value={travel.end_date}
            onChange={handleChange}
            placeholder="Data fine"
            className="w-full p-2 border border-white text-white rounded"
          />

          <input
            type="number"
            name="general_vote"
            value={travel.general_vote}
            onChange={handleChange}
            min="1"
            max="5"
            className="w-full p-2 border border-white text-white rounded"
          />
          </div>

          {/* Voti dettagliati */}
          <div>
            <h3 className="font-semibold mb-2 text-white">Voti</h3>
            {Object.entries(travel.votes).map(([key, value]) => (
              <div key={key} className="flex justify-between mb-2 text-white">
                <label className="capitalize">{key}</label>
                <input
                  type="number"
                  name={key}
                  value={value}
                  onChange={handleVoteChange}
                  min="1"
                  max="5"
                  className="w-20 p-1 border border-white text-white rounded"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg cursor-pointer"
          >
            💾 Salva modifiche
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditTravel;
