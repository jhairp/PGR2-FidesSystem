import React, { useEffect, useState } from "react";
import MapExample from "components/Maps/MapExample.js"; 
import { getCapillas } from "api.js";

export default function Maps() {
  const [listaCapillas, setListaCapillas] = useState([]);

  useEffect(() => {
    getCapillas().then(data => setListaCapillas(data));
  }, []);

  return (
  <div className="relative -mt-32 -mx-4 md:-mx-10">
    {/* IMPORTANTE: El nombre de la prop debe ser 'capillas' */}
    <MapExample capillas={listaCapillas} />
  </div>
);
}