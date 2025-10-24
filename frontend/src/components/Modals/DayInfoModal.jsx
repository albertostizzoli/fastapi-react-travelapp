import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import WorldMap from "../WorldMap";

function DayInfoModal({ selectedDay, onClose, travelDays }) {
  const [openImage, setOpenImage] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // stato per animazione uscita
  const mapRef = useRef(null);

  // Mostra il modale solo quando selectedDay è settato
  useEffect(() => {
    if (selectedDay) setIsVisible(true);
  }, [selectedDay]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // 300ms = durata exit animation
  };

  if (!selectedDay) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/50 p-2 sm:p-4 z-[9999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl w-full max-w-full sm:max-w-5xl h-[90vh] shadow-lg flex flex-col overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-white/20">
              <button
                onClick={handleClose}
                className="font-semibold px-3 py-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-rose-400 hover:from-red-400 hover:to-rose-300 text-white rounded-full shadow-md transition hover:scale-105 cursor-pointer"
              >
                <i className="fa-solid fa-arrow-left"></i> Torna alle Tappe
              </button>

              <button
                onClick={() => setShowMapModal(true)}
                className="font-semibold px-3 py-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 text-white rounded-full shadow-md transition hover:scale-105 cursor-pointer"
              >
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
                        className="font-semibold bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 text-white px-3 py-2 rounded-full text-sm shadow-md mt-2"
                      >
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
                  animate="visible"
                >
                  {selectedDay.photo.map((p, i) => (
                    <motion.img
                      key={i}
                      src={p}
                      alt="foto viaggio"
                      loading="lazy"
                      onClick={() => setOpenImage(p)}
                      className="w-full h-40 sm:h-40 object-cover rounded-3xl border border-white/20 shadow-sm cursor-pointer hover:border-white"
                      variants={{
                        hidden: { scale: 0, opacity: 0 },
                        visible: { scale: 1, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Modale immagine ingrandita */}
          <AnimatePresence>
            {openImage && (
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[10000]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpenImage(null)}
              >
                <motion.div
                  onClick={(e) => e.stopPropagation()}
                  className="relative"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <button
                    onClick={() => setOpenImage(null)}
                    className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full p-2 shadow-lg cursor-pointer"
                  >
                    <i className="fa-solid fa-xmark text-lg"></i>
                  </button>
                  <img
                    src={openImage.replace("w=400", "w=1600")}
                    alt="foto ingrandita"
                    loading="lazy"
                    className="w-auto h-full max-h-[90vh] max-w-[90vw] rounded-3xl shadow-lg object-contain"
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Modale Mappa */}
          <AnimatePresence>
            {showMapModal && (
              <motion.div
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-[10001]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="relative sm:w-[70vw] sm:h-[90vh] backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl overflow-hidden shadow-2xl"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div onClick={(e) => e.stopPropagation()} className="relative">
                    <button
                      onClick={() => setShowMapModal(false)}
                      className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-3 shadow-lg cursor-pointer z-[1000] hover:bg-red-400 transition"
                    >
                      <i className="fa-solid fa-xmark text-lg"></i>
                    </button>
                  </div>
                  <WorldMap
                    days={travelDays}
                    selectedDay={selectedDay}
                    mapRef={mapRef}
                    isModal={true}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default DayInfoModal;
