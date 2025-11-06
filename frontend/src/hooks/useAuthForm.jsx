import { useState, useRef } from "react"; // hook di stato e riferimento
import axios from "axios"; // libreria per le richieste HTTP
import { useNavigate } from "react-router-dom"; // hook per la navigazione

function useAuthForm() {
    const [isLogin, setIsLogin] = useState(true); //  stato per il toggle login/registrazione
    const [name, setName] = useState(""); // stato per il nome
    const [surname, setSurname] = useState(""); // stato per il cognome
    const [email, setEmail] = useState(""); // stato per l'email
    const [password, setPassword] = useState(""); // stato per la password
    const [showPassword, setShowPassword] = useState(false); // stato per nascondere / mostrare la password
    const [selectedInterests, setSelectedInterests] = useState([]); // stato per gli interessi selezionati
    const [isModalOpen, setIsModalOpen] = useState(false); // stato per il modale interessi
    const [photo, setPhoto] = useState(null); // stato per la foto profilo
    const fileInputRef = useRef(null); // riferimento all’input nascosto
    const [message, setMessage] = useState(""); // stato per i messaggi di errore/successo
    const navigate = useNavigate(); // hook per la navigazione

    // Funzione per selezionare/deselezionare un interesse
    const toggleInterest = (tag) => {
        if (selectedInterests.includes(tag)) { // se l'interesse è già selezionato lo rimuovo
            setSelectedInterests(selectedInterests.filter((t) => t !== tag)); // filtro l'array rimuovendo il tag
        } else {
            setSelectedInterests([...selectedInterests, tag]); // altrimenti lo aggiungo
        }
    };

    // Funzione per gestire la selezione della foto
    const handlePhotoSelect = () => {
        fileInputRef.current.click(); // simula il click sull’input file nascosto
    };

    // Funzione per gestire il cambiamento del file selezionato
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            setMessage(` Foto selezionata: ${file.name}`);
        }
    };

    //  LOGIN
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                "http://127.0.0.1:8000/users/login",
                null,
                { params: { email, password } }
            );

            const token = res.data.access_token;
            localStorage.setItem("token", token);
            localStorage.setItem("userId", res.data.user_id);

            // Mostra messaggio di successo
            setMessage("✅ Bentornato!");

            // Dopo 2 secondi naviga alla pagina profilo
            setTimeout(() => {
                setMessage(""); // scompare il modale
                navigate("/profile");
            }, 2000);

        } catch (err) {
            if (err.response) {
                setMessage(`❌ Errore: ${err.response.data.detail}`);
            } else {
                setMessage("❌ Errore di connessione al server");
            }
            // facciamo sparire il messaggio di errore dopo 3 secondi
            setTimeout(() => setMessage(""), 3000);
        }
    };


    //  REGISTRAZIONE
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("surname", surname);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("interests", JSON.stringify(selectedInterests));
            if (photo) formData.append("photo", photo);

            await axios.post("http://127.0.0.1:8000/users/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setMessage("✅ Benvenuto!");

            // Login automatico subito dopo la registrazione
            const res = await axios.post(
                "http://127.0.0.1:8000/users/login",
                null,
                { params: { email, password } }
            );

            const token = res.data.access_token;
            localStorage.setItem("token", token);
            localStorage.setItem("userId", res.data.user_id);


            // Dopo 2 secondi resetto il messaggio e passo al profilo
            setTimeout(() => {
                setMessage("");
                navigate("/profile");
            }, 2000);

        } catch (err) {
            if (err.response) {
                setMessage(`❌ Errore: ${err.response.data.detail}`);
            } else {
                setMessage("❌ Errore di connessione al server");
            }
            setTimeout(() => setMessage(""), 3000);
        }
    };

    return {
        isLogin, // stato per il toggle login/registrazione
        setIsLogin, // funzione per cambiare stato
        name, // nome
        setName, // funzione per cambiare nome
        surname, // cognome
        setSurname, // funzione per cambiare cognome
        email, // email
        setEmail, // funzione per cambiare email
        password, // password
        setPassword, // funzione per cambiare password
        showPassword, // stato per mostrare/nascondere la password
        setShowPassword, // funzione per cambiare stato mostra/nascondi password
        selectedInterests, // interessi selezionati
        toggleInterest, // funzione per selezionare/deselezionare un interesse
        isModalOpen, // stato per il modale interessi
        setIsModalOpen, // funzione per cambiare stato del modale interessi
        handleSubmit, // funzione per il login
        handleRegister, // funzione per la registrazione
        message, // messaggio di errore/successo
        photo, // foto profilo
        handlePhotoSelect, // funzione per selezionare la foto
        handleFileChange, // funzione per gestire il cambiamento del file selezionato
        fileInputRef // riferimento all’input file nascosto
    };
}

export default useAuthForm;