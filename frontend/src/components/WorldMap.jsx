import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";


function WorldMap() {
    const [geoData, setGeoData] = useState(null);

    useEffect(() => {
        fetch("/countries.geojson")
            .then((res) => res.json())
            .then((data) => setGeoData(data))
            .catch((err) => console.error("Errore nel caricamento:", err));
    }, []);

    return (
        <div className="w-full h-[600px] rounded-xl overflow-hidden shadow-lg">
            <MapContainer
                center={[20, 0]}
                zoom={2}
                minZoom={2}
                style={{ height: "100%", width: "100%", backgroundColor: "#AAD3DF" }}
                worldCopyJump={false}  //  evita che la mappa si ripeta
                maxBounds={[[-90, -180], [90, 180]]} //  blocca ai limiti del globo
                maxBoundsViscosity={1.0}              //  rende i bordi "rigidi"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                    noWrap={true}   //  disattiva il wrapping
                    bounds={[[-90, -180], [90, 180]]} //  limiti precisi
                />

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
        </div>
    );
}

export default WorldMap;
