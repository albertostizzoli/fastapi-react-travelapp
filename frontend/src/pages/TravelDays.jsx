import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function TravelDays() {
  const { id } = useParams(); // prendo l'id del viaggio dall’URL
  const [travel, setTravel] = useState(null);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/travels/${id}`)
      .then((res) => setTravel(res.data))
      .catch((err) => console.error(err));
  }, [id]);

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
            </li>
          ))}
        </ul>

        <Link
          to="/"
          className=" p-2 inline-block mt-6 bg-blue-500 hover:bg-blue-400 rounded-full text-white"
        >
        Torna ai viaggi
        </Link>
      </div>
    </div>
  );
}

export default TravelDays;
