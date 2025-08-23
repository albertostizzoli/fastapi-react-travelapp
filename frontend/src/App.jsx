import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [travels, setTravels] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/travels")
      .then((res) => setTravels(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">🌍 I miei viaggi</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {travels.map((v) => (
          <div
            key={v.id}
            className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200"
          >
            {/* intestazione viaggio */}
            <h2 className="text-xl font-semibold mb-2">
              {v.town} - {v.city}
            </h2>
            <p className="text-gray-600 text-sm mb-2">
              📅 {v.start_date} → {v.end_date}
            </p>
            <p className="text-gray-700 font-medium mb-4">
              Anno: {v.year} | Voto generale: ⭐ {v.general_vote}
            </p>

            {/* voti */}
            {v.votes && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">Voti:</h3>
                <ul className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                  {Object.entries(v.votes).map(([key, value]) => (
                    <li key={key} className="flex justify-between">
                      <span className="capitalize">{key}:</span>
                      <span>⭐ {value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* giorni */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Giorni:</h3>
              <ul className="space-y-3">
                {v.days.map((d) => (
                  <li
                    key={d.id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <p className="text-sm text-gray-500">{d.date}</p>
                    <p className="font-medium">{d.notes}</p>
                    {d.photo.length > 0 && (
                      <div className="flex gap-2 mt-2">
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

