import React from "react";
// Importación de tu icono local
import miIconoIglesia from "../../assets/img/iglesiaicono.png"; 

function MapExample({ capillas }) {
  const mapRef = React.useRef(null);

  React.useEffect(() => {
    if (!window.google) return;

    const google = window.google;
    const mapElement = mapRef.current;
    
    const modernStyle = [
      { "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }] },
      { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
      { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }] },
      { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#c9c9c9" }] }
    ];

    const mapOptions = {
      zoom: 13,
      center: { lat: -16.4897, lng: -68.1193 },
      scrollwheel: true,
      zoomControl: true,
      styles: modernStyle,
      mapTypeControl: false,
      streetViewControl: true,
      fullscreenControl: false, // Lo desactivamos porque ya estamos en pantalla completa
    };

    const map = new google.maps.Map(mapElement, mapOptions);

    if (capillas && Array.isArray(capillas)) {
      const bounds = new google.maps.LatLngBounds();
      let hasMarkers = false;

      capillas.forEach((capilla) => {
        if (capilla.lat && capilla.lng) {
          const position = { lat: parseFloat(capilla.lat), lng: parseFloat(capilla.lng) };

          const imageIcon = {
            url: miIconoIglesia,
            scaledSize: new google.maps.Size(45, 45),
            anchor: new google.maps.Point(22, 45) 
          };

          const marker = new google.maps.Marker({
            position: position,
            map: map,
            icon: imageIcon,
            title: capilla.nombre,
            animation: google.maps.Animation.DROP,
          });

          const infowindow = new google.maps.InfoWindow({
            content: `
              <div style="padding:10px; line-height:1.4; color:black;">
                <strong style="font-size:14px;">${capilla.nombre}</strong><br/>
                <span style="font-size:12px; color:#666;">${capilla.direccion || "Capilla Parroquial"}</span>
              </div>`,
          });

          marker.addListener("click", () => {
            infowindow.open(map, marker);
          });

          bounds.extend(position);
          hasMarkers = true;
        }
      });

      if (hasMarkers) {
        map.fitBounds(bounds);
      }
    }
  }, [capillas]);

 return (
    <div 
      className="w-full relative shadow-inner" 
      /* 100vh = Toda la altura de la ventana.
         Le restamos un poco si quieres que se vea algo del fondo, 
         o déjalo en 100vh para inmersión total.
      */
      style={{ height: "calc(100vh - 0px)" }} 
    >
      <div className="h-full w-full" ref={mapRef} />
      
      {/* Etiqueta flotante para que no se vea tan vacío */}
      <div className="absolute top-20 left-6 z-10 bg-white px-4 py-2 shadow-xl rounded-lg border border-gray-200">
        <h3 className="font-bold text-blueGray-700">Capillas Parroquiales</h3>
        <p className="text-xs text-blueGray-500">{capillas.length} ubicaciones activas</p>
      </div>
    </div>
  );

}

export default MapExample;