import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";

// icona personalizzata (altrimenti Leaflet non mostra bene il marker)
const customIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    shadowSize: [41, 41],
});

function FlyToSelected({ selectedDay }) {
    const map = useMap();

    useEffect(() => {
        if (selectedDay) {
            map.flyTo([selectedDay.lat, selectedDay.lng], 15, { duration: 1.5 });
        }
    }, [selectedDay, map]);

    return null;
}

function WorldMap({ days = [], selectedDay = null }) {
    const [geoData, setGeoData] = useState(null);

    useEffect(() => {
        fetch("/countries.geojson")
            .then((res) => res.json())
            .then((data) => setGeoData(data))
            .catch((err) => console.error("Errore nel caricamento:", err));
    }, []);

    // ordino i giorni
    const sortedDays = useMemo(() => {
        return [...days].sort((a, b) => {
            const [da, ma, ya] = a.date.split("-").map(Number);
            const [db, mb, yb] = b.date.split("-").map(Number);
            return new Date(ya, ma - 1, da) - new Date(yb, mb - 1, db);
        });
    }, [days]);

    // polyline (solo se non è selezionato un giorno specifico)
    const polylineCoords = !selectedDay
        ? sortedDays.map((d) => [d.lat, d.lng])
        : [];

    // centro mappa
    const center = selectedDay
        ? [selectedDay.lat, selectedDay.lng]
        : days.length > 0
            ? [days[0].lat, days[0].lng]
            : [41.8933, 12.4829]; // Roma default

    return (
        <div className="w-full max-w-[300px] h-64 sm:h-80 md:h-96 lg:w-[400px] lg:h-[400px] rounded-xl overflow-hidden shadow-lg">
            <MapContainer
                center={center}
                zoom={selectedDay ? 10 : 5}
                minZoom={2}
                style={{ height: "100%", width: "100%", backgroundColor: "#AAD3DF" }}
                worldCopyJump={false}
                maxBounds={[[-90, -180], [90, 180]]}
                maxBoundsViscosity={1.0}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                    noWrap={true}
                    bounds={[[-90, -180], [90, 180]]}
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

                {/* Se ho un giorno selezionato mostro solo lui, altrimenti tutti */}
                {selectedDay ? (
                    <Marker
                        key={selectedDay.id}
                        position={[Number(selectedDay.lat), Number(selectedDay.lng)]}
                        icon={customIcon}
                    >
                        <Popup>
                            <div style={{ minWidth: "200px" }}>
                                <h3 className="font-bold text-lg">{selectedDay.title}</h3>
                                <p className="text-sm text-gray-600">📅 {selectedDay.date}</p>
                            </div>
                        </Popup>
                    </Marker>
                ) : (
                    sortedDays.map((day) => (
                        <Marker
                            key={day.id}
                            position={[Number(day.lat), Number(day.lng)]}
                            icon={customIcon}
                        >
                            <Popup>
                                <div style={{ minWidth: "200px" }}>
                                    <h3 className="font-bold text-lg">{day.title}</h3>
                                    <p className="text-sm text-gray-600">📅 {day.date}</p>
                                </div>
                            </Popup>
                        </Marker>
                    ))
                )}

                {/* Polyline solo se NON ho un giorno selezionato */}
                {polylineCoords.length > 1 && (
                    <Polyline
                        positions={polylineCoords}
                        pathOptions={{ color: "red", weight: 3 }}
                    />
                )}

                {/* 👇 qui aggancio l’effetto zoom sul selectedDay */}
                {selectedDay && <FlyToSelected selectedDay={selectedDay} />}
            </MapContainer>
        </div>
    );
}


export default WorldMap;
