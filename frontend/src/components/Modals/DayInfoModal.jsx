import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaMapMarkerAlt, FaTimes } from "react-icons/fa";
import WorldMap from "../WorldMap";

function DayInfoModal({ selectedDay, onClose, travelDays }) {
  const [openImage, setOpenImage] = useState(null); // stato per Modale Immagine
  const [showMapModal, setShowMapModal] = useState(false); // stato per modale Mappa 
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
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key="dayInfoModal"
          className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4 z-9999"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{ willChange: "opacity" }}>

          <motion.div
            className="backdrop-blur-2xl bg-linear-to-br from-blue-600/40 to-orange-600/40 dark:from-slate-900 dark:to-slate-500
            border border-white/40 
            rounded-3xl w-full max-w-full sm:max-w-5xl h-[90vh] shadow-2xl flex flex-col overflow-hidden relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
            style={{ willChange: "transform, opacity" }}>

            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-white/40 bg-black/10 backdrop-blur-lg">
              <button
                onClick={handleClose}
                className="font-semibold flex items-center justify-center gap-2 px-4 py-2  bg-linear-to-br 
                from-red-600 to-rose-500 dark:from-red-600/70 dark:to-rose-500/70 
                backdrop-blur-md border border-white/40 text-white 
                rounded-full shadow-md transition-all duration-300 ease-in-out cursor-pointer hover:scale-105 
                hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]">
                 <FaArrowLeft size={20} className="mr-2" /> Tappe
              </button>

              <button
                onClick={() => setShowMapModal(true)}
                className="font-semibold flex items-center justify-center gap-2 px-4 py-2 bg-linear-to-br 
                from-blue-600 to-cyan-500 dark:form-blue-600/70 dark:to-cyan-500/70 
                backdrop-blur-md border border-white/40 text-white 
                rounded-full shadow-md transition-all duration-300 ease-in-out cursor-pointer hover:scale-105 
                hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]">
                 <FaMapMarkerAlt size={20} className="mr-2" /> Mappa
              </button>
            </div>

            {/* Contenuto scrollabile */}
            <div className="flex-1 p-6 sm:p-6 overflow-y-auto scrollbar max-h-full text-white">
              <h1 className="text-3xl font-extrabold text-white mb-2 drop-shadow-lg">
               {selectedDay.title}
              </h1>
              <p className="text-2xl font-bold text-cyan-200/80 mb-4">{selectedDay.date}</p>
              <p className="text-white text-justify font-bold leading-relaxed mb-6">{selectedDay.description}</p>

              {/* Esperienze */}
              {selectedDay.experiences?.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2">
                  {selectedDay.experiences.map((experience, i) => (
                    <span
                      key={i}
                      className="font-semibold px-4 py-2 bg-linear-to-br from-blue-600 to-red-500
                        dark:from-blue-600/70 dark:to-red-500/70 backdrop-blur-md border border-white/40 
                        text-white rounded-full transition-all duration-300 
                        ease-in-out hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]">
                      {experience}
                    </span>
                  ))}
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
                      className="w-full h-40 sm:h-40 object-cover rounded-3xl border-3 border-white/40 shadow-sm cursor-pointer
                       hover:border-white"
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
          <AnimatePresence mode="wait">
            {openImage && (
              <motion.div
                key="modalPhoto"
                className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-10000"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{ willChange: "opacity" }}
                onClick={() => setOpenImage(null)}>

                <motion.div
                  onClick={(e) => e.stopPropagation()}
                  className="relative"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  style={{ willChange: "opacity" }}>
                  <button
                    onClick={() => setOpenImage(null)}
                    className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full p-2 shadow-lg cursor-pointer">
                     <FaTimes size={20} className="text-lg" />
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
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-10001"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}>

                <motion.div
                  className="relative sm:w-[70vw] sm:h-[90vh] backdrop-blur-xl bg-white/10 border border-white/40 rounded-3xl 
                  overflow-hidden shadow-2xl"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}>

                  <div onClick={(e) => e.stopPropagation()} className="relative">
                    <button
                      onClick={() => setShowMapModal(false)}
                      className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-3 shadow-lg cursor-pointer z-1000
                       hover:bg-red-400 transition">
                       <FaTimes size={20} className="text-lg" />
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
