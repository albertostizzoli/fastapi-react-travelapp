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
    <div className="min-h-screen bg-transparent p-6 md:p-12">
      {/* Header: Titolo + Pulsanti */}
      <div className="flex flex-wrap justify-between items-center mb-8 max-w-4xl mx-auto gap-4">
        <h1 className="text-3xl font-bold text-white flex-1 min-w-[200px]">
          🗓️ Giorni del viaggio
        </h1>
        <div className="flex gap-4 flex-wrap mt-2 sm:mt-0">
          <Link
            to="/addDay"
            state={{ travelId: id }}
            className="px-4 py-2 bg-green-500 hover:bg-green-400 rounded-lg text-white font-medium shadow-md transition hover:scale-105"
          >
            Aggiungi Giorno
          </Link>
          <Link
            to="/"
            className="px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg text-white font-medium shadow-md transition hover:scale-105"
          >
            Torna ai viaggi
          </Link>
        </div>
      </div>

      {/* Info Viaggio */}
      <div className="max-w-4xl mx-auto mb-8 p-6 bg-transparent rounded-xl">
        <h2 className="text-xl font-semibold text-white mb-2">
          📍 {travel.town} - {travel.city}
        </h2>
        <p className="text-gray-300 mb-4">📅 {travel.start_date} → {travel.end_date}</p>
        {travel.notes && <p className="text-gray-200 italic">{travel.notes}</p>}
      </div>

      {/* Lista Giorni */}
      <div className="max-w-4xl mx-auto space-y-6">
        {travel.days.map((d) => (
          <li
            key={d.id}
            className="backdrop-blur-xl p-4 md:p-6 rounded-xl shadow-md border border-gray-700 list-none transition hover:scale-105"
          >
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                <p className="text-white text-sm mb-1">{d.date}</p>
                <p className="text-white font-medium mb-2">{d.notes}</p>
                {d.photo.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {d.photo.map((p, i) => (
                      <img
                        key={i}
                        src={p}
                        alt="foto viaggio"
                        className="w-24 h-24 object-cover rounded-lg border border-gray-600 shadow-sm"
                      />
                    ))}
                  </div>
                )}
                <p className="text-white mt-2">{d.description}</p>
              </div>
              <button
                onClick={() => setDeleteDayId(d.id)}
                className="mt-4 md:mt-0 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg shadow-md transition hover:scale-105 cursor-pointer"
              >
                Elimina Giorno
              </button>
            </div>
          </li>
        ))}
      </div>

      {/* Modale di conferma eliminazione giorno */}
      {deleteDayId && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent z-50">
          <div className="backdrop-blur-xl p-6 rounded-xl shadow-lg w-80 text-center">
            <h2 className="text-xl font-bold mb-4 text-white">
              Vuoi davvero eliminare questo giorno?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDeleteDay}
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg shadow-md transition hover:scale-105 cursor-pointer"
              >
                Sì
              </button>
              <button
                onClick={() => setDeleteDayId(null)}
                className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-lg shadow-md transition hover:scale-105 cursor-pointer"
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
