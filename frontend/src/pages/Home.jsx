import { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const [travels, setTravels] = useState([]);
  const [openTravel, setOpenTravel] = useState(null); // id viaggio aperto

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/travels")
      .then((res) => setTravels(res.data))
      .catch((err) => console.error(err));
  }, []);

  const toggleAccordion = (id) => {
    setOpenTravel(openTravel === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">🌍 I miei viaggi</h1>

      <div className="max-w-3xl mx-auto space-y-4">
        {travels.map((v) => (
          <div
            key={v.id}
            className="bg-white shadow-lg rounded-2xl border border-gray-200"
          >
            {/* intestazione accordion */}
            <button
              onClick={() => toggleAccordion(v.id)}
              className="w-full flex justify-between items-center p-4 text-left"
            >
              <div>
                <h2 className="text-lg font-semibold">
                  {v.town} - {v.city}
                </h2>
                <p className="text-gray-600 text-sm">
                  📅 {v.start_date} → {v.end_date}
                </p>
              </div>
              <span className="text-gray-600">
                {openTravel === v.id ? "▲" : "▼"}
              </span>
            </button>


            {/* contenuto accordion */}
            {openTravel === v.id && (
              <div className="px-4 pb-4 border-t">
                <p className="text-gray-700 font-medium mt-2 mb-4">
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
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
