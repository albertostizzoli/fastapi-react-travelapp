import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ProfilePage() {
    const [user, setUser] = useState(null); // stato per i dati utente

    // uso lo useEffect per ottenere i dati dell'utente
    useEffect(() => {
        const userId = localStorage.getItem("userId"); // recupero id utente
        if (!userId) return; // se non c'è, non faccio nulla

        axios
            .get(`http://127.0.0.1:8000/users/${userId}`) // recupera i dati dell'utente dal backend
            .then((res) => setUser(res.data)) // aggiorna lo stato con i dati ricevuti
            .catch((err) => console.error(err)); // gestisce errori
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-transparent text-white p-8">

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-4 py-8 sm:py-12 mt-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Sidebar */}
                    <section className="md:col-span-1 backdrop-blur-xl p-6 rounded-lg shadow-lg">
                        <div className="flex items-center mb-8">
                            {user && user.photo && (
                                <img
                                    className="rounded-full mr-4"
                                    src={user.photo}
                                    alt="Immagine profilo"
                                    style={{ width: "80px", height: "80px" }}
                                />
                            )}
                            <div>
                                <h3 className="text-xl font-bold mb-2">
                                    {user ? user.name : "Utente"}
                                </h3>
                                <p className="text-white text-sm">
                                    {user ? user.email : ""}
                                </p>
                            </div>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex items-center py-2 px-4 bg-yellow-500 text-white font-bold rounded-lg shadow-md hover:bg-yellow-400 transition duration-300">
                                Modifica Profilo
                            </li>

                            <li className="flex items-center py-2 px-4 bg-red-500 text-white font-bold rounded-lg shadow-md hover:bg-red-400 transition duration-300">
                                Cancella Profilo
                            </li>

                            <li>
                                <button
                                    className="flex items-center py-2 px-4 bg-red-500 text-white font-bold rounded-lg shadow-md hover:bg-red-600 transition duration-300"> 
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </section>

                    {/* Main Content */}
                    <section className="md:col-span-2 backdrop-blur-xl p-6 rounded-lg shadow-lg">
                        <h2 className="text-3xl font-bold mb-8 text-center">
                            Benvenuto {user ? user.name : "Utente"} nel tuo Profilo
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Column */}
                            <div className="backdrop-blur-xl p-6 rounded-lg shadow-md">
                                <h3 className="text-xl font-bold mb-4 text-white">
                                    Gestisci Viaggi
                                </h3>
                                <ul className="space-y-4">
                                    <li>
                                        <Link
                                            to="/add"
                                            className="flex items-center hover:text-teal-400">
                                           Aggiungi Viaggio
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default ProfilePage;