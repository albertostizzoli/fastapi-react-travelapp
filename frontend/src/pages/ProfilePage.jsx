import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function ProfilePage() {
    const [user, setUser] = useState(null); // stato per i dati utente
    const [recentTravels, setRecentTravels] = useState([]) // stato per i viaggi recenti
    const navigate = useNavigate(); // per la navigazione

    // uso lo useEffect per ottenere i dati dell'utente
    useEffect(() => {
        const userId = localStorage.getItem("userId"); // recupero id utente
        if (!userId) return; // se non c'è, non faccio nulla

        axios
            .get(`http://127.0.0.1:8000/users/${userId}`) // recupera i dati dell'utente dal backend
            .then((res) => setUser(res.data)) // aggiorna lo stato con i dati ricevuti
            .catch((err) => console.error(err)); // gestisce errori
    }, []);

    // uso lo useEffect per ottenere i dati dei viaggi
    useEffect(() => {
        const token = localStorage.getItem("token"); // recupera il token JWT
        if (!token) return; // se non c'è token, non faccio nulla

        axios
            .get("http://127.0.0.1:8000/travels", {
                headers: {
                    Authorization: `Bearer ${token}`, //  token nell'header
                },
            })
            .then((res) => setRecentTravels(res.data)) // aggiorna lo stato con i dati ricevuti
            .catch((err) => console.error(err)); // gestisce errori
    }, []);

    // funzione per il logout
    const handleLogout = () => {
        // rimuovo token e dati utente
        localStorage.removeItem('token');
        localStorage.removeItem('userId');

        // Reindirizza alla Home Page
        navigate('/');
    };

    return (
        <div className="flex flex-col min-h-screen bg-transparent text-white sm:p-6 p-4">

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-2 sm:px-4 py-10 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

                    {/* Informazioni Utente */}
                    <section className="md:col-span-1 bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/10 flex flex-col items-center">

                        {/* Foto profilo */}
                        {user?.photo ? (
                            <img
                                className="rounded-full mb-6 shadow-xl object-cover border-4 border-blue-500"
                                src={user.photo}
                                alt="Immagine profilo"
                                style={{ width: "140px", height: "140px" }}
                            />
                        ) : (
                            <div className="w-36 h-36 mb-6 rounded-full bg-gray-700 flex items-center justify-center text-3xl font-bold text-gray-400 border-4 border-gray-600">
                                {user?.name?.[0]?.toUpperCase() || "?"}
                            </div>
                        )}

                        {/* Nome e data registrazione */}
                        <h3 className="text-2xl font-semibold text-blue-500 text-center mb-4 tracking-wide">{user?.name} {user?.surname}</h3>
                        {user?.registrationDate && (
                            <p className="text-xs text-gray-300 mb-6">
                                Registrato il: {new Date(user.registrationDate).toLocaleDateString()}
                            </p>
                        )}

                        {/* Azioni */}
                        <div className="w-full space-y-3 mt-6">
                            <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-400 shadow-md transition-transform hover:scale-105 cursor-pointer">
                                <i className="fa-solid fa-edit"></i> Modifica Profilo
                            </button>

                            <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-400 shadow-md transition-transform hover:scale-105 cursor-pointer">
                                <i className="fa-solid fa-trash"></i> Cancella Profilo
                            </button>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 py-2.5 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-400 shadow-md transition-transform hover:scale-105 cursor-pointer">
                                <i className="fa-solid fa-right-from-bracket"></i> Esci
                            </button>
                        </div>
                    </section>

                    {/* Interessi utente e Azioni */}
                    <section className=" flex flex-col gap-6">

                        {/* Interessi utente */}
                        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/10">
                            <h3 className="text-2xl font-semibold text-blue-500 text-center mb-4 tracking-wide">Che tipo di viaggiatore sei?</h3>
                            {user?.interests && user.interests.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {user.interests.map((interest, idx) => (
                                        <span
                                            key={idx}
                                            className="px-4 py-2 bg-orange-500 rounded-full text-base font-medium text-white transition hover:bg-orange-400">
                                            # {interest}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-white italic">Nessun interesse impostato.</p>
                            )}
                        </div>

                        {/* Azioni principali */}
                        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/10 flex flex-col gap-4">
                            <h3 className="text-2xl font-semibold text-blue-500 text-center mb-4 tracking-wide">
                                Gestisci i tuoi viaggi
                            </h3>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <Link
                                    to="/travels"
                                    className="flex justify-center items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-400 rounded-lg text-white font-medium shadow-md transition-transform hover:scale-105">
                                    <i className="fa-solid fa-globe"></i> I tuoi viaggi
                                </Link>

                                <Link
                                    to="/add"
                                    className="flex justify-center items-center gap-2 px-6 py-2.5 bg-green-500 hover:bg-green-400 rounded-lg text-white font-medium shadow-md transition-transform hover:scale-105">
                                    <i className="fa-solid fa-plus"></i> Aggiungi Viaggio
                                </Link>

                                <button
                                    className="flex justify-center items-center gap-2 px-6 py-2.5 bg-blue-500 hover:bg-blue-400 rounded-lg text-white font-medium shadow-md transition-transform hover:scale-105 hover:shadow-lg cursor-pointer">
                                    <i className="fa-solid fa-question"></i> Il tuo prossimo viaggio
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Viaggi recenti */}
                    <section className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/10 flex flex-col gap-4">
                        <h3 className="text-2xl font-semibold text-blue-500 text-center mb-4 tracking-wide">Viaggi Recenti</h3>
                        {recentTravels && recentTravels.length > 0 ? (
                            <ul className="flex flex-col gap-3">
                                {recentTravels.slice(0, 3).map((travel, idx) => (
                                    <li
                                        key={idx}
                                        className="p-3 bg-gradient-to-r from-blue-500 to-blue-400 rounded-xl shadow-lg flex flex-col gap-3 hover:scale-[1.02] hover:shadow-xl transition-transform duration-200">

                                        {/* Viaggio con date */}
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-lg font-semibold text-white">
                                                <i className="fa-solid fa-location-dot mr-2 text-orange-300"></i>
                                                {travel.town}, {travel.city}
                                            </h4>
                                            <span className="text-sm text-white/90 bg-white/20 px-2 py-1 rounded-md">
                                                {travel.start_date} → {travel.end_date}
                                            </span>
                                        </div>

                                        {/* Bordo divisore */}
                                        <div className="h-[1px] bg-white/20" />

                                        {/* Voto */}
                                        <div className="flex justify-between items-center text-sm">
                                            {travel.general_vote ? (
                                                <div className="flex items-center gap-1 text-yellow-300">
                                                    {Array.from({ length: 5 }).map((_, i) => {
                                                        const fullStar = i + 1 <= Math.floor(travel.general_vote);
                                                        const halfStar =
                                                            i + 1 > Math.floor(travel.general_vote) &&
                                                            i < travel.general_vote;
                                                        return (
                                                            <i
                                                                key={i}
                                                                className={`fa-star ${fullStar
                                                                        ? "fa-solid"
                                                                        : halfStar
                                                                            ? "fa-star-half-stroke"
                                                                            : "fa-regular"
                                                                    }`}
                                                            ></i>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <span className="text-gray-200 italic">Nessun voto</span>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-white italic text-center">Nessun viaggio recente.</p>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}

export default ProfilePage;