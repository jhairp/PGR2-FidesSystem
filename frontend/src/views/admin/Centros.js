import React, { useEffect, useState } from "react";
import CentrosList from "components/centros/CentrosList.jsx";
import { getCentros, getParroquias } from "api.js"; 

export default function CentrosView() {
  const [centros, setCentros] = useState([]);
  const [parroquias, setParroquias] = useState([]);

  useEffect(() => {
    // Aquí llamas a tus funciones de api.js
    getCentros().then(res => setCentros(res.data || res));
    getParroquias().then(res => setParroquias(res.data || res));
  }, []);

  return (
    <div className="flex flex-wrap mt-4">
      <div className="w-full mb-12 px-4">
        <CentrosList centrosData={centros} parroquias={parroquias} />
      </div>
    </div>
  );
}