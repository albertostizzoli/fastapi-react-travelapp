import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import WorldMap from "../components/WorldMap";

function TravelDays() {
  const { id } = useParams(); // prendo l'id del viaggio dai parametri URL
  const [travel, setTravel] = useState(null); // stato per ottenere i dati del viaggio
  const [deleteDayId, setDeleteDayId] = useState(null); //  stato per il modale di conferma eliminazione giorno (Apri / Chiudi)
  const [selectedDay, setSelectedDay] = useState(null); //  stato per il modale Leggi Tutto (Apri / Chiudi)
  const [openImage, setOpenImage] = useState(null); // stato per l'immagine ingrandita (Apri / Chiudi) 
  const [isOpen, setIsOpen] = useState(false); // stato per ingrandire e ridurre la mappa 
  const mapRef = useRef(null); // per ridisegnare la mappa quando è ingrandita

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

  // Quando la modale si apre, forziamo Leaflet a ridisegnarsi
  useEffect(() => {
    if (isOpen && mapRef.current) {
      setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 300); // piccolo delay per dare tempo all'animazione
    }
  }, [isOpen]);

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


  return (
    <div className="min-h-screen bg-transparent md:p-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 max-w-6xl mx-auto gap-4">
        { /* Titolo */}
        <h1 className="text-3xl font-bold text-white flex-1 min-w-[200px]">
          🗓️ Tappe del viaggio
        </h1>
        { /* Link Aggiungi Tappa */}
        <Link
          to="/addDay"
          state={{ travelId: id }}
          className="mt-4 sm:mt-0 px-4 py-2 flex items-center gap-2 bg-green-500 hover:bg-green-400 rounded-lg text-white font-medium shadow-md transition hover:scale-105">
          <i className="fa-solid fa-plus"></i> Aggiungi Tappa
        </Link>
      </div>

      {/* Layout principale */}
      <div className="flex flex-col lg:flex-row max-w-6xl mx-auto gap-8">
        {/* Info Viaggio + Giorni */}
        <div className="flex-1 flex flex-col h-full">
          {/* Info Viaggio */}
          <div className="p-6 bg-transparent rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-2">
              📍 {travel.town} - {travel.city} {/* Paese e Città */}
            </h2>
            <p className="text-white mb-4">
              📅 {travel.start_date} → {travel.end_date} { /* Data Inizio e Data Fine */}
            </p>
            {travel.title && <p className="text-gray-200 italic">{travel.title}</p>} { /* Titolo */}
          </div>

          {/* Lista Giorni in griglia */}
          <div className="flex-1 overflow-y-auto pr-2">
            {travel.days?.length > 0 ? (
              <div className="flex flex-wrap gap-4">
                {travel.days.map((d) => (
                  <div
                    key={d.id}
                    className="backdrop-blur-xl p-4 rounded-xl shadow-lg border border-gray-700 flex flex-col justify-between w-full sm:w-64">
                    <div className="mb-4">
                      <p className="text-gray-300 text-lg">{d.date}</p> { /* Data */}
                      <p className="text-white font-semibold text-xl">{d.title}</p> { /* Titolo */}
                    </div>

                    { /* Foto */}
                    {d.photo.length > 0 && (
                      <div className="flex gap-2 flex-wrap mb-4">
                        {d.photo.slice(0, 2).map((p, i) => ( // mostro solo le prime 2 foto come anteprima
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

                    { /* Bottoni Card */}
                    <div className="flex flex-col gap-2">
                      {/* Mostra il resto delle informazioni della tappa */}
                      <button
                        onClick={() => setSelectedDay(d)}
                        className="px-4 py-2 flex items-center justify-center bg-blue-500 hover:bg-blue-400 text-white rounded-lg shadow-md transition hover:scale-105 cursor-pointer">
                        <i className="fa-solid fa-book-open mr-2"></i> Leggi Tutto
                      </button>

                      { /* Va nella pagina Modifica Tappa */}
                      <Link
                        to={`/days/${d.id}/edit`}
                        className="px-4 py-2 flex items-center justify-center bg-yellow-500 hover:bg-yellow-400 text-white rounded-lg shadow-md transition hover:scale-105 cursor-pointer">
                        <i className="fa-solid fa-edit mr-2"></i>
                        Modifica Tappa
                      </Link>

                      { /* Cancella la Tappa */}
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
              // se non ci sono giorni del viaggio mostra questo messaggio
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
              <button
                onClick={() => setSelectedDay(null)}
                className="px-3 py-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-400 text-white rounded-lg shadow-md transition hover:scale-105 cursor-pointer">
                <i className="fa-solid fa-arrow-left"></i> Chiudi
              </button>

              { /* Titolo */}
              <div className="flex justify-between items-start mb-3 mt-3">
                <h1 className="text-2xl sm:text-2xl font-bold text-white">
                  {selectedDay.title}
                </h1>
              </div>

              { /* Data */}
              <div className="flex justify-between items-start mb-3 mt-3">
                <p className="sm:text-xl text-white">{selectedDay.date}</p>
              </div>

              { /* Descrizione */}
              <p className="text-white text-justify mb-3">{selectedDay.description}</p>

              { /* Foto */}
              {selectedDay.photo.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedDay.photo.map((p, i) => (
                    <img
                      key={i}
                      src={p}
                      alt="foto viaggio"
                      loading="lazy"
                      onClick={() => setOpenImage(p)}
                      className="w-full h-40 sm:h-40 object-cover rounded-lg border-3 border-gray-500 shadow-sm cursor-pointer hover:border-white" />
                  ))}
                </div>
              )}
            </div>

            {/* Colonna destra: mappa */}
            <div className="flex justify-center items-center p-10">

              {/* Mappa in versione compatta */}
              {!isOpen && (
                <WorldMap
                  days={travel.days}
                  selectedDay={selectedDay} // vedo il solo il Pin del giorno selezionato
                  mapRef={mapRef} // passo la ref al MapContainer
                  onExpand={() => setIsOpen(true)}  // mi permette di poter ingrandire la mappa
                />
              )}

              {/* Modale Mappa  */}
              {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[9999]">
                  <div className="relative bg-gray-800 rounded-2xl overflow-hidden shadow-2xl"
                    style={{ width: "90vw", height: "90vh" }}>

                    {/* Bottone chiudi */}
                    <button
                      onClick={() => setIsOpen(false)} // per rimettere la mappa in versione compatta
                      className="absolute top-4 right-4 z-[9999] bg-white px-3 py-1 rounded-md shadow hover:bg-gray-100 transition cursor-pointer">
                      <i className="fa-solid fa-xmark"></i>
                    </button>

                    <WorldMap
                      days={travel.days}
                      selectedDay={selectedDay} // vedo solo il Pin del giorno selezionato
                      mapRef={mapRef} // passo la ref al MapContainer
                      isModal={true} // prendo is Modal dal componente WorldMap
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Modale Foto */}
          {openImage && (
            <div
              className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[10000]"
              onClick={() => setOpenImage(null)}> { /* Per poter ridurre l'immagine */}
              <img
                src={openImage.replace("w=400", "w=1600")} // quando clicco l'immagine si ingrandisce a 1600px
                alt="foto ingrandita"
                loading="lazy"
                className="w-auto h-auto max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg object-contain" />
            </div>
          )}
        </div>
      )}


      {/* Modale di conferma eliminazione giorno */}
      {deleteDayId && ( // se deleteDayId non è null, mostro il modale
        <div className="fixed inset-0 flex items-center justify-center bg-transparent z-[9999]">
          <div className="backdrop-blur-xl p-6 rounded-xl shadow-lg w-80 text-center">
            <h2 className="text-xl font-bold mb-4 text-white">
              Sei sicuro di voler cancellare la tappa?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDeleteDay}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded-lg shadow-md transition hover:scale-105 cursor-pointer">
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
