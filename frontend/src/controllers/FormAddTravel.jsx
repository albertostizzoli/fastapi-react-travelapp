import { useState } from "react";
import { useNavigate } from "react-router-dom"; // use Navigate serve per il reindirizzamento fra le pagine
import axios from "axios";

function FormAddTravel() {
    const navigate = useNavigate(); // inizializzo useNavigate
    const [message, setMessage] = useState(""); // stato per mostrare messaggi di conferma/errore

    // stato del form con tutti i campi del viaggio
    const [form, setForm] = useState({
        town: "",
        year: "",
        start_date: "",
        end_date: "",
        cibo: "",
        relax: "",
        prezzo: "",
        attività: "",
        paesaggio: "",
    });

    // gestisce il cambiamento dei campi input del form
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value }); // aggiorna il campo specifico
    };

    // calcolo la media dei voti 
    const calculateGeneralVote = () => {
        const votes = ["cibo", "relax", "prezzo", "attività", "paesaggio"] // campi da considerare
            .map((field) => parseFloat(form[field])) // converto in numeri
            .filter((v) => !isNaN(v)); // filtro quelli validi

        if (votes.length === 0) return null; // nessun voto valido

        const avg = votes.reduce((a, b) => a + b, 0) / votes.length; // calcolo la media
        return avg.toFixed(1); // restituisce una stringa con 1 decimale, es. "3.6"
    };


    // gestisce l’invio del form e salva un nuovo viaggio nel backend
    const handleSubmit = async (e) => {
        e.preventDefault(); // previene il comportamento di default del form

        try {
            // calcolo il voto generale come media
            const general_vote = calculateGeneralVote() // se c’è almeno un voto
                ? parseFloat(calculateGeneralVote()) // lo converto in numero
                : null; // altrimenti null

            const token = localStorage.getItem("token"); //  prendo il token

            // creo l'oggetto viaggio da inviare al backend
            const newTravel = {
                town: form.town,
                year: parseInt(form.year), // converto in numero
                start_date: form.start_date,
                end_date: form.end_date,
                general_vote: general_vote, // calcolato
                votes: {
                    cibo: form.cibo ? parseInt(form.cibo) : null,
                    relax: form.relax ? parseInt(form.relax) : null,
                    prezzo: form.prezzo ? parseInt(form.prezzo) : null,
                    attività: form.attività ? parseInt(form.attività) : null,
                    paesaggio: form.paesaggio ? parseInt(form.paesaggio) : null,
                }
            };

            // invio al backend
            await axios.post("http://127.0.0.1:8000/travels", newTravel, {
                headers: { Authorization: `Bearer ${token}` }, //  aggiungo token
            });
            setMessage({ text: "Viaggio Aggiunto!", icon: "success" });

            // il form si resetta dopo l'invio
            setForm({
                town: "",
                year: "",
                start_date: "",
                end_date: "",
                cibo: "",
                relax: "",
                prezzo: "",
                attività: "",
                paesaggio: "",
            });

            // reindirizzo alla pagina dei viaggi
            setTimeout(() => {
                setMessage(""); // fa sparire il modale
                navigate("/travels");
            }, 2000);


        } catch (err) {
            console.error(err);
            setMessage({ text: "Errore: Viaggio Non Aggiunto!", icon: "error" });
        }
    };

    return {
        form,                   // stato del form
        handleChange,           // funzione per gestire i cambiamenti
        handleSubmit,           // funzione per gestire l'invio
        calculateGeneralVote,   // funzione per calcolare il voto generale
        message,                // messaggio di conferma/errore
    }
}

export default FormAddTravel;