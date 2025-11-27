import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function FormEditTravel() {
    const { id } = useParams(); // recupero l'ID del viaggio dall'URL
    const navigate = useNavigate(); // hook per navigare fra le pagine
    const [travel, setTravel] = useState(null); // per salvare i dati del viaggio
    const [message, setMessage] = useState(""); // stato per mostrare messaggi di conferma/errore

    // recupero i viaggi dal backend
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        axios
            .get("http://127.0.0.1:8000/travels", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                const t = res.data.find((tr) => tr.id === parseInt(id));
                setTravel(t);
            })
            .catch((err) => console.error("Errore nel caricamento del viaggio:", err));
    }, [id]);


    // gestisce il cambiamento dei campi principali ( town, city...)
    const handleChange = (e) => {
        const { name, value } = e.target; // recupera il nome e il valore del campo modificato
        setTravel({ ...travel, [name]: value }); // aggiorna lo stato del viaggio
    };

    // gestisce il cambiamento dei voti (paesaggio, relax...)
    const handleVoteChange = (e) => {
        const { name, value } = e.target; // recupera il nome e il valore del voto modificato
        setTravel({
            ...travel, // mantiene gli altri dati del viaggio
            votes: { ...travel.votes, [name]: parseFloat(value) || 0 }, // aggiorna il voto specifico
        });
    };

    // calcola la media dei voti
    const calculateGeneralVote = () => {
        if (!travel || !travel.votes) return null; // se non ci sono voti, ritorna null

        const votes = Object.values(travel.votes).filter((v) => v > 0); // filtra i voti validi (maggiore di 0)
        if (votes.length === 0) return null; // se non ci sono voti validi, ritorna null

        const avg = votes.reduce((a, b) => a + b, 0) / votes.length; // calcola la media
        return avg.toFixed(1); // media con 1 decimale
    };

    // gestisce il submit del form
    const handleSubmit = async (e) => {
        e.preventDefault(); // previene il comportamento di default del form
        const token = localStorage.getItem("token"); // recupera il token di autenticazione

        try {
            const updatedTravel = { // dati aggiornati del viaggio
                ...travel, // mantiene gli altri dati del viaggio
                general_vote: calculateGeneralVote() // aggiorna la media dei voti
                    ? parseFloat(calculateGeneralVote()) // converte in numero
                    : null, // se non c'è media, mette null
            };

            await axios.put(`http://127.0.0.1:8000/travels/${id}`, updatedTravel, { // invia la richiesta di aggiornamento al backend
                headers: { Authorization: `Bearer ${token}` }, // header di autorizzazione
            });

            setMessage({ text: "Viaggio Modificato!", icon: "success" }); // mostra messaggio di successo

            // dopo 2 secondi, reindirizza alla pagina dei viaggi
            setTimeout(() => {
                setMessage("");
                navigate("/travels");
            }, 2000);
        } catch (err) {
            console.error("Errore durante l'aggiornamento del viaggio:", err); // log dell'errore
           setMessage({ text: "Errore: Viaggio Non Modificato!", icon: "error" });
        }
    };

    return {
        travel,                      // dati del viaggio
        message,                     // messaggio di stato
        handleChange,                // funzione per gestire i cambiamenti dei campi 
        handleVoteChange,            // funzione per gestire i cambiamenti dei voti
        calculateGeneralVote,        // funzione per calcolare la media dei voti
        handleSubmit                 // funzione per gestire il submit del form
    }
}

export default FormEditTravel;