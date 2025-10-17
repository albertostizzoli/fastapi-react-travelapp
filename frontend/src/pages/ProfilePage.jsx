import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function ProfilePage() {
    const [user, setUser] = useState(null); // stato per i dati utente
    const [recentTravels, setRecentTravels] = useState([]) // stato per i viaggi recenti
    const [deleteProfileId, setDeleteProfileId] = useState(null); //  stato per il modale di conferma eliminazione profilo (Apri / Chiudi)
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

    // Funzione per eliminare un profilo
    const handleDeleteProfile = () => {
        const userId = localStorage.getItem("userId"); // recupero l'id utente
        const token = localStorage.getItem("token"); // recupero il token
        if (!userId && !token) return; // se non ci sono, non faccio nulla

        axios
            .delete(`http://127.0.0.1:8000/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                setDeleteProfileId(null); // chiudi modale
                handleLogout(); // chiamo la funzione per il logout
            })
            .catch((err) => console.error("Errore nell'eliminazione del profilo:", err));
    };

    // funzione per ottenere le stelle 
    function StarRating({ rating = 0, max = 5 }) {
        const safe = Math.max(0, Math.min(rating, max)); // assicura che il voto sia tra 0 e max

        return (
            <span className="inline-flex items-center">
                {Array.from({ length: max }).map((_, i) => {
                    const fill = Math.max(0, Math.min(1, safe - i)); // calcola la porzione da riempire (0, 0.5, 1)
                    const width = `${fill * 100}%`; // converte in percentuale

                    return (
                        <span
                            key={i}
                            className="relative inline-block w-5 h-5 mr-0.5 align-middle"
                            aria-hidden="true">
                            {/* Riempimento giallo */}
                            <span className="absolute inset-0 overflow-hidden" style={{ width }}>
                                <span className="text-yellow-400 text-lg leading-5 select-none">★</span>
                            </span>
                        </span>
                    );
                })}
                {/* Testo nascosto per screen reader */}
                <span className="sr-only">{safe} su {max}</span>
            </span>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-transparent text-white sm:p-8 p-4">
            <main className="flex-1 container mx-auto px-2 sm:px-6 py-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">

                    {/* Profilo Utente */}
                    <motion.section
                        className="md:col-span-1 bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/10 flex flex-col items-center text-center h-auto"
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}>
                        {/* Avatar */}
                        {user?.photo ? (
                            <img
                                src={user.photo}
                                alt="Profilo"
                                className="rounded-full mb-6 shadow-lg object-cover border-4 border-blue-600"
                                style={{ width: "140px", height: "140px" }}
                            />
                        ) : (
                            <div className="w-36 h-36 mb-6 rounded-full bg-gray-800 flex items-center justify-center text-4xl font-bold text-gray-400 border-4 border-gray-700">
                                {user?.name?.[0]?.toUpperCase() || "?"}
                            </div>
                        )}

                        {/* Nome e Data */}
                        <h3 className="text-2xl font-bold text-blue-600 tracking-wide mb-2">
                            {user?.name} {user?.surname}
                        </h3>
                        {user?.registration_date && (
                            <p className="text-sm text-white mb-6">
                                Registrato il{" "}
                                <span className="font-medium text-white">
                                    {new Date(user.registration_date).toLocaleDateString("it-IT", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </span>
                            </p>
                        )}

                        {/* Azioni */}
                        <div className="w-full space-y-3 mt-4">
                            <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-white font-semibold rounded-xl shadow-md transition-all duration-200 hover:scale-105 cursor-pointer">
                                <i className="fa-solid fa-edit"></i> Modifica Profilo
                            </button>

                            <button
                                onClick={() => setDeleteProfileId(user?.id)}
                                className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-500 hover:bg-red-400 text-white font-semibold rounded-xl shadow-md transition-all duration-200 hover:scale-105 cursor-pointer">
                                <i className="fa-solid fa-trash"></i> Cancella Profilo
                            </button>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 py-2.5 bg-teal-500 hover:bg-teal-400 text-white font-semibold rounded-xl shadow-md transition-all duration-200 hover:scale-105 cursor-pointer">
                                <i className="fa-solid fa-right-from-bracket"></i> Esci
                            </button>
                        </div>
                    </motion.section>

                    {/* Gestione Viaggi e Viaggi Recenti */}
                    <motion.section
                        className="flex flex-col gap-8 h-auto"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 1 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.4 } },
                        }}>
                        {/* Azioni */}
                        <motion.div
                            className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/10 flex flex-col gap-4"
                            variants={{
                                hidden: { scale: 0.9, opacity: 0 },
                                visible: { scale: 1, opacity: 1, transition: { duration: 1, ease: "easeOut" } },
                            }}>
                            <h3 className="text-2xl font-semibold text-blue-600 text-center mb-2">
                                Gestisci i tuoi viaggi
                            </h3>

                            <div className="flex flex-col w-full gap-2 justify-center">
                                <Link
                                    to="/travels"
                                    className="flex justify-center items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-400 rounded-lg text-white font-medium shadow-md transition-transform hover:scale-105">
                                    <i className="fa-solid fa-globe"></i> I tuoi viaggi
                                </Link>

                                <Link
                                    to="/add"
                                    className="flex justify-center items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-400 rounded-lg text-white font-medium shadow-md transition-transform hover:scale-105">
                                    <i className="fa-solid fa-plus"></i> Aggiungi Viaggio
                                </Link>

                                <button className="flex justify-center items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg text-white font-medium shadow-md transition-transform hover:scale-105 cursor-pointer">
                                    <i className="fa-solid fa-compass"></i> Prossimo viaggio
                                </button>
                            </div>
                        </motion.div>

                        {/* Ultimo Viaggio */}
                        <motion.div
                            className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/10"
                            variants={{
                                hidden: { scale: 0.9, opacity: 0 },
                                visible: { scale: 1, opacity: 1, transition: { duration: 1, ease: "easeOut" } },
                            }}>
                            <h3 className="text-2xl font-semibold text-blue-600 text-center mb-4">
                                Ultimo Viaggio
                            </h3>

                            {recentTravels?.length ? (
                                <ul className="space-y-4">
                                    {recentTravels.slice(0, 1).map((travel, idx) => (
                                        <li
                                            key={idx}
                                            className="p-4 bg-gradient-to-r from-blue-500 to-blue-400 rounded-xl shadow-md hover:scale-[1.02] hover:shadow-xl transition-all duration-200">
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="text-lg font-semibold text-white">
                                                    <i className="fa-solid fa-location-dot mr-2 text-orange-300"></i>
                                                    {travel.town}, {travel.city}
                                                </h4>
                                                <span className="text-xs bg-white/20 px-2 py-1 rounded-md text-white/90">
                                                    {travel.start_date} → {travel.end_date}
                                                </span>
                                            </div>

                                            <div className="border-t border-white/20 my-2" />

                                            {travel.general_vote ? (
                                                <StarRating rating={travel.general_vote} />
                                            ) : (
                                                <p className="text-gray-200 italic text-sm">Nessun voto disponibile</p>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-center text-white/80 italic">Nessun viaggio recente.</p>
                            )}
                        </motion.div>
                    </motion.section>

                    {/* Interessi Utente */}
                    <motion.div
                        className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/10 h-auto"
                        initial={{ x: 80, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}>
                        <h3 className="text-2xl font-semibold text-blue-600 text-center mb-4">
                            I tuoi interessi
                        </h3>

                        {user?.interests?.length ? (
                            <div className="flex flex-wrap justify-center gap-3">
                                {user.interests.map((interest, idx) => (
                                    <span
                                        key={idx}
                                        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full text-sm sm:text-base font-medium text-white shadow-md hover:scale-105 transition-transform duration-150">
                                        {interest}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-white/80 italic">
                                Nessun interesse impostato.
                            </p>
                        )}
                    </motion.div>
                </div>

                {/* Modale di conferma eliminazione profilo */}
                <AnimatePresence>
                    {deleteProfileId && ( // se deleteProfileId non è null, mostro il modale
                        <motion.div className="fixed inset-0 flex items-center justify-center bg-transparent z-[9999]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}>
                            <motion.div className="backdrop-blur-xl p-6 rounded-xl shadow-lg w-80 text-center"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ duration: 0.5 }}>
                                <h2 className="text-xl font-bold mb-4 text-white">
                                    Vuoi cancellare il tuo profilo?
                                </h2>
                                <div className="flex justify-center gap-4">
                                    <button
                                        onClick={handleDeleteProfile}
                                        className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded-lg shadow-md transition hover:scale-105 cursor-pointer">
                                        <i className="fa-solid fa-check"></i> Sì
                                    </button>
                                    <button
                                        onClick={() => setDeleteProfileId(null)}
                                        className="flex items-center gap-2 bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-lg shadow-md transition hover:scale-105 cursor-pointer">
                                        <i className="fa-solid fa-xmark"></i> No
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}

export default ProfilePage;