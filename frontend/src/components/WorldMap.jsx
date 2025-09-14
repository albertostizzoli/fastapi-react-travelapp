import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, Polyline } from "react-leaflet";
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

function WorldMap({ days = [] }) {
    const [geoData, setGeoData] = useState(null);

    useEffect(() => {
        fetch("/countries.geojson")
            .then((res) => res.json())
            .then((data) => setGeoData(data))
            .catch((err) => console.error("Errore nel caricamento:", err));
    }, []);

    // ordino i giorni per data (gg-mm-aaaa -> aaaa-mm-gg per ordinamento)
    const sortedDays = useMemo(() => {
        return [...days].sort((a, b) => {
            const [da, ma, ya] = a.date.split("-").map(Number);
            const [db, mb, yb] = b.date.split("-").map(Number);
            return new Date(ya, ma - 1, da) - new Date(yb, mb - 1, db);
        });
    }, [days]);

    // creo le coordinate per la polyline
    const polylineCoords = sortedDays.map((d) => [d.lat, d.lng]);

    // centro iniziale (se ci sono giorni prendi il primo, altrimenti Roma)
    const center = days.length > 0
        ? [days[0].lat, days[0].lng]
        : [41.8933, 12.4829];

    return (
        <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg">
            <MapContainer
                center={center}
                zoom={5}
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

                {/* Marker */}
                {sortedDays.map((day) => (
                    <Marker
                        key={day.id}
                        position={[Number(day.lat), Number(day.lng)]}
                        icon={customIcon}
                    >
                        <Popup>
                            📍 {day.title} <br />
                            {day.date}
                        </Popup>
                    </Marker>
                ))}

                {/* Polyline per unire i punti */}
                {polylineCoords.length > 1 && (
                    <Polyline
                        positions={polylineCoords}
                        pathOptions={{ color: "red", weight: 3 }}
                    />
                )}
            </MapContainer>
        </div>
    );
}


export default WorldMap;
