import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function FormEditDay() {
    const { id } = useParams();   // recupero l'ID del giorno dall'URL
    const navigate = useNavigate(); // hook per navigare fra le pagine
    const [day, setDay] = useState(null); // per salvare i dati del giorno
    const [message, setMessage] = useState(""); // messaggio di successo o errore
    const [loading, setLoading] = useState(true); // stato di caricamento
    const fileInputRef = useRef(null); // riferimento all’input nascosto
    const [openImage, setOpenImage] = useState(null); // stato per l'immagine ingrandita (Apri / Chiudi)
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false); // apre / chiude il modale delle categorie
    const [isUploading, setIsUploading] = useState(false); // stato per il caricamento
    const [uploadProgress, setUploadProgress] = useState(0); // stato per mostare la barra di caricamento
    const location = useLocation();
    const travelId = location.state?.travelId || day?.travelId; // uso location per tornare alle tappe

    const token = localStorage.getItem("token"); // prendo il token dal LocalStorage

    // recupero i dati del giorno dal backend
    useEffect(() => {
        const fetchDay = async () => {
            try {
                // recupera tutti i viaggi dell'utente
                const res = await axios.get(`http://127.0.0.1:8000/travels?user_id=${localStorage.getItem("userId")}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // cerca il giorno con l'id giusto
                let foundDay = null;
                res.data.forEach((travel) => {
                    const d = travel.days.find((day) => day.id === parseInt(id));
                    if (d) foundDay = { ...d, travelId: travel.id }; // aggiungi travelId
                });

                setDay(foundDay);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchDay();
    }, [id, token]);

    // gestione cambiamento dei campi
    const handleChange = (e) => {
        const { name, value } = e.target; // prendo il nome e il valore del campo
        setDay({ ...day, [name]: value }); // aggiorno lo stato del giorno
    };

    // Funzione per gestire la selezione della foto
    const handlePhotoSelect = () => {
        fileInputRef.current.click(); // simula il click sull’input file nascosto
    };

    // Ridimensiona e comprime le immagini prima dell'upload
    const resizeImage = (file, maxWidth = 1024, maxHeight = 1024) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = URL.createObjectURL(file);

            img.onload = () => {
                let { width, height } = img;
                if (width > height) {
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                }

                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        const resizedFile = new File([blob], file.name, { type: file.type });
                        resolve(resizedFile);
                    },
                    file.type,
                    0.5
                );
            };
        });
    };

    const handleFileChange = async (e) => {
        const newFiles = Array.from(e.target.files);
        if (newFiles.length === 0) return;

        try {
            // Ridimensiona tutte le immagini in parallelo
            const resizedFiles = await Promise.all(newFiles.map(file => resizeImage(file)));

            setDay((prevDay) => {
                const updatedPhotos = [...(prevDay.photo || []), ...resizedFiles];
                return { ...prevDay, photo: updatedPhotos };
            });
        } catch (error) {
            console.error("Errore nel ridimensionamento immagini:", error);
        } finally {
            e.target.value = null; // reset input
        }
    };


    // rimuovi foto
    const removePhoto = (index) => {
        const newPhotos = day.photo.filter((_, i) => i !== index); // filtro l'array delle foto per rimuovere quella all'indice specificato
        setDay({ ...day, photo: newPhotos }); // aggiorno lo stato del giorno
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        const formData = new FormData();
        formData.append("date", day.date);
        formData.append("city", day.city);
        formData.append("title", day.title);
        formData.append("description", day.description);

        // aggiungo tutte le esperienze
        day.experiences.forEach((experience) => {
            formData.append("experiences", experience);
        });

        // foto già esistenti
        (day.photo || []).forEach((item) => {
            if (typeof item === "string") {
                formData.append("existing_photos", item);
            } else {
                formData.append("photos", item);
            }
        });

        try {
            // Attiva la barra di caricamento
            setIsUploading(true);
            setUploadProgress(0);

            await axios.put(
                `http://127.0.0.1:8000/travels/${day.travelId}/days/${id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.total) {
                            const percentCompleted = Math.round(
                                (progressEvent.loaded * 100) / progressEvent.total
                            );
                            setUploadProgress(percentCompleted);
                        }
                    },
                }
            );
            setMessage({ text: "Tappa Modificata!", icon: "success" });
            setIsUploading(false);

            // reindirizzo alla pagina delle tappe
            setTimeout(() => {
                setMessage(""); // fa sparire il modale
                navigate(`/travels/${day.travelId}/days`);
            }, 2000);
        } catch (error) {
            console.error("Errore nell'aggiornamento:", error);
            setMessage({ text: "Errore: Tappa Non Modificata!", icon: "error" });
            setIsUploading(false);
        }
    };

    return {
        day,                    // stato del giorno
        setDay,                 // funzione per aggiornare il giorno
        loading,                // stato di caricamento
        message,                // messaggio di successo o errore
        handleChange,           // funzione per gestire i cambiamenti dei campi
        fileInputRef,           // riferimento all’input file nascosto
        handlePhotoSelect,      // funzione per aprire il selettore di foto
        handleFileChange,       // funzione per gestire il cambiamento del file selezionato
        removePhoto,            // funzione per rimuovere una foto
        handleSubmit,           // funzione per gestire l'invio del form
        openImage,              // stato per l'immagine ingrandita (Apri / Chiudi)
        setOpenImage,           // funzione per aggiornare lo stato dell'immagine ingrandita
        isCategoryModalOpen,    // stato per il modale delle categorie (Apri / Chiudi)
        setIsCategoryModalOpen, // funzione per aggiornare lo stato del modale delle categorie
        isUploading,            // stato per il caricamento
        uploadProgress,         // stato per mostare la barra di caricamento
        travelId,               // ID del viaggio per il ritorno alle tappe
    }
}

export default FormEditDay;