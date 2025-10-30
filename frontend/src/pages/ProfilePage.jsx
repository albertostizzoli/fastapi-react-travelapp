import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import EditProfileModal from "../components/Modals/EditProfileModal";
import ModalDeleteProfile from "../components/DeleteModals/ModalDeleteProfile";


function ProfilePage() {
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
        setMessage("Arrivederci e a presto!");

        // Dopo 2 secondi effettua il logout e nasconde il messaggio
        setTimeout(() => {
          setMessage("");
          handleLogout();
        }, 2000);
      })
      .catch((err) => {
        console.error("Errore nell'eliminazione del profilo:", err);

        // Mostra messaggio di errore
        setMessage("❌ Errore durante l'eliminazione del profilo.");
        setTimeout(() => setMessage(""), 3000);
      });
  };

  // stato per i campi modificabili
  const [editForm, setEditForm] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    interests: "",
    photo: null,
  });

  // aggiorna i campi del form
  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

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
    formData.append("interests", JSON.stringify(editForm.interests));
    if (editForm.photo) formData.append("photo", editForm.photo);

    try {
      const res = await axios.put(`http://127.0.0.1:8000/users/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser(res.data); // aggiorno i dati utente
      setShowEditModal(false);
      setMessage("✅ Profilo aggiornato!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Errore aggiornamento profilo:", err);
      setMessage("❌ Errore durante l'aggiornamento del profilo.");
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

  return (
    <div className="flex flex-col min-h-screen text-white sm:p-8 p-4 relative overflow-hidden">
      {/* Effetto glow dinamico di sfondo */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute w-120 h-120 bg-linear-to-br from-blue-500/20 to-orange-400/10 
      rounded-full blur-3xl top-10 left-10 animate-[pulse_6s_ease-in-out_infinite]" />
        <div className="absolute w-md h-112 bg-linear-to-br from-orange-500/20 to-blue-400/10 
      rounded-full blur-3xl bottom-10 right-10 animate-[pulse_6s_ease-in-out_infinite]" />
      </div>

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 ">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 items-start">

          {/*  PROFILO UTENTE */}
          <motion.section
            className="md:col-span-1 bg-linear-to-br from-blue-100/10 via-orange-100/5 to-transparent backdrop-blur-2xl 
            p-6 rounded-3xl shadow-2xl border border-white/40 flex flex-col items-center text-center transition-all duration-500 
            hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.25)]"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {user?.photo ? (
              <img
                src={user.photo}
                alt="Profilo"
                className="rounded-full mb-6 shadow-[0_0_25px_rgba(255,255,255,0.2)] object-cover border-4 border-blue-600/70"
                style={{ width: "140px", height: "140px" }}
              />
            ) : (
              <div className="w-36 h-36 mb-6 rounded-full bg-white/10 flex items-center justify-center text-4xl font-bold
             text-gray-300 border-4 border-blue-600/70">
                {user?.name?.[0]?.toUpperCase() || "?"}
              </div>
            )}

            <h3 className="text-2xl font-bold text-white drop-shadow mb-3">
              {user?.name} {user?.surname}
            </h3>

            {user?.registration_date && (
              <p className="text-sm text-white/80 mb-6">
                Registrato il{" "}
                <span className="font-medium text-white">
                  {new Date(user.registration_date).toLocaleDateString("it-IT", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </p>
            )}

            <div className="w-full space-y-3 mt-4">
              <button
                onClick={() => {
                  setEditForm({
                    name: user?.name || "",
                    surname: user?.surname || "",
                    email: user?.email || "",
                    password: "",
                    interests: Array.isArray(user?.interests)
                      ? user.interests
                      : [],
                    photo: null,
                  });
                  setShowEditModal(true);
                }}
                className="font-semibold w-full flex items-center justify-center gap-2 px-4 py-2
                bg-linear-to-r from-orange-600 to-yellow-500 backdrop-blur-md border border-white/40
              text-white rounded-full shadow-md transition-all duration-500 hover:scale-105
                hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] cursor-pointer"
              >
                <i className="fa-solid fa-pen"></i> Modifica Profilo
              </button>

              <button
                onClick={() => setDeleteProfileId(user?.id)}
                className="font-semibold w-full flex items-center justify-center gap-2 px-4 py-2
                bg-linear-to-r from-red-600 to-rose-500 backdrop-blur-md border border-white/40
              text-white rounded-full shadow-md transition-all duration-100 hover:scale-105
                hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] cursor-pointer"
              >
                <i className="fa-solid fa-trash"></i> Cancella Profilo
              </button>

              <button
                onClick={handleLogout}
                className="font-semibold w-full flex items-center justify-center gap-2 px-4 py-2
                bg-linear-to-r from-blue-600 to-cyan-500 backdrop-blur-md border border-white/40
              text-white rounded-full shadow-md transition-all duration-100 hover:scale-105
                hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] cursor-pointer"
              >
                <i className="fa-solid fa-right-from-bracket"></i> Esci
              </button>
            </div>
          </motion.section>

          {/*  GESTIONE VIAGGI + ULTIMO VIAGGIO */}
          <motion.section
            className="flex flex-col gap-8 h-auto"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 1 },
              visible: { opacity: 1, transition: { staggerChildren: 0.4 } },
            }}
          >
            {/* Gestione viaggi */}
            <motion.div
              className="bg-linear-to-br from-blue-100/10 via-orange-100/5 to-transparent backdrop-blur-2xl 
              p-6 rounded-3xl shadow-2xl border border-white/40 flex flex-col gap-4 transition-all duration-500 
              hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.25)]"
              variants={{
                hidden: { scale: 0.9, opacity: 0 },
                visible: {
                  scale: 1,
                  opacity: 1,
                  transition: { duration: 1, ease: "easeOut" },
                },
              }}
            >
              <h3 className="text-2xl font-bold text-white text-center mb-4 drop-shadow">
                Gestisci i tuoi viaggi
              </h3>
              <div className="flex flex-col w-full gap-2 justify-center">
                <Link
                  to="/travels"
                  className="font-semibold flex justify-center items-center gap-2 px-4 py-2
                  bg-linear-to-r from-orange-600 to-rose-500 backdrop-blur-md border border-white/40
                 text-white rounded-full shadow-md transition-all duration-100 hover:scale-105
                  hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]"
                >
                  <i className="fa-solid fa-globe"></i> I miei viaggi
                </Link>
                <Link
                  to="/add"
                  className="font-semibold flex justify-center items-center gap-2 px-4 py-2
                  bg-linear-to-r from-green-600 to-teal-500 backdrop-blur-md border border-white/40
                 text-white rounded-full shadow-md transition-all duration-100 hover:scale-105
                  hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]"
                >
                  <i className="fa-solid fa-plus"></i> Aggiungi Viaggio
                </Link>
                <Link
                  to="/chat"
                  className="font-semibold flex justify-center items-center gap-2 px-4 py-2
                  bg-linear-to-r from-blue-600 to-cyan-500 backdrop-blur-md border border-white/40
                 text-white rounded-full shadow-md transition-all duration-100 hover:scale-105
                  hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] cursor-pointer"
                >
                  <i className="fa-solid fa-compass"></i> Prossimo Viaggio
                </Link>
              </div>
            </motion.div>

            {/* Ultimo viaggio */}
            <motion.div
              className="bg-linear-to-br from-blue-100/10 via-orange-100/5 to-transparent backdrop-blur-2xl 
              p-6 rounded-3xl shadow-2xl border border-white/40 transition-all duration-500 hover:scale-105
              hover:shadow-[0_0_30px_rgba(255,255,255,0.25)]"
              variants={{
                hidden: { scale: 0.9, opacity: 0 },
                visible: {
                  scale: 1,
                  opacity: 1,
                  transition: { duration: 1, ease: "easeOut" },
                },
              }}
            >
              <h3 className="text-2xl font-bold text-white text-center mb-4 drop-shadow">
                Ultimo Viaggio
              </h3>

              {recentTravels?.length ? (
                <ul className="space-y-4">
                  {recentTravels.slice(0, 1).map((travel, idx) => (
                    <li
                      key={idx}
                      className="p-4 bg-linear-to-r from-blue-600 to-cyan-500 backdrop-blur-md 
                      rounded-3xl shadow-lg hover:scale-[1.03] hover:shadow-2xl 
                      transition-all duration-100 border border-white/40"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-lg font-semibold text-white">
                          <i className="fa-solid fa-location-dot mr-2 text-orange-300"></i>
                          {travel.town}, {travel.city}
                        </h4>
                        <span className="text-xs bg-white/20 px-2 py-1 rounded-3xl text-white">
                          {travel.start_date} → {travel.end_date}
                        </span>
                      </div>
                      <div className="border-t border-white/40 my-2" />
                      {travel.general_vote ? (
                        <StarRating rating={travel.general_vote} />
                      ) : (
                        <p className="text-gray-200 italic text-sm">
                          Nessun voto disponibile
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center font-semibold text-white/80 italic">
                  Nessun viaggio recente.
                </p>
              )}
            </motion.div>
          </motion.section>

          {/*  INTERESSI UTENTE */}
          <motion.div
            className="bg-linear-to-br from-blue-100/10 via-orange-100/5 to-transparent backdrop-blur-2xl 
            p-6 rounded-3xl shadow-2xl border border-white/40 transition-all duration-500 hover:scale-105
            hover:shadow-[0_0_30px_rgba(255,255,255,0.25)]"
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h3 className="text-2xl font-bold text-white text-center mb-4 drop-shadow">
              I tuoi interessi
            </h3>
            {user?.interests?.length ? (
              <div className="flex flex-wrap justify-center items-center gap-2">
                {user.interests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="font-semibold px-4 py-2 bg-linear-to-r from-blue-600 to-cyan-500
                    backdrop-blur-md border border-white/40 text-white rounded-full 
                    text-sm sm:text-base shadow-md hover:scale-105 transition-all duration-100"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-center font-semibold text-white/80 italic">
                Nessun interesse impostato.
              </p>
            )}
          </motion.div>
        </div>

        {/* Modali */}
        <ModalDeleteProfile
          isOpen={!!deleteProfileId}
          onConfirm={handleDeleteProfile}
          onCancel={() => setDeleteProfileId(null)}
        />
        <EditProfileModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleUpdateProfile}
          editForm={editForm}
          setEditForm={setEditForm}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
        />
      </main>

      {/* Messaggio conferma */}
      {message && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.5 }}
          className="fixed top-6 right-6 backdrop-blur-2xl border border-white/40 text-white 
          px-6 py-3 rounded-full shadow-lg z-9999 bg-linear-to-r from-blue-500 to-orange-500"
        >
          <p className="text-lg font-semibold">{message}</p>
        </motion.div>
      )}
    </div>
  );


}

export default ProfilePage;