import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import WorldMap from "../components/WorldMap";

function TravelDays() {
  const { id } = useParams();
  const [travel, setTravel] = useState(null);
  const [deleteDayId, setDeleteDayId] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null); // nuovo stato per il modale Leggi Tutto

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
        setTravel({
          ...travel,
          days: travel.days.filter((d) => d.id !== deleteDayId),
        });
        setDeleteDayId(null);
      })
      .catch((err) => console.error(err));
  };

  if (!travel) return <p className="text-center mt-8">⏳ Caricamento...</p>;

  return (
    <div className="min-h-screen bg-transparent p-6 md:p-12">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-8 max-w-6xl mx-auto gap-4">
        <h1 className="text-3xl font-bold text-white flex-1 min-w-[200px]">
          🗓️ Giorni del viaggio
        </h1>
        <Link
          to="/addDay"
          state={{ travelId: id }}
          className="px-4 py-2 flex items-center gap-2 bg-green-500 hover:bg-green-400 rounded-lg text-white font-medium shadow-md transition hover:scale-105" >
          <i className="fa-solid fa-plus"></i> Aggiungi Giorno
        </Link>
      </div>

      {/* Layout principale */}
      <div className="flex flex-col lg:flex-row max-w-6xl mx-auto gap-8">
        {/* Colonna sinistra */}
        <div className="flex-1 space-y-6">
          {/* Info Viaggio */}
          <div className="p-6 bg-transparent rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-2">
              📍 {travel.town} - {travel.city}
            </h2>
            <p className="text-white mb-4">
              📅 {travel.start_date} → {travel.end_date}
            </p>
            {travel.title && <p className="text-gray-200 italic">{travel.title}</p>}
          </div>

          {/* Lista Giorni in griglia */}
          {travel.days?.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {travel.days.map((d) => (
                <div
                  key={d.id}
                  className="backdrop-blur-xl p-4 rounded-xl shadow-lg border border-gray-700 flex flex-col justify-between w-64">
                  <div className="mb-4">
                    <p className="text-gray-300 text-sm">{d.date}</p>
                    <p className="text-white font-semibold text-lg">{d.title}</p>
                  </div>

                  {d.photo.length > 0 && (
                    <div className="flex gap-2 flex-wrap mb-4">
                      {d.photo.slice(0, 2).map((p, i) => (
                        <img
                          key={i}
                          src={p}
                          alt="foto viaggio"
                          className="w-20 h-20 object-cover rounded-lg border border-gray-600 shadow-sm"
                        />
                      ))}
                      {d.photo.length > 2 && (
                        <span className="text-gray-400 text-sm mt-2">
                          +{d.photo.length - 2} altre foto
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setSelectedDay(d)}
                      className="px-4 py-2 flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-md transition hover:scale-105 cursor-pointer">
                      <i className="fa-solid fa-book-open mr-2"></i> Leggi Tutto
                    </button>

                    <button
                      onClick={() => setDeleteDayId(d.id)}
                      className="px-4 py-2 flex items-center justify-center bg-red-600 hover:bg-red-500 text-white rounded-lg shadow-md transition hover:scale-105 cursor-pointer">
                      <i className="fa-solid fa-trash mr-2"></i> Elimina Giorno
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white text-center mt-4">Nessun giorno presente</p>
          )}

          {/* Mappa sotto le card */}
          <div className="mt-8 w-full">
            <WorldMap days={travel.days} />
          </div>
        </div>
      </div>

      {/* Modale Leggi Tutto */}
      {selectedDay && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-2 sm:p-4 overflow-auto z-[9999]">
          <div className="bg-gray-800 rounded-xl p-4 sm:p-6 w-full max-w-full sm:max-w-5xl max-h-[90vh] overflow-y-auto shadow-lg">

            {/* Titolo + Pulsante Chiudi */}
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white">{selectedDay.title}</h2>
              <button
                onClick={() => setSelectedDay(null)}
                className="px-3 py-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-400 text-white rounded-lg shadow-md transition hover:scale-105 cursor-pointer">
                <i className="fa-solid fa-arrow-left"></i> Chiudi
              </button>
            </div>

            {/* Descrizione */}
            <p className="text-white mb-4">{selectedDay.description}</p>

            {/* Foto */}
            {selectedDay.photo.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {selectedDay.photo.map((p, i) => (
                  <img
                    key={i}
                    src={p}
                    alt="foto viaggio"
                    className="w-full h-40 sm:h-40 object-cover rounded-lg border border-gray-600 shadow-sm"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

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
                className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg shadow-md transition hover:scale-105 cursor-pointer">
                <i className="fa-solid fa-check"></i> Sì
              </button>
              <button
                onClick={() => setDeleteDayId(null)}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-lg shadow-md transition hover:scale-105 cursor-pointer">
                <i className="fa-solid fa-xmark"></i> No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TravelDays;
