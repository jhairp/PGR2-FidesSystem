import React from "react";
import { Link } from "react-router-dom";
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
      fullscreenControl: false, 
    };

    const map = new google.maps.Map(mapElement, mapOptions);

    if (capillas && Array.isArray(capillas)) {
      const bounds = new google.maps.LatLngBounds();
      let hasMarkers = false;

      capillas.forEach((capilla) => {
        // CORRECCIÓN: Separar el string "lat, lng" de la base de datos
        if (capilla.coordenadas_cen && capilla.coordenadas_cen.includes(',')) {
          const [latStr, lngStr] = capilla.coordenadas_cen.split(",");
          const position = { 
            lat: parseFloat(latStr.trim()), 
            lng: parseFloat(lngStr.trim()) 
          };

          if (!isNaN(position.lat) && !isNaN(position.lng)) {
            const imageIcon = {
              url: miIconoIglesia,
              scaledSize: new google.maps.Size(45, 45),
              anchor: new google.maps.Point(22, 45) 
            };

            const marker = new google.maps.Marker({
              position: position,
              map: map,
              icon: imageIcon,
              title: capilla.nom_cen, // Usando nombre real del modelo
              animation: google.maps.Animation.DROP,
            });

            const infowindow = new google.maps.InfoWindow({
              content: `
                <div style="padding:10px; line-height:1.4; color:black;">
                  <strong style="font-size:14px;">${capilla.nom_cen}</strong><br/>
                  <span style="font-size:12px; color:#666;">${capilla.calle_cen || "Capilla Parroquial"}</span>
                </div>`,
            });

            marker.addListener("click", () => {
              infowindow.open(map, marker);
            });

            bounds.extend(position);
            hasMarkers = true;
          }
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
      style={{ height: "calc(100vh - 0px)" }} 
    >
      <div className="h-full w-full" ref={mapRef} />

      {/* Botón flotante superior derecho */}
      <div className="absolute top-4 right-4 z-50"> 
        <Link
          to="/admin/centros" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg flex items-center transition-all duration-200"
          style={{ 
              zIndex: 9999, 
              backgroundColor: '#0284c7', 
              textDecoration: 'none' 
          }}
        >
          <i className="lni lni-list mr-2"></i>
          VER LISTA
        </Link>
      </div>
    </div>
  );
}

export default MapExample;