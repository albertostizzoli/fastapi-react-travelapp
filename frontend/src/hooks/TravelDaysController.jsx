import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // per prendere l'id del viaggio dai parametri URL
import axios from "axios";

function TravelDaysController() {
    const { id } = useParams(); // prendo l'id del viaggio dai parametri URL
    const [travel, setTravel] = useState(null); // stato per ottenere i dati del viaggio
    const [message, setMessage] = useState(""); // messaggio di successo o errore
    const [deleteDayId, setDeleteDayId] = useState(null); //  stato per il modale di conferma eliminazione giorno (Apri / Chiudi)
    const [selectedDay, setSelectedDay] = useState(null); //  stato per il modale Scopri di più (Apri / Chiudi)
    const [openCardId, setOpenCardId] = useState(null);  // stato per aprire una card dei viaggi e mostare le altre informazioni

    // Fetch dati viaggio all'inizio e quando cambia l'id
    useEffect(() => {
        fetchTravel(); // chiamo la funzione per caricare i dati del viaggio
    }, [id]); // dipendenza sull'id

    // Quando è aperto il modale per leggere le informazioni delle tappe la barra di scorrimento verticale principale viene disattivata
    useEffect(() => {
        if (selectedDay) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [selectedDay]);


    // Funzione per caricare i dati del viaggio
    const fetchTravel = () => {
        const token = localStorage.getItem("token"); // prendo il token

        axios
            .get(`http://127.0.0.1:8000/travels/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setTravel(res.data))
            .catch((err) => console.error("Errore nel caricamento del viaggio:", err));
    };


    // Funzione per eliminare un giorno
    const handleDeleteDay = () => {
        const token = localStorage.getItem("token");

        axios
            .delete(`http://127.0.0.1:8000/travels/${id}/days/${deleteDayId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                // aggiorna la lista dei giorni nel viaggio
                setTravel({
                    ...travel,
                    days: travel.days.filter((d) => d.id !== deleteDayId),
                });
                setDeleteDayId(null);

                // mostra messaggio di successo
                setMessage({ text: "Tappa Cancellata!", icon: "success" });

                // fa sparire il messaggio dopo 2 secondi
                setTimeout(() => {
                    setMessage("");
                }, 2000);
            })
            .catch((err) => {
                console.error("Errore nell'eliminazione della tappa:", err);
                // mostra messaggio di errore
                setMessage({ text: "Errore: Tappa Non Cancellata!", icon: "error" });
                setTimeout(() => setMessage(""), 2500);
            });
    };

    return {
        id,                // id del viaggio
        travel,            // dati del viaggio
        message,           // messaggio di successo o errore
        deleteDayId,       // id del giorno da eliminare
        selectedDay,       // giorno selezionato per il modale Scopri di più
        setSelectedDay,    // funzione per aprire/chiudere il modale Scopri di più
        setDeleteDayId,    // funzione per aprire/chiudere il modale di conferma eliminazione giorno
        handleDeleteDay,   // funzione per eliminare un giorno
        openCardId,        // mostra la card aperta
        setOpenCardId      // stato per indicare la card aperta
    };
}

export default TravelDaysController;