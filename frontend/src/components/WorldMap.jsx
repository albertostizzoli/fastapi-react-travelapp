import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";

// configuro l'icona personalizzata per i marker
const customIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],        // dimensione dell'icona
    iconAnchor: [12, 41],      // punto dell'icona che corrisponde alla posizione geografica
    popupAnchor: [1, -34],     // posizione del popup relativo all'icona
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    shadowSize: [41, 41],      // dimensione dell'ombra
});

// funzione per effettuare lo zoom nella mappa
function FlyToSelected({ selectedDay, lastFlyRef }) {
    const map = useMap(); // hook per ottenere l'istanza della mappa

    useEffect(() => {
        if (!selectedDay) return; // se non c'è un giorno selezionato, non fare nulla

        // protezione: non ripetere lo zoom se già fatto per questo giorno
        if (lastFlyRef.current === selectedDay.id) return;

        // centra subito la mappa senza animazione
        map.setView([Number(selectedDay.lat), Number(selectedDay.lng)], 15);
        lastFlyRef.current = selectedDay.id; // aggiorna il riferimento all'ultimo zoom
    }, [selectedDay, map, lastFlyRef]);

    return null; // componente non renderizza nulla sulla mappa
}

// funzione che crea un pulsante per ingrandire la mappa
function ExpandControl({ onExpand }) {
    // ottengo l'istanza della mappa Leaflet tramite l'hook di react-leaflet
    const map = useMap();

    useEffect(() => {
        // il pulsante è posizionato in alto a destra della mappa
        const customControl = L.control({ position: "topright" });

        // metodo onAdd richiesto da Leaflet: definisce l'elemento DOM del controllo
        customControl.onAdd = () => {
            // creo un div HTML con le classi standard di Leaflet per i controlli
            const div = L.DomUtil.create("div", "leaflet-bar leaflet-control");

            // stile CSS del pulsante
            div.style.background = "white";        
            div.style.cursor = "pointer";               
            div.style.width = "34px";                   
            div.style.height = "34px";                  
            div.style.display = "flex";                 
            div.style.alignItems = "center";            
            div.style.justifyContent = "center";        
            div.title = "Ingrandisci mappa";            

            // chiamo la funzione onExpand passata come prop al click
            div.onclick = () => onExpand();

            // inserisco un'icona all'interno del pulsante
            div.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i>`;

            // ritorna l'elemento DOM da aggiungere alla mappa
            return div;
        };

        // aggiunge il controllo personalizzato alla mappa
        customControl.addTo(map);

        // cleanup: rimuove il controllo quando il componente viene smontato o aggiorna la dipendenza
        return () => {
            customControl.remove();
        };
    }, [map, onExpand]); // l'effetto viene rieseguito solo se cambiano `map` o `onExpand`

    // questo componente React non renderizza nulla in JSX, tutto è gestito da Leaflet
    return null;
}


// componente principale della mappa 
function WorldMap({ days = [], selectedDay = null, mapRef, isModal = false, onExpand }) {
    const [geoData, setGeoData] = useState(null); // stato per i dati GeoJSON dei paesi
    const lastFlyRef = useRef(null); // mantiene l'ultimo id su cui viene effetuato lo zoom

    // caricamento dei dati GeoJSON dei paesi una sola volta
    useEffect(() => {
        fetch("/countries.geojson")
            .then((res) => res.json())
            .then((data) => setGeoData(data))
            .catch((err) => console.error("Errore nel caricamento:", err));
    }, []);


    // coordianti per disegnare la polyline (solo se non c'è un giorno selezionato)
    const polylineCoords = !selectedDay ? sortedDays.map((d) => [d.lat, d.lng]) : [];

    // centro della mappa: giorno selezionato, primo giorno, o Roma di default
    const center = selectedDay
        ? [selectedDay.lat, selectedDay.lng]
        : days.length > 0
            ? [days[0].lat, days[0].lng]
            : [41.8933, 12.4829]; // Roma di default

    return (
        <div
            className={`rounded-xl overflow-hidden shadow-lg ${isModal
                ? "w-[1600px] h-screen" // dimensioni in modal
                : "w-full max-w-[300px] h-64 sm:h-80 md:h-96 lg:w-[400px] lg:h-[500px]" // compatto
                }`} >

            {/* Componente principale della mappa di react-leaflet */}
            <MapContainer
                whenCreated={(mapInstance) => {
                    if (mapRef) {
                        mapRef.current = mapInstance; // assegna l'istanza Leaflet
                    }
                }}
                center={center} // Coordinate iniziali del centro della mappa
                zoom={selectedDay ? 10 : 5} // Zoom dinamico: più vicino se è selezionato un giorno
                minZoom={2} // Zoom minimo consentito
                style={{ height: "100%", width: "100%", backgroundColor: "#AAD3DF" }} // Stile inline della mappa
                worldCopyJump={false} // Disabilita il salto della mappa quando si raggiungono i bordi
                maxBounds={[[-90, -180], [90, 180]]} // Limiti massimi di navigazione sulla mappa
                maxBoundsViscosity={1.0} // Impedisce completamente lo spostamento oltre i limiti
            >
                {!isModal && <ExpandControl onExpand={onExpand} />}


                {/* Layer base della mappa utilizzando OpenStreetMap */}
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // URL dei tiles
                    attribution="&copy; OpenStreetMap contributors" // Crediti per la mappa
                    noWrap={true} // Disabilita la ripetizione orizzontale dei tiles
                    bounds={[[-90, -180], [90, 180]]} // Limiti della TileLayer
                />

                {/* Disegno dei confini dei paesi usando GeoJSON */}
                {geoData && (
                    <GeoJSON
                        data={geoData} // Dati GeoJSON dei confini
                        style={() => ({
                            fillColor: "white", // Colore interno
                            fillOpacity: 0,     // Trasparenza interna
                            color: "grey",      // Colore dei confini
                            weight: 1,          // Spessore dei confini
                        })}
                    />
                )}

                {/* Marker del giorno selezionato o di tutti i giorni */}
                {selectedDay ? (
                    // Se un giorno è selezionato, mostra solo il marker relativo
                    <Marker
                        key={selectedDay.id} // Chiave unica per React
                        position={[Number(selectedDay.lat), Number(selectedDay.lng)]} // Coordinate del marker
                        icon={customIcon} // Icona personalizzata
                    >
                        {/* Popup mostrato al click sul marker */}
                        <Popup>
                            <div style={{ minWidth: "200px" }}>
                                <h3 className="font-bold text-lg">{selectedDay.title}</h3>
                                <p className="text-sm text-gray-600">📅 {selectedDay.date}</p>
                            </div>
                        </Popup>
                    </Marker>
                ) : (
                    // Altrimenti mostra i marker per tutti i giorni
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

                {/* Polyline che collega tutti i giorni (se ci sono almeno 2 coordinate) */}
                {polylineCoords.length > 1 && (
                    <Polyline
                        positions={polylineCoords} // Array di coordinate
                        pathOptions={{ color: "red", weight: 3 }} // Stile della linea
                    />
                )}

                {/* Componente che esegue il flyTo sul giorno selezionato */}
                {selectedDay && <FlyToSelected selectedDay={selectedDay} lastFlyRef={lastFlyRef} />}
            </MapContainer>
        </div>
    );

}

// memo export per evitare remount inutili quando TravelDays re-renderizza
export default React.memo(WorldMap);
