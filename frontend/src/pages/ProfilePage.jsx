import { useState, useEffect } from "react";
import axios from "axios";

function ProfilePage() {
    const [user, setUser] = useState(null); // stato per i dati utente

    // uso lo useEffect per ottenere i dati dell'utente
    useEffect(() => {
        const userId = localStorage.getItem("userId"); // recupero id utente
        if (!userId) return; // se non c'è, non faccio nulla

        axios
            .get(`http://127.0.0.1:8000/users?user_id=${userId}`) // recupera i dati dell'utente dal backend
            .then((res) => setUser(res.data)) // aggiorna lo stato con i dati ricevuti
            .catch((err) => console.error(err)); // gestisce errori
    });

    return (
        <div className="bg-transparent p-8 overflow-visible min-h-screen">
            {/* Titolo */}
            <h1 className="text-3xl font-bold text-center mb-8">👤 Il mio profilo</h1>
        </div>
    );
    
}

export default ProfilePage;