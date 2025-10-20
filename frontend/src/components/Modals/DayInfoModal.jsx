import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import WorldMap from "../WorldMap";

// Questo è il modale per leggere le informazioni delle tappe
function DayInfoModal({ selectedDay, onClose, travelDays }) {
  const [openImage, setOpenImage] = useState(null); // stato per l'immagine ingrandita (Apri / Chiudi)
  const [showMapModal, setShowMapModal] = useState(false); // stato per mostrare il modale della mappa ingrandita 
  const mapRef = useRef(null); // per ridisegnare la mappa quando è ingrandita

  if (!selectedDay) return null;

  return (
    <AnimatePresence>
      {selectedDay && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/50 p-2 sm:p-4 z-[9999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}>
          <motion.div
            className="bg-gray-800 rounded-3xl w-full max-w-full sm:max-w-5xl h-[90vh] shadow-lg flex flex-col overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}>
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <button
                onClick={onClose}
                className="font-semibold px-3 py-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-400 text-white rounded-full shadow-md transition hover:scale-105 cursor-pointer">
                <i className="fa-solid fa-arrow-left"></i> Torna alle Tappe
              </button>

              <button
                onClick={() => setShowMapModal(true)}
                className="font-semibold px-3 py-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white rounded-full shadow-md transition hover:scale-105 cursor-pointer">
                <i className="fa-solid fa-map-location-dot"></i> Vai alla Mappa
              </button>
            </div>

            {/* Contenuto scrollabile */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto scrollbar-custom max-h-full">
              <h1 className="text-2xl sm:text-2xl font-bold text-white mb-3">
                {selectedDay.title}
              </h1>

              <p className="sm:text-xl text-white mb-3">{selectedDay.date}</p>

              <p className="text-white text-justify mb-3">{selectedDay.description}</p>

              {/* Tags */}
              {selectedDay.tags?.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {selectedDay.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="font-semibold bg-blue-500 hover:bg-blue-400 text-white px-3 py-2 rounded-full text-sm shadow-md mt-2">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Foto */}
              {selectedDay.photo?.length > 0 && (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                  variants={{
                    hidden: { opacity: 1 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.5 } },
                  }}
                  initial="hidden"
                  animate="visible">

                  {selectedDay.photo.map((p, i) => (
                    <motion.img
                      key={i}
                      src={p}
                      alt="foto viaggio"
                      loading="lazy"
                      onClick={() => setOpenImage(p)}
                      className="w-full h-40 sm:h-40 object-cover rounded-3xl border border-gray-500 shadow-sm cursor-pointer hover:border-white"
                      variants={{
                        hidden: { scale: 0, opacity: 0 },
                        visible: {
                          scale: 1,
                          opacity: 1,
                          transition: { duration: 0.8, ease: "easeOut" },
                        },
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Modale immagine ingrandita */}
          {openImage && (
            <div
              className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[10000]"
              onClick={() => setOpenImage(null)}>
              <div onClick={(e) => e.stopPropagation()} className="relative">
                <button
                  onClick={() => setOpenImage(null)}
                  className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full p-2 shadow-lg cursor-pointer">
                  <i className="fa-solid fa-xmark text-lg"></i>
                </button>
                <motion.img
                  src={openImage.replace("w=400", "w=1600")}
                  alt="foto ingrandita"
                  loading="lazy"
                  className="w-auto h-full max-h-[90vh] max-w-[90vw] rounded-3xl shadow-lg object-contain"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          )}

          {/* Modale Mappa */}
          {showMapModal && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[10001]">
              <div className="relative sm:w-[70vw] sm:h-[90vh] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl">
                <div onClick={(e) => e.stopPropagation()} className="relative">
                  <button
                    onClick={() => setShowMapModal(false)}
                    className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-3 shadow-lg cursor-pointer z-[1000] hover:bg-red-400 transition">
                    <i className="fa-solid fa-xmark text-lg"></i>
                  </button>
                </div>
                <WorldMap
                  days={travelDays}
                  selectedDay={selectedDay}
                  mapRef={mapRef}
                  isModal={true}
                />
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default DayInfoModal;
