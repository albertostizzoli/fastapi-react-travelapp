import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

const customIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png", //  icona standard di Leaflet
    iconSize: [25, 41], //  dimensioni dell'icona
    iconAnchor: [12, 41], //  punto dell'icona che corrisponde alla posizione del marker
    popupAnchor: [1, -34], //  punto da cui parte il popup rispetto all'icona
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png", //  ombra dell'icona
    shadowSize: [41, 41], //  dimensioni dell'ombra
});

//  Effettua lo zoom sul giorno selezionato
function FlyToSelected({ selectedDay, lastFlyRef }) {
    const map = useMap(); //  ottiene l'istanza della mappa

    useEffect(() => {
        if (!selectedDay) return;

        if (lastFlyRef.current === selectedDay.id) return;

        const lat = Number(selectedDay.lat);
        const lng = Number(selectedDay.lng);

        //  Zoom più alto su mobile
        const zoomLevel = window.innerWidth <= 576 ? 16 : 16;

        map.setView([lat, lng], zoomLevel);
        lastFlyRef.current = selectedDay.id;

        setTimeout(() => {
            map.invalidateSize();
            map.flyTo([lat, lng], zoomLevel, { animate: true, duration: 1.5 });
        }, 400);
    }, [selectedDay, map, lastFlyRef]);


    return null;
}


//  Componente principale mappa
function WorldMap({ days = [], selectedDay = null, mapRef, isModal = false }) {
    const [geoData, setGeoData] = useState(null); //  dati GeoJSON per i confini dei paesi
    const lastFlyRef = useRef(null); //  per evitare doppi flyTo

    useEffect(() => { //  carica i dati GeoJSON
        fetch("/countries.geojson")
            .then((res) => res.json())
            .then((data) => setGeoData(data)) //  imposta i dati GeoJSON
            .catch((err) => console.error("Errore nel caricamento:", err));
    }, []);

    const sortedDays = days || []; //  assicura che days sia un array


    //  centro della mappa
    const center = selectedDay
        ? [selectedDay.lat, selectedDay.lng] //  centro sul giorno selezionato
        : days.length > 0
            ? [days[0].lat, days[0].lng]
            : [41.8933, 12.4829]; // Roma default

    return (
        <div
            className={`rounded-xl overflow-hidden shadow-lg ${isModal
                ? "w-[95vw] sm:w-[1600px] h-[80vh] sm:h-screen" //  responsive modale
                : "w-full max-w-[300px] h-64 sm:h-80 md:h-96 lg:w-[400px] lg:h-[500px]"
                }`}
        >
            {/* Mappa Leaflet */}
            <MapContainer
                whenCreated={(mapInstance) => {
                    if (mapRef) mapRef.current = mapInstance; //  passa l'istanza della mappa al genitore
                }}
                center={center} //  centro della mappa
                zoom={selectedDay ? 10 : 5} //  zoom iniziale
                minZoom={2} //  zoom minimo
                style={{ height: "100%", width: "100%", backgroundColor: "#AAD3DF" }} //  stile della mappa
                worldCopyJump={false} //  disabilita il salto della mappa
                maxBounds={[[-90, -180], [90, 180]]} //  limiti della mappa
                maxBoundsViscosity={1.0} //  impedisce di uscire dai limiti
            >

                {/* TileLayer di OpenStreetMap */}
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" //  URL dei tile
                    attribution="&copy; OpenStreetMap contributors" //  attribuzione
                    noWrap={true} //  disabilita il wrapping orizzontale
                    bounds={[[-90, -180], [90, 180]]} //  limiti dei tile
                />

                {/* GeoJSON per i confini dei paesi */}
                {geoData && (
                    <GeoJSON
                        data={geoData} //  dati GeoJSON
                        style={() => ({
                            fillColor: "white",
                            fillOpacity: 0,
                            color: "grey",
                            weight: 1,
                        })}
                    />
                )}

                {/* Marker per i giorni */}
                {selectedDay ? (
                    <Marker
                        key={selectedDay.id} //  chiave unica per il marker
                        position={[Number(selectedDay.lat), Number(selectedDay.lng)]} //  posizione del marker
                        icon={customIcon} //  icona personalizzata
                    >
                        {/* Popup con informazioni sul giorno selezionato */}
                        <Popup>
                            <div style={{ minWidth: "200px" }}>
                                <h3 className="font-bold text-lg">{selectedDay.title}</h3>
                                <p className="text-sm text-gray-600">📅 {selectedDay.date}</p>
                            </div>
                        </Popup>
                    </Marker>
                ) : (
                    //  Marker per tutti i giorni
                    sortedDays.map((day) => (
                        <Marker
                            key={day.id} //  chiave unica per il marker
                            position={[Number(day.lat), Number(day.lng)]} //  posizione del marker
                            icon={customIcon} //
                        >
                            {/* Popup con informazioni sul giorno */}
                            <Popup>
                                <div style={{ minWidth: "200px" }}>
                                    <h3 className="font-bold text-lg">{day.title}</h3>
                                    <p className="text-sm text-gray-600">📅 {day.date}</p>
                                </div>
                            </Popup>
                        </Marker>
                    ))
                )}

                {/* Componente per effettuare lo zoom sul giorno selezionato */}
                {selectedDay && <FlyToSelected selectedDay={selectedDay} lastFlyRef={lastFlyRef} />}
            </MapContainer>
        </div>
    );
}

export default React.memo(WorldMap);
