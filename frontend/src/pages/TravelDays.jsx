import React from "react";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import WorldMap from "../components/WorldMap";
import { motion } from "framer-motion";

function TravelDays() {
  const { id } = useParams(); // prendo l'id del viaggio dai parametri URL
  const [travel, setTravel] = useState(null); // stato per i dati del viaggio
  const [deleteDayId, setDeleteDayId] = useState(null); //  stato per il modale di conferma eliminazione giorno
  const [selectedDay, setSelectedDay] = useState(null); //  stato per il modale Leggi Tutto
  const [openImage, setOpenImage] = useState(null); // stato per l'immagine ingrandita
  const MemoWorldMap = React.memo(WorldMap); // memorizzo la mappa

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
    axios
      .get(`http://127.0.0.1:8000/travels/${id}`) // Chiamata API per ottenere i dati del viaggio
      .then((res) => setTravel(res.data)) // Aggiorno lo stato con i dati ricevuti
      .catch((err) => console.error(err)); // Gestione eventuali errori
  };

  // Funzione per eliminare un giorno
  const handleDeleteDay = () => {
    axios
      .delete(`http://127.0.0.1:8000/travels/${id}/days/${deleteDayId}`) // Chiamata API per eliminare il giorno
      .then(() => { // Se l'eliminazione ha successo
        setTravel({ // aggiorno lo stato del viaggio rimuovendo il giorno eliminato
          ...travel, // mantengo gli altri dati del viaggio
          days: travel.days.filter((d) => d.id !== deleteDayId), // filtro il giorno eliminato
        });
        setDeleteDayId(null); // chiudo il modale di conferma eliminazione
      })
      .catch((err) => console.error(err)); // Gestione eventuali errori
  };

  if (!travel) return <p className="text-center mt-8">⏳ Caricamento...</p>;

  // Animazione con framer-motion
  const infoAnimate = {
        initial: {
            x: -100, // parte da 100px a sinistra
            opacity: 0
        },
        animate: {
            x: 0, // si sposta nella posizione originale
            opacity: 1,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1,
            }
        }
    };

    const buttonAnimate = {
        initial: {
            x: 100, // parte da 100px a destra
            opacity: 0
        },
        animate: {
            x: 0, // si sposta nella posizione originale
            opacity: 1,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };
    const MotionLink = motion(Link); // creo un Motion per i Link


  return (
    <div className="min-h-screen bg-transparent md:p-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 max-w-6xl mx-auto gap-4">
        <motion.h1 className="text-3xl font-bold text-white flex-1 min-w-[200px]" variants={infoAnimate} initial="initial" animate="animate">
          🗓️ Tappe del viaggio
        </motion.h1>
        <MotionLink
          to="/addDay"
          state={{ travelId: id }}
          className="mt-4 sm:mt-0 px-4 py-2 flex items-center gap-2 bg-green-500 hover:bg-green-400 rounded-lg text-white font-medium shadow-md transition hover:scale-105"
          variants={buttonAnimate} initial="initial" animate="animate">
          <i className="fa-solid fa-plus"></i> Aggiungi Tappa
        </MotionLink>
      </div>

      {/* Layout principale */}
      <div className="flex flex-col lg:flex-row max-w-6xl mx-auto gap-8">
        {/* Colonna sinistra - Info Viaggio + Giorni */}
        <div className="flex-1 flex flex-col h-full">
          {/* Info Viaggio */}
          <motion.div className="p-6 bg-transparent rounded-xl" variants={infoAnimate} initial="initial" animate="animate">
            <h2 className="text-xl font-semibold text-white mb-2">
              📍 {travel.town} - {travel.city}
            </h2>
            <p className="text-white mb-4">
              📅 {travel.start_date} → {travel.end_date}
            </p>
            {travel.title && <p className="text-gray-200 italic">{travel.title}</p>}
          </motion.div>

          {/* Lista Giorni in griglia */}
          <div className="flex-1 overflow-y-auto pr-2">
            {travel.days?.length > 0 ? (
              <div className="flex flex-wrap gap-4">
                {travel.days.map((d) => (
                  <div
                    key={d.id}
                    className="backdrop-blur-xl p-4 rounded-xl shadow-lg border border-gray-700 flex flex-col justify-between w-full sm:w-64">
                    <div className="mb-4">
                      <p className="text-gray-300 text-lg">{d.date}</p>
                      <p className="text-white font-semibold text-xl">{d.title}</p>
                    </div>

                    {d.photo.length > 0 && (
                      <div className="flex gap-2 flex-wrap mb-4">
                        {d.photo.slice(0, 2).map((p, i) => (
                          <img
                            key={i}
                            src={p}
                            alt="foto viaggio"
                            loading="lazy"
                            className="w-20 h-20 object-cover rounded-lg border border-gray-600 shadow-sm"
                          />
                        ))}
                      </div>
                    )}

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => setSelectedDay(d)}
                        className="px-4 py-2 flex items-center justify-center bg-blue-500 hover:bg-blue-400 text-white rounded-lg shadow-md transition hover:scale-105 cursor-pointer">
                        <i className="fa-solid fa-book-open mr-2"></i> Leggi Tutto
                      </button>

                      <Link
                        to={`/days/${d.id}/edit`}
                        className="px-4 py-2 flex items-center justify-center bg-yellow-500 hover:bg-yellow-400 text-white rounded-lg shadow-md transition hover:scale-105 cursor-pointer">
                        <i className="fa-solid fa-edit mr-2"></i>
                        Modifica Tappa
                      </Link>

                      <button
                        onClick={() => setDeleteDayId(d.id)}
                        className="px-4 py-2 flex items-center justify-center bg-red-500 hover:bg-red-400 text-white rounded-lg shadow-md transition hover:scale-105 cursor-pointer">
                        <i className="fa-solid fa-trash mr-2"></i> Elimina Tappa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white text-center mt-4">Nessuna Tappa Presente</p>
            )}
          </div>
        </div>
      </div>

      {/* Modale Leggi Tutto */}
      {selectedDay && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-2 sm:p-4 z-[9999]">
          <div className="bg-gray-800 rounded-xl w-full max-w-full sm:max-w-5xl h-[90vh] shadow-lg flex flex-col lg:flex-row overflow-hidden">

            {/* Colonna sinistra: contenuti scrollabili */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto scrollbar-custom max-h-full">
              {/* Bottone Chiudi */}
              <button
                onClick={() => setSelectedDay(null)}
                className="px-3 py-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-400 text-white rounded-lg shadow-md transition hover:scale-105 cursor-pointer">
                <i className="fa-solid fa-arrow-left"></i> Chiudi
              </button>

              {/* Titolo */}
              <div className="flex justify-between items-start mb-3 mt-3">
                <h1 className="text-2xl sm:text-2xl font-bold text-white">
                  {selectedDay.title}
                </h1>
              </div>

              {/* Data */}
              <div className="flex justify-between items-start mb-3 mt-3">
                <p className="sm:text-xl text-white">{selectedDay.date}</p>
              </div>

              {/* Descrizione */}
              <p className="text-white text-justify mb-3">{selectedDay.description}</p>

              {/* Foto */}
              {selectedDay.photo.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedDay.photo.map((p, i) => (
                    <img
                      key={i}
                      src={p}
                      alt="foto viaggio"
                      loading="lazy"
                      onClick={() => setOpenImage(p)}
                      className="w-full h-40 sm:h-40 object-cover rounded-lg border-3 border-gray-600 shadow-sm cursor-pointer hover:border-white" />
                  ))}
                </div>
              )}
            </div>

            {/* Colonna destra: mappa */}
            <div className="flex justify-center items-center p-10">
              <MemoWorldMap days={travel.days} selectedDay={selectedDay} />
            </div>

            {/* Modale Foto */}
            {openImage && (
              <div
                className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[10000]"
                onClick={() => setOpenImage(null)}>
                <img
                  src={openImage}
                  alt="foto ingrandita"
                  loading="lazy"
                  className="max-h-[90%] max-w-[90%] rounded-lg shadow-lg" />
              </div>
            )}
          </div>
        </div>
      )}


      {/* Modale di conferma eliminazione giorno */}
      {deleteDayId && ( // se deleteDayId non è null, mostro il modale
        <div className="fixed inset-0 flex items-center justify-center bg-transparent z-[9999]">
          <div className="backdrop-blur-xl p-6 rounded-xl shadow-lg w-80 text-center">
            <h2 className="text-xl font-bold mb-4 text-white">
              Sei sicuro di voler eliminare la tappa?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDeleteDay}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg shadow-md transition hover:scale-105 cursor-pointer">
                <i className="fa-solid fa-check"></i> Sì
              </button>
              <button
                onClick={() => setDeleteDayId(null)}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-lg shadow-md transition hover:scale-105 cursor-pointer">
                <i className="fa-solid fa-xmark"></i> No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TravelDays;
