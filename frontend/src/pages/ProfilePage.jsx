import { Link } from "react-router-dom"; // importo Link per la navigazione interna
import { motion } from "framer-motion"; // importo framer-motion per le animazioni
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // importo FontAwesomeIcon per le icone
import { faCheckCircle, faCompass, faEdit, faGlobe, faPlus, faRightFromBracket, faTrash, faXmarkCircle } from "@fortawesome/free-solid-svg-icons"; // importo le icone necessarie
import EditProfileModal from "../components/Modals/EditProfileModal"; // importo il modale di modifica profilo
import ModalDeleteProfile from "../components/DeleteModals/ModalDeleteProfile"; // importo il modale di conferma eliminazione profilo
import ProfileController from "../hooks/ProfileController"; // importo la logica della pagina profilo

function ProfilePage() {

  const {
    user,                      // dati utente
    recentTravels,             // viaggi recenti
    deleteProfileId,           // id del profilo da eliminare
    message,                   // messaggi di errore/successo
    showEditModal,             // stato del modale di modifica
    showPassword,              // stato per mostrare/nascondere la password
    setShowPassword,           // funzione per aggiornare lo stato showPassword
    handleLogout,              // funzione per il logout
    handleDeleteProfile,       // funzione per eliminare il profilo
    setDeleteProfileId,        // funzione per aggiornare lo stato deleteProfileId
    setShowEditModal,          // funzione per aggiornare lo stato showEditModal
    editForm,                  // stato del form di modifica
    setEditForm,               // funzione per aggiornare lo stato del form di modifica
    handleUpdateProfile,       // funzione per aggiornare il profilo
    StarRating                 // componente per la valutazione a stelle
  } = ProfileController();     // utilizzo il controller per ottenere la logica della pagina


  return (
    <div className="flex flex-col min-h-screen text-white sm:p-8 p-4 relative overflow-hidden">
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 ">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 items-start">

          {/*  PROFILO UTENTE */}
          <motion.section
            className="md:col-span-1 bg-linear-to-br from-white/20 via-white/10 to-transparent backdrop-blur-2xl 
            p-6 rounded-3xl shadow-2xl border border-white/40 flex flex-col items-center text-center transition-all duration-500 
            hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.30)]"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}>

            {user?.photo ? (
              <img
                src={user.photo}
                alt="Profilo"
                className="rounded-full mb-6 shadow-[0_0_25px_rgba(255,255,255,0.2)] 
                object-cover border-4 border-blue-600/70 dark:border-slate-900/70"
                style={{ width: "140px", height: "140px" }}
              />
            ) : (
              <div className="w-36 h-36 mb-6 rounded-full bg-white/10 flex items-center justify-center text-4xl font-bold
             text-gray-300 border-4 border-blue-600/70 dark:border-slate-900/70">
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
                    experiences: Array.isArray(user?.experiences)
                      ? user.experiences
                      : [],
                    photo: null,
                  });
                  setShowEditModal(true);
                }}
                className="font-semibold w-full flex items-center justify-center gap-2 px-4 py-2
                bg-linear-to-br from-orange-600 to-yellow-500
                backdrop-blur-md border border-white/40 text-white 
                rounded-full shadow-md transition-all duration-300 hover:scale-105
                hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] cursor-pointer">
                <FontAwesomeIcon icon={faEdit} /> Modifica Profilo
              </button>

              <button
                onClick={() => setDeleteProfileId(user?.id)}
                className="font-semibold w-full flex items-center justify-center gap-2 px-4 py-2
                bg-linear-to-br from-red-600 to-rose-500 
                backdrop-blur-md border border-white/40 text-white 
                rounded-full shadow-md transition-all duration-300 hover:scale-105
                hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] cursor-pointer">
                <FontAwesomeIcon icon={faTrash} /> Cancella Profilo
              </button>

              <button
                onClick={handleLogout}
                className="font-semibold w-full flex items-center justify-center gap-2 px-4 py-2
                bg-linear-to-br from-blue-600 to-cyan-500
                backdrop-blur-md border border-white/40 text-white 
                rounded-full shadow-md transition-all duration-300 hover:scale-105
                hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] cursor-pointer">
                <FontAwesomeIcon icon={faRightFromBracket} /> Esci
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
            }}>

            {/* Gestione viaggi */}
            <motion.div
              className="bg-linear-to-br from-white/20 via-white/10 to-transparent backdrop-blur-2xl
              p-6 rounded-3xl shadow-2xl border border-white/40 flex flex-col gap-4 transition-all duration-500 
              hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.30)]"
              variants={{
                hidden: { scale: 0.9, opacity: 0 },
                visible: {
                  scale: 1,
                  opacity: 1,
                  transition: { duration: 1, ease: "easeOut" },
                },
              }}>

              <h3 className="text-2xl font-bold text-white text-center mb-4 drop-shadow">
                Gestisci i tuoi viaggi
              </h3>

              <div className="flex flex-col w-full gap-2 justify-center">
                <Link
                  to="/travels"
                  className="font-semibold flex justify-center items-center gap-2 px-4 py-2
                  bg-linear-to-br from-orange-600 to-rose-500 
                  backdrop-blur-md border border-white/40 text-white 
                  rounded-full shadow-md transition-all duration-300 hover:scale-105
                  hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]">
                  <FontAwesomeIcon icon={faGlobe} /> I miei viaggi
                </Link>
                <Link
                  to="/add"
                  className="font-semibold flex justify-center items-center gap-2 px-4 py-2
                  bg-linear-to-br from-green-600 to-teal-500
                  backdrop-blur-md border border-white/40 text-white 
                  rounded-full shadow-md transition-all duration-300 hover:scale-105
                  hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]">
                  <FontAwesomeIcon icon={faPlus} /> Aggiungi Viaggio
                </Link>
                <Link
                  to="/chat"
                  className="font-semibold flex justify-center items-center gap-2 px-4 py-2
                  bg-linear-to-br from-blue-600 to-cyan-500 backdrop-blur-md border border-white/40 text-white 
                  rounded-full shadow-md transition-all duration-300 hover:scale-105
                  hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] cursor-pointer">
                  <FontAwesomeIcon icon={faCompass} /> Il mio prossimo viaggio
                </Link>
              </div>
            </motion.div>

            {/* Ultimo viaggio */}
            <motion.div
              className="bg-linear-to-br from-white/20 via-white/10 to-transparent backdrop-blur-2xl
              p-6 rounded-3xl shadow-2xl border border-white/40 transition-all duration-500 hover:scale-105
              hover:shadow-[0_0_30px_rgba(255,255,255,0.30)]"
              variants={{
                hidden: { scale: 0.9, opacity: 0 },
                visible: {
                  scale: 1,
                  opacity: 1,
                  transition: { duration: 1, ease: "easeOut" },
                },
              }}>

              <h3 className="text-2xl font-bold text-white text-center mb-4 drop-shadow">
                Ultimo Viaggio
              </h3>

              {recentTravels?.length ? (
                <ul className="space-y-4">
                  {recentTravels.slice(0, 1).map((travel, idx) => (
                    <li
                      key={idx}
                      className="p-4 bg-linear-to-br from-red-600 to-blue-500
                      backdrop-blur-md 
                      rounded-3xl shadow-lg hover:scale-[1.03] hover:shadow-2xl 
                      transition-all duration-300 border border-white/40">

                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-xl font-bold text-white">
                          <i className="fa-solid fa-location-dot mr-2 text-orange-300"></i>
                          {travel.town}, {travel.city}
                        </h4>
                        <span className="text-sm bg-white/20 px-2 py-1 rounded-3xl text-white">
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

          {/*  ESPERIENZE UTENTE */}
          <motion.div
            className="bg-linear-to-br from-white/20 via-white/10 to-transparent backdrop-blur-2xl
            p-6 rounded-3xl shadow-2xl border border-white/40 transition-all duration-500 hover:scale-105
            hover:shadow-[0_0_30px_rgba(255,255,255,0.30)]"
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}>

            <h3 className="text-2xl font-bold text-white text-center mb-4 drop-shadow">
              Le tue esperienze preferite
            </h3>

            {user?.experiences?.length ? (
              <div className="flex flex-wrap justify-center items-center gap-2">
                {user.experiences.map((experience, idx) => (
                  <span
                    key={idx}
                    className="font-semibold px-4 py-2 bg-linear-to-br from-red-600 to-blue-500
                     backdrop-blur-md border border-white/40 text-white rounded-full 
                    text-sm sm:text-base shadow-md hover:shadow-[0_0_30px_rgba(255,255,255,0.30)] transition-all duration-300">
                    {experience}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-center font-semibold text-white/80 italic">
                Nessuna esperienza impostata.
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
          className="fixed top-6 right-6 flex items-center gap-3 backdrop-blur-lg 
          border border-white/40 text-white px-6 py-3 rounded-full shadow-xl z-9999
          bg-linear-to-br from-blue-500 to-orange-500 dark:from-slate-900 dark:to-slate-500">
          {message.icon === "success" && (
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-2xl mr-2" />
          )}
          {message.icon === "error" && (
            <FontAwesomeIcon icon={faXmarkCircle} className="text-red-500 text-2xl mr-2" />
          )}
          <p className="text-xl font-semibold">{message.text}</p>
        </motion.div>
      )}
    </div>
  );
}

export default ProfilePage;