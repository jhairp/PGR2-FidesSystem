import React, { useEffect, useState } from "react";
import MapExample from "components/Maps/MapExample.js"; // El que ya trae la plantilla
import { getCapillas } from "api.js";

export default function Maps() {
  const [listaCapillas, setListaCapillas] = useState([]);

  useEffect(() => {
    // Pedimos las capillas a Django mediante el API REST
    getCapillas().then(data => setListaCapillas(data));
  }, []);

  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full px-4">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            {/* Título elegante */}
            <div className="rounded-t mb-0 px-4 py-3 border-0 bg-lightBlue-600 text-white">
              <h3 className="font-semibold text-lg">Mapa de Capillas Parroquiales</h3>
            </div>
            
            {/* El Mapa pasándole los datos de Django */}
            <div className="relative w-full rounded h-600-px overflow-hidden">
              <MapExample capillas={listaCapillas} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}