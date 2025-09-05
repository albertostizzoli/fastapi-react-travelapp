import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { motion } from "framer-motion";


function WorldMap() {
    const [geoData, setGeoData] = useState(null);

    useEffect(() => {
        fetch("/countries.geojson")
            .then((res) => res.json())
            .then((data) => setGeoData(data))
            .catch((err) => console.error("Errore nel caricamento:", err));
    }, []);

    // Animazione
    const worldMap = {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 1.5, ease: "easeInOut" } },
        exit: { opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } },
    };

    return (
        <motion.div className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg" variants={worldMap} initial="initial" animate="animate" exit="exit">
            <MapContainer
                center={[20, 0]}
                zoom={2}
                minZoom={2}
                style={{ height: "100%", width: "100%", backgroundColor: "#AAD3DF" }}
                worldCopyJump={false}  //  evita che la mappa si ripeta
                maxBounds={[[-90, -180], [90, 180]]} //  blocca ai limiti del globo
                maxBoundsViscosity={1.0}             //  rende i bordi "rigidi"
                >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                    noWrap={true}   //  disattiva il wrapping
                    bounds={[[-90, -180], [90, 180]]} />

                {geoData && (
                    <GeoJSON
                        data={geoData}
                        style={() => ({
                            fillColor: "white",
                            fillOpacity: 0,
                            color: "grey",
                            weight: 1,
                        })}
                    />
                )}
            </MapContainer>
        </motion.div>
    );
}

export default WorldMap;
