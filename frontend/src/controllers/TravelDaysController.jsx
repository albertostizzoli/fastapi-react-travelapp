import { useEffect, useState, useRef, useMemo } from "react";
import { useParams } from "react-router-dom"; // per prendere l'id del viaggio dai parametri URL
import axios from "axios";

function TravelDaysController() {
    const { id } = useParams(); // prendo l'id del viaggio dai parametri URL
    const [travel, setTravel] = useState(null); // stato per ottenere i dati del viaggio
    const [message, setMessage] = useState(""); // messaggio di successo o errore
    const [deleteDayId, setDeleteDayId] = useState(null); //  stato per il modale di conferma eliminazione giorno (Apri / Chiudi)
    const [selectedDay, setSelectedDay] = useState(null); //  stato per il modale Scopri di più (Apri / Chiudi)
    const [openCardId, setOpenCardId] = useState(null);  // stato per aprire una card dei viaggi e mostare le altre informazioni
    const [selectedCity, setSelectedCity] = useState(""); // stato per filtrare le tappe in base alla città
    const [selectedExperience, setSelectedExperience] = useState(""); // stato per filtrare le tappe in base alle esperienze
    const [currentImage, setCurrentImage] = useState(0); // stato per il carosello automatico delle immagini dell'hero
    const [openMenuId, setOpenMenuId] = useState(null); // stato per aprire / chiudere il dropdown menù

    const scrollRef = useRef(null);  // mi permette di fare lo scroll del carosello
    const cardRefs = useRef({});     // oggetto per salvare i ref di tutte le card
    const menuRef = useRef(null);    // mi permette di chiudere il menù dropdown cliccando in ogni punto


    // questa funzione mi permette di mescolare in maniera casuale le foto ogni volta
    function shuffleArray(array) {
        const shuffled = [...array]; // creo un nuovo array 
        for (let i = shuffled.length - 1; i > 0; i--) { // ciclo sulla lunghezza dell'array nuovo
            const j = Math.floor(Math.random() * (i + 1)); // uso la funzione Math.floor e Math.random per rimescolare l'array
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled; // restituisco l'array nuovo con le foto rimescolate
    }


    // prendo con un array tutte le immagini delle tappe
    const heroImages = useMemo(() => {
        const imgs = travel?.days
            ?.flatMap(d => d.photo || []) // utilizzo flatMap per ciclare sugli array delle tappe
            .filter(Boolean);

        return imgs?.length ? shuffleArray(imgs) : ["/fallback.jpg"]; // richiamo la funzione shuffleArray per rimescolare le foto
    }, [travel?.id]);

    // questo useEffect mi permette di chiudere il menù dropdown cliccando ovunque
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                openMenuId !== null &&
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setOpenMenuId(null);
            }
        }

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [openMenuId]);


    // questo useEffect mi permette di avere un carosello automatico per le immagini
    useEffect(() => {
        if (heroImages.length <= 1) return;

        const interval = setInterval(() => { // utilizzo setInterval di 6 secondi per il carosello
            setCurrentImage(prev => (prev + 1) % heroImages.length); // prev + 1 indica l'immagine successiva
        }, 6000);

        return () => clearInterval(interval);
    }, [heroImages.length]);


    // questo useEffect mi resetta il carosello al caricamento della pagina
    useEffect(() => {
        setCurrentImage(0);
    }, [travel?.id]);


    // Effetto per lo scroll alla card aperta
    useEffect(() => {
        if (openCardId && cardRefs.current[openCardId]) {
            // scroll verso la card aperta
            cardRefs.current[openCardId].scrollIntoView({
                behavior: "smooth",
                bottom: 0
            });
        }
    }, [openCardId]);

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

    // Lista di tutte le città nella select
    const allCities = travel ? [...new Set(travel.days.map(d => d.city?.trim()))] : [];

    // Lista di tutte le esperienze nella select
    const allExperiences = travel
        ? [...new Set(travel.days.flatMap(d => d.experiences || []))] // legge tutte le esperienze in tutte le tappe le unisce in un solo array rimuove i duplicati
        : [];

    // Questo mi permette di vedere tutte le esperienze e città disponibili per le select
    const experienceOptions = [
        { value: null, label: "Tutte le esperienze" },
        ...allExperiences.map(exp => ({ value: exp, label: exp }))
    ];

    const cityOptions = [
        { value: null, label: "Tutte le città" },
        ...allCities.map(city => ({ value: city, label: city }))
    ];

    // Funzione per filtrare in modo combinato le tappe in base a esperienze e città
    const filteredDays = travel
        ? travel.days.filter(d => {

            // protezione city
            const city = d.city ?? ""; // fallback su stringa vuota
            const selectedCityValue = selectedCity ?? "";

            const matchCity =
                selectedCityValue === "" || city.toLowerCase() === selectedCityValue.toLowerCase();

            // protezione esperienze
            const experienceList = d.experiences ?? [];
            const selectedExperienceValue = selectedExperience ?? "";

            const matchExperience =
                selectedExperienceValue === "" ||
                experienceList.some(exp => (exp ?? "").toLowerCase() === selectedExperienceValue.toLowerCase());

            return matchCity && matchExperience;
        })
        : [];

    // funzione per scrollare il carosello a sinistra o saltare alla fine
    const scrollLeft = () => {
        if (!scrollRef.current) return; // verifica che il ref sia definito
        const scrollContainer = scrollRef.current; // il contenitore scrollabile

        if (scrollContainer.scrollLeft <= 0) {
            // Se siamo all'inizio, salta alla fine
            scrollContainer.scrollTo({ left: scrollContainer.scrollWidth, behavior: "smooth" }); // scorri alla fine
        } else {
            scrollContainer.scrollBy({ left: -490, behavior: "smooth" }); // altrimenti scorri a sinistra di 475px
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
            scrollContainer.scrollBy({ left: 490, behavior: "smooth" });
        }
    };

    return {
        id,                    // id del viaggio
        travel,                // dati del viaggio
        message,               // messaggio di successo o errore
        deleteDayId,           // id del giorno da eliminare
        selectedDay,           // giorno selezionato per il modale Scopri di più
        setSelectedDay,        // funzione per aprire/chiudere il modale Scopri di più
        setDeleteDayId,        // funzione per aprire/chiudere il modale di conferma eliminazione giorno
        handleDeleteDay,       // funzione per eliminare un giorno
        openCardId,            // mostra la card aperta
        setOpenCardId,         // stato per indicare la card aperta
        selectedCity,          // indica la città selezionata
        setSelectedCity,       // stato per indicare la città selezionata
        filteredDays,          // funzione per filtrare in modo combinato le tappe in base a esperienze e città
        selectedExperience,    // indica l'esperienza selezionata
        setSelectedExperience, // stato per indicare l'esperienza selezionata
        experienceOptions,     // opzioni per la select delle esperienze
        cityOptions,           // opzioni per la select delle città
        scrollRef,             // ref per lo scroll del carosello
        cardRefs,              // ref per tutte le card
        scrollLeft,            // funzione per scrollare a sinistra
        scrollRight,           // funzione per scrollare a destra
        heroImages,            // immagini dell'hero
        heroImages,            // tutte le immagini
        currentImage,          // immagine corrente dell'hero
        openMenuId,            // apre il menù dropdown
        setOpenMenuId,         //  stato per indicare l'apertura del menù dropdown
        menuRef                // mi permette di chiudere il menù dropdown cliccando ovunque nel DOM
    };
}

export default TravelDaysController;