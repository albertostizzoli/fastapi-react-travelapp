import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function FormAddDay() {
    const location = useLocation(); // per ottenere lo stato passato da TravelDays
    const navigate = useNavigate(); // per reindirizzare dopo l'aggiunta del giorno
    const travelIdFromState = location.state?.travelId || ""; // id passato da TravelDays per avere il viaggio già selezionato
    const [travels, setTravels] = useState([]); // lista viaggi esistenti
    const [message, setMessage] = useState(""); // messaggio di successo o errore
    const [selectedTravel, setSelectedTravel] = useState(""); // viaggio selezionato
    const fileInputRef = useRef(null); // riferimento all’input nascosto
    const [openImage, setOpenImage] = useState(null); // stato per l'immagine ingrandita (Apri / Chiudi)
    const [isTagModalOpen, setIsTagModalOpen] = useState(false); // apre / chiude il modale dei tags
    const [query, setQuery] = useState(""); // stato per ottenre i luoghi dall'API  Photon
    const [suggestions, setSuggestions] = useState([]); // stato per i suggerimenti dall'API Photon
    const [isUploading, setIsUploading] = useState(false); // stato per il caricamento
    const [uploadProgress, setUploadProgress] = useState(0); // stato per la barra di caricamento
    const [form, setForm] = useState({ // stato del form
        date: "",
        title: "",
        description: "",
        tags: [], // array di tags
        photo: [], // array di foto
    });

    // carico i viaggi dal backend
    useEffect(() => {
        const fetchTravels = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await axios.get(`http://127.0.0.1:8000/travels`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTravels(res.data); // array di viaggi per la select
            } catch (err) {
                console.error(err);
            }
        };

        fetchTravels();
    }, []);


    // per ottenere l'id del viaggio
    useEffect(() => {
        if (travelIdFromState) { // se c'è un id passato dallo stato
            setSelectedTravel(travelIdFromState); // lo imposto come viaggio selezionato
        }
    }, [travelIdFromState]); // dipende da travelIdFromState

    // gestisce il cambiamento di input generico (date, notes, ecc.)
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value }); // aggiorno il campo specifico
    };

    // Funzione per gestire la selezione della foto
    const handlePhotoSelect = () => {
        fileInputRef.current.click(); // simula il click sull’input file nascosto
    };

    // Funzione per ridurre le dimensioni di un'immagine serve a rendere l'upload più veloce
    const resizeImage = (file, maxWidth = 1024, maxHeight = 1024) => {
        // restituisce una Promise perché l'operazione è asincrona
        return new Promise((resolve) => {

            // crea un oggetto immagine temporaneo per poterla caricare nel browser
            const img = new Image();
            img.src = URL.createObjectURL(file); // converte il file in un URL locale (blob) visualizzabile

            // quando l'immagine è stata caricata completamente nel browser
            img.onload = () => {
                let { width, height } = img; // prendo la larghezza e altezza originali

                // mantiene le proporzioni originali ma limita la larghezza e altezza massima
                if (width > height) {
                    // se l'immagine è orizzontale e più larga del massimo consentito
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width; // ridimensiona in proporzione
                        width = maxWidth;
                    }
                } else {
                    // se l'immagine è verticale e più alta del massimo consentito
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height; // ridimensiona in proporzione
                        height = maxHeight;
                    }
                }

                // crea un canvas (un'area di disegno HTML) con le nuove dimensioni calcolate
                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");

                // disegna l'immagine originale sul canvas, ma ridotta alle nuove dimensioni
                ctx.drawImage(img, 0, 0, width, height);

                // converte il contenuto del canvas in un blob (dato binario compresso)
                canvas.toBlob(
                    (blob) => {
                        // crea un nuovo file immagine ridimensionato da inviare come se fosse un normale file
                        const resizedFile = new File([blob], file.name, { type: file.type });
                        resolve(resizedFile); // restituisce il nuovo file compresso
                    },
                    file.type, // mantiene il formato originale (es: image/jpeg)
                    0.5        // livello di qualità 
                );
            };
        });
    };


    // Funzione per gestire la selezione delle foto
    const handleFileChange = async (e) => {
        const newFiles = Array.from(e.target.files); // converto FileList in array
        if (newFiles.length > 0) { // se ci sono file selezionati
            const resizedFiles = await Promise.all(newFiles.map(file => resizeImage(file))); // chiamo la funzione resizeImage
            setForm((prevForm) => ({ // aggiorno lo stato del form
                ...prevForm, // mantengo gli altri campi
                photo: [...prevForm.photo, ...resizedFiles], // aggiungo i nuovi file all'array delle foto
            }));
        }
        e.target.value = null; // reset input
    };

    // rimuovi foto
    const removePhoto = (index) => {
        const newPhotos = form.photo.filter((_, i) => i !== index); // filtro l'array delle foto per rimuovere quella all'indice specificato
        setForm({ ...form, photo: newPhotos }); // aggiorno lo stato del giorno
    };

    useEffect(() => {
        if (query.length < 2) return; // evita richieste troppo frequenti

        const timeoutId = setTimeout(() => {
            fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=10`) // chiamo l'API di Photon per ottenere i luoghi
                .then(res => res.json())
                .then(data => {
                    if (data.features) {
                        setSuggestions(
                            data.features.map(f => ({
                                name: f.properties.name,
                                city: f.properties.city,
                                country: f.properties.country,
                                lat: f.geometry.coordinates[1],
                                lng: f.geometry.coordinates[0],
                            }))
                        );
                    }
                });
        }, 300); // debounce 300ms

        return () => clearTimeout(timeoutId);
    }, [query]);


    // gestisce l'invio del form e salva il nuovo giorno nel backend
    const handleSubmit = async (e) => {
        e.preventDefault(); // previene il comportamento di default del form

        if (!selectedTravel) {
            setMessage(" Devi selezionare un viaggio!");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("date", form.date);
            formData.append("title", form.title);
            formData.append("description", form.description);

            // aggiungo tutti i tags
            form.tags.forEach((tag) => {
                formData.append("tags", tag);
            });

            // aggiungo tutte le foto
            form.photo.forEach((file) => {
                formData.append("photos", file);
            });

            // attiva la barra di caricamento
            setIsUploading(true);
            setUploadProgress(0);

            await axios.post(
                `http://127.0.0.1:8000/travels/${selectedTravel}/days`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    // mi permette di vedere i progressi del caricamento
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.total) {
                            // viene calcolata la percentuale del caricamento
                            const percentCompleted = Math.round(
                                (progressEvent.loaded * 100) / progressEvent.total
                            );
                            setUploadProgress(percentCompleted);
                        }
                    },
                }
            );

            // disattiva la barra di caricamento
            setIsUploading(false);
            setUploadProgress(0);

            setForm({ date: "", title: "", description: "", tags: [], photo: [] }); // resetto il form
            setMessage({ text: "Tappa Aggiunta!", icon: "success" });

            // reindirizzo alla pagina delle tappe
            setTimeout(() => {
                setMessage(""); // fa sparire il modale
                navigate(`/travels/${selectedTravel}/days`);
            }, 2000);

        } catch (err) {
            console.error(err);
            setMessage({ text: "Errore: Tappa Non Aggiunta!", icon: "error" });
            setIsUploading(false);
        }
    };

    return {
        travels,            // lista dei viaggi
        selectedTravel,     // viaggio selezionato
        setSelectedTravel,  // funzione per impostare il viaggio selezionato
        form,               // stato del form
        setForm,            // funzione per impostare lo stato del form
        handleChange,       // funzione per gestire il cambiamento degli input
        handlePhotoSelect,  // funzione per aprire il selettore di foto
        fileInputRef,       // riferimento all'input file nascosto
        handleFileChange,   // funzione per gestire la selezione delle foto
        removePhoto,        // funzione per rimuovere una foto
        query,              // stato della query per i suggerimenti
        setQuery,           // funzione per impostare la query
        suggestions,        // stato dei suggerimenti
        setSuggestions,     // funzione per impostare i suggerimenti
        isTagModalOpen,     // stato per il modale dei tag
        setIsTagModalOpen,  // funzione per aprire/chiudere il modale dei tag
        handleSubmit,       // funzione per gestire l'invio del form
        message,            // messaggio di successo o errore
        isUploading,        // stato di caricamento
        uploadProgress,     // stato della percentuale di caricamento
        openImage,          // stato dell'immagine aperta in modale
        setOpenImage,       // funzione per impostare l'immagine aperta in modale
    }
}

export default FormAddDay;