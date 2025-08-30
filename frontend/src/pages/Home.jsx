import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Home() {
  const [travels, setTravels] = useState([]);
  const [openTravel, setOpenTravel] = useState(null); // id viaggio aperto
  const [deleteId, setDeleteId] = useState(null); // id viaggio da eliminare

// uso lo useEffect per ottenere i dati dei viaggi
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/travels")
      .then((res) => setTravels(res.data))
      .catch((err) => console.error(err));
  }, []);

  // mi serve per ottenere l'effetto di apertura dell'accordion
  const toggleAccordion = (id) => {
    setOpenTravel(openTravel === id ? null : id);
  };

  // con questa cancello tutti i dati del viaggio
  const handleDelete = () => {
    axios
      .delete(`http://127.0.0.1:8000/travels/${deleteId}`)
      .then(() => {
        setTravels(travels.filter((t) => t.id !== deleteId)); // aggiorna lista
        setDeleteId(null); // chiudi modale
      })
      .catch((err) => console.error(err));
  };

    return (
    <div className="min-h-screen bg-transparent p-8">
      <h1 className="text-3xl font-bold text-center mb-8">🌍 I miei viaggi</h1>

      <div className="max-w-3xl mx-auto space-y-4">
        {travels.map((v) => (
          <div
            key={v.id}
            className="backdrop-blur-xl shadow-lg rounded-2xl border border-gray-200"
          >
            {/* intestazione accordion */}
            <button
              onClick={() => toggleAccordion(v.id)}
              className="w-full flex justify-between items-center p-4 text-left"
            >
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {v.town} - {v.city}
                </h2>
                <p className="text-white text-sm">
                  📅 {v.start_date} → {v.end_date}
                </p>
              </div>
              <span className="text-gray-800">
                {openTravel === v.id ? "▲" : "▼"}
              </span>
            </button>

            {/* contenuto accordion */}
            {openTravel === v.id && (
              <div className="px-4 pb-4 border-t">
                <p className="text-white font-medium mt-2 mb-4">
                  Anno: {v.year} | Voto generale:{" "}
                  {Array.from({ length: v.general_vote || 0 }, (_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </p>

                {/* voti */}
                {v.votes && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-white mb-2">Voti:</h3>
                    <ul className="grid grid-cols-2 gap-2 text-sm text-white">
                      {Object.entries(v.votes).map(([key, value]) => (
                        <li key={key} className="flex justify-between">
                          <span className="capitalize">{key}:</span>
                          <span>
                            {Array.from({ length: value }, (_, i) => (
                              <span key={i}>⭐</span>
                            ))}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Pulsanti sotto l'accordion */}
                <div className="flex gap-3">
                  <Link
                    to={`/travels/${v.id}/days`}
                    className="p-2 bg-blue-500 hover:bg-blue-400 rounded-lg text-white"
                  >
                    Dettagli Viaggio
                  </Link>

                  <Link
                    to={`/travels/${v.id}/edit`}
                    className="p-2 bg-yellow-500 hover:bg-yellow-400 rounded-lg text-white"
                  >
                    Modifica Viaggio
                  </Link>

                  <button
                    onClick={() => setDeleteId(v.id)}
                    className="p-2 bg-red-600 hover:bg-red-500 rounded-lg text-white"
                  >
                    Elimina Viaggio
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modale di conferma eliminazione */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xl bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 text-center">
            <h2 className="text-xl font-bold mb-4">
              Sei sicuro di voler cancellare il viaggio?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg"
              >
               Sì
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg"
              >
               No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
