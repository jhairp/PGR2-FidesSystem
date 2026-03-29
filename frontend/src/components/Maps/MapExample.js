import React from "react";

// IMPORTANTE: { capillas } desestructurado para recibir la lista
function MapExample({ capillas }) {
  const mapRef = React.useRef(null);

  React.useEffect(() => {
    // Si no hay objeto google en el window, salimos para evitar crash
    if (!window.google) return;

    let google = window.google;
    let mapElement = mapRef.current;
    
    // Coordenadas iniciales (La Paz, Bolivia como ejemplo por tu contexto)
    let centerLat = -16.4897;
    let centerLng = -68.1193;
    
    const myLatlng = new google.maps.LatLng(centerLat, centerLng);
    
    const mapOptions = {
      zoom: 13,
      center: myLatlng,
      scrollwheel: false,
      zoomControl: true,
      styles: [
        { featureType: "water", elementType: "all", stylers: [{ color: "#4299e1" }] },
        { featureType: "landscape", elementType: "all", stylers: [{ color: "#f2f2f2" }] }
      ],
    };

    // Crear el mapa
    const map = new google.maps.Map(mapElement, mapOptions);

    // VALIDACIÓN CRÍTICA: Solo recorremos si 'capillas' es un Array
    if (capillas && Array.isArray(capillas)) {
      capillas.forEach((capilla) => {
        // Validamos que la capilla tenga coordenadas válidas
        if (capilla.lat && capilla.lng) {
          const marker = new google.maps.Marker({
            position: { lat: parseFloat(capilla.lat), lng: parseFloat(capilla.lng) },
            map: map,
            animation: google.maps.Animation.DROP,
            title: capilla.nombre,
          });

          const infowindow = new google.maps.InfoWindow({
            content: `<div style="color:black;"><strong>${capilla.nombre}</strong><br/>${capilla.direccion || "Capilla Parroquial"}</div>`,
          });

          marker.addListener("click", () => {
            infowindow.open(map, marker);
          });
        }
      });
    } else {
      console.warn("MapExample: El prop 'capillas' no es un array válido o está vacío.", capillas);
    }
  }, [capillas]); // Se vuelve a ejecutar cuando los datos llegan

  return (
    <div className="relative w-full rounded h-600-px shadow-lg">
      <div className="rounded h-full" ref={mapRef} />
    </div>
  );
}

export default MapExample;