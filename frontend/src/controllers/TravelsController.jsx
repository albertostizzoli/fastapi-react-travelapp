import { useEffect, useState, useRef } from "react";
import { FaStar } from "react-icons/fa";
import axios from "axios";

function TravelsController() {
    const [travels, setTravels] = useState([]); // stato per i viaggi
    const [deleteId, setDeleteId] = useState(null); // stato per l'id del viaggio da eliminare
    const [message, setMessage] = useState(""); // messaggio di successo o errore
    const [activeCard, setActiveCard] = useState(null); // stato per aprire una card dei viaggi e mostare le altre informazioni
    const [selectedYear, setSelectedYear] = useState(null); // stato per selezionare un'anno dalla select

    const scrollRef = useRef(null); // mi permette di fare lo scroll del carosello
    const cardRefs = useRef({}); // oggetto per salvare i ref di tutte le card

    // Effetto per lo scroll alla card aperta 
    useEffect(() => {
        if (activeCard && cardRefs.current[activeCard]) {
            // scroll verso la card aperta
            cardRefs.current[activeCard].scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }, [activeCard]);

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
            .then((res) => setTravels(res.data)) // aggiorna lo stato con i dati ricevuti
            .catch((err) => console.error(err)); // gestisce errori
    }, []);

    // con questa cancello tutti i dati del viaggio
    const handleDelete = () => {
        const token = localStorage.getItem("token"); // recupera il token JWT
        if (!token) return; // se non c'è token, non faccio nulla

        axios
            .delete(`http://127.0.0.1:8000/travels/${deleteId}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // invia il token
                },
            })
            .then(() => {
                // aggiorna la lista rimuovendo il viaggio eliminato
                setTravels(travels.filter((t) => t.id !== deleteId));
                setDeleteId(null);

                // mostra messaggio di successo
                setMessage({ text: "Viaggio Cancellato!", icon: "success" });

                // nasconde il messaggio dopo 2 secondi
                setTimeout(() => setMessage(""), 2000);
            })
            .catch((err) => {
                console.error("Errore durante l'eliminazione del viaggio:", err);
                // mostra messaggio di errore
                setMessage({ text: "Errore: Viaggio Non Cancellato!", icon: "error" });
                setTimeout(() => setMessage(""), 2500);
            });
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
                            className="relative inline-block w-5 h-5 mr-0.5 align-middle items-center"
                            aria-hidden="true">
                            {/* Riempimento giallo */}
                            <span className="absolute inset-0 overflow-hidden" style={{ width }}>
                                <span className="text-yellow-400 text-xl leading-5 select-none">< FaStar /></span>
                            </span>
                        </span>
                    );
                })}
                {/* Testo nascosto per screen reader */}
                <span className="sr-only">{safe} su {max}</span>
            </span>
        );
    }

    // Lista di tutte gli anni nella select
    const allYears = travels
        ? [...new Set(travels.map(d => d.year))].sort((a, b) => b - a) // anni unici in ordine decrescente
        : [];

    // converte gli anni (interi) in stringhe
    const yearOptions = allYears.map(y => ({
        value: y,
        label: y.toString(), // la select mostra sempre stringhe
    }));

    // Funzione per filtrare i viaggi in base agli anni
    const filteredTravels = selectedYear
        ? travels.filter(d => d.year === selectedYear)
        : travels; // se nessun anno selezionato, mostra tutti


    // funzione per scrollare il carosello a sinistra o saltare alla fine
    const scrollLeft = () => {
        if (!scrollRef.current) return; // verifica che il ref sia definito
        const scrollContainer = scrollRef.current; // il contenitore scrollabile

        if (scrollContainer.scrollLeft <= 0) {
            // Se siamo all'inizio, salta alla fine
            scrollContainer.scrollTo({ left: scrollContainer.scrollWidth, behavior: "smooth" }); // scorri alla fine
        } else {
            scrollContainer.scrollBy({ left: -475, behavior: "smooth" }); // altrimenti scorri a sinistra di 475px
        }
    };

    // funzione per scrollare il carosello a destra o saltare all'inizio
    const scrollRight = () => {
        if (!scrollRef.current) return;
        const scrollContainer = scrollRef.current;

        if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth) { // verifica se siamo alla fine
            // Se siamo alla fine, salta all'inizio
            scrollContainer.scrollTo({ left: 0, behavior: "smooth" });
        } else {
            scrollContainer.scrollBy({ left: 475, behavior: "smooth" });
        }
    };


    return {
        travels,           // lista dei viaggi
        deleteId,          // id del viaggio da eliminare
        setDeleteId,       // funzione per impostare l'id del viaggio da eliminare
        handleDelete,      // funzione per eliminare il viaggio
        message,           // messaggio di successo o errore
        StarRating,        // componente per visualizzare le stelle
        activeCard,        // mostra la card aperta
        setActiveCard,     // stato per indicare la card aperta
        selectedYear,      // anno selezionato
        setSelectedYear,   // stato per selezionare un anno
        allYears,          // per avere gli anni nella select
        yearOptions,       // anni convertiti in stringhe
        filteredTravels,   // funzione per filtrare i viaggi in base agli anni
        scrollRef,         // ref per lo scroll del carosello
        cardRefs,          // ref per tutte le card
        scrollLeft,            // funzione per scrollare a sinistra
        scrollRight            // funzione per scrollare a destra
    }
}

export default TravelsController;