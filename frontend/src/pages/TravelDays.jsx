import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function TravelDays() {
  const { id } = useParams(); // id del viaggio dall’URL
  const [travel, setTravel] = useState(null);
  const [deleteDayId, setDeleteDayId] = useState(null); // id del giorno da eliminare

  useEffect(() => {
    fetchTravel();
  }, [id]);

  const fetchTravel = () => {
    axios
      .get(`http://127.0.0.1:8000/travels/${id}`)
      .then((res) => setTravel(res.data))
      .catch((err) => console.error(err));
  };

  const handleDeleteDay = () => {
    axios
      .delete(`http://127.0.0.1:8000/travels/${id}/days/${deleteDayId}`)
      .then(() => {
        // aggiorno localmente lo stato rimuovendo il giorno eliminato
        setTravel({
          ...travel,
          days: travel.days.filter((d) => d.id !== deleteDayId),
        });
        setDeleteDayId(null); // chiudo il modale
      })
      .catch((err) => console.error(err));
  };

  if (!travel) return <p className="text-center mt-8">⏳ Caricamento...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">
          📍 {travel.town} - {travel.city}
        </h1>
        <p className="text-gray-600 mb-6">
          Dal {travel.start_date} al {travel.end_date}
        </p>

        <h2 className="text-xl font-semibold mb-4">🗓️ Giorni del viaggio</h2>

        <ul className="space-y-3">
          {travel.days.map((d) => (
            <li
              key={d.id}
              className="p-3 bg-white shadow rounded-lg border border-gray-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">{d.date}</p>
                  <p className="font-medium">{d.notes}</p>
                  {d.photo.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {d.photo.map((p, i) => (
                        <img
                          key={i}
                          src={p}
                          alt="foto viaggio"
                          className="w-20 h-20 object-cover rounded-lg border"
                        />
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-gray-500">{d.description}</p>
                </div>
                <button
                  onClick={() => setDeleteDayId(d.id)}
                  className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-lg"
                >
                Elimina Giorno
                </button>
              </div>
            </li>
          ))}
        </ul>

        <Link
          to="/"
          className="p-2 inline-block mt-6 bg-blue-500 hover:bg-blue-400 rounded-full text-white"
        >
        Torna ai viaggi
        </Link>
      </div>

      {/* Modale di conferma eliminazione giorno */}
      {deleteDayId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 text-center">
            <h2 className="text-xl font-bold mb-4">
              Vuoi davvero eliminare questo giorno?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDeleteDay}
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg"
              >
                Sì
              </button>
              <button
                onClick={() => setDeleteDayId(null)}
                className="bg-red-400 hover:bg-red-300 text-white px-4 py-2 rounded-lg"
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

export default TravelDays;
