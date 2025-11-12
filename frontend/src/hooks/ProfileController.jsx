import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ProfileController() {
    const [user, setUser] = useState(null); // stato per i dati utente
    const [recentTravels, setRecentTravels] = useState([]) // stato per i viaggi recenti
    const [deleteProfileId, setDeleteProfileId] = useState(null); //  stato per il modale di conferma eliminazione profilo (Apri / Chiudi)
    const [message, setMessage] = useState(""); // stato per i messaggi di errore/successo
    const [showEditModal, setShowEditModal] = useState(false); // stato per mostrare/nascondere il modale di modifica
    const [showPassword, setShowPassword] = useState(false); // stato per nascondere / mostrare la password
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
        const token = localStorage.getItem("token");   // recupero il token
        if (!userId || !token) return;                // se manca qualcosa, esci

        axios
            .delete(`http://127.0.0.1:8000/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                setDeleteProfileId(null); // chiudi modale

                // Mostra messaggio di conferma
                setMessage({ text: "Arrivederci e a Presto!", icon: "success" });

                // Dopo 2 secondi effettua il logout e nasconde il messaggio
                setTimeout(() => {
                    setMessage("");
                    handleLogout();
                }, 2000);
            })
            .catch((err) => {
                console.error(" Errore nell'eliminazione del profilo:", err);

                // Mostra messaggio di errore
                setMessage({ text: "Profilo Non Cancellato", icon: "error" });
                setTimeout(() => setMessage(""), 3000);
            });
    };

    // stato per i campi modificabili
    const [editForm, setEditForm] = useState({
        name: "",
        surname: "",
        email: "",
        password: "",
        experiences: "",
        photo: null,
    });

    // invia i dati al backend
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem("userId");

        if (!userId) return;

        const formData = new FormData();
        formData.append("name", editForm.name);
        formData.append("surname", editForm.surname);
        formData.append("email", editForm.email);
        formData.append("password", editForm.password);
        formData.append("experiences", JSON.stringify(editForm.experiences));
        if (editForm.photo) formData.append("photo", editForm.photo);

        try {
            const res = await axios.put(`http://127.0.0.1:8000/users/${userId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setUser(res.data); // aggiorno i dati utente
            setShowEditModal(false);
            setMessage({ text: "Profilo Modificato!", icon: "success" });
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            console.error("Errore aggiornamento profilo:", err);
            setMessage({ text: "Errore: Profilo Non Modificato", icon: "error" });
            setTimeout(() => setMessage(""), 3000);
        }
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

    return {
        user,                    // dati utente
        recentTravels,           // viaggi recenti
        deleteProfileId,         // id profilo da eliminare
        message,                 // messaggi di errore/successo
        showEditModal,           // mostra/nasconde modale di modifica
        showPassword,            // mostra/nasconde password
        editForm,                // dati del form di modifica
        setEditForm,             // funzione per aggiornare i dati del form di modifica
        setShowEditModal,        // funzione per mostrare/nascondere il modale di modifica
        handleLogout,            // funzione di logout
        handleUpdateProfile,     // funzione per aggiornare il profilo
        handleDeleteProfile,     // funzione per eliminare il profilo
        setDeleteProfileId,      // funzione per impostare l'id del profilo da eliminare
        setShowPassword,         // funzione per mostrare/nascondere la password
        StarRating               // componente per le stelle di valutazione
    };

}

export default ProfileController;