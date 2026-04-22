import React, { useEffect, useState } from "react";

export default function Bautizos() {
  const [bautizos, setBautizos] = useState([]);

  useEffect(() => {
    // Llamada al backend de Django
    fetch("http://localhost:8000/api/lista-bautizos/") // Ajusta a tu URL real
      .then((response) => response.json())
      .then((data) => setBautizos(data))
      .catch((error) => console.error("Error cargando bautizos:", error));
  }, []);

  return (
    <div className="flex flex-wrap mt-4">
      <div className="w-full mb-12 px-4">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
          <div className="rounded-t mb-0 px-4 py-3 border-0">
            <h3 className="font-semibold text-lg text-blueGray-700">Registro de Bautizos</h3>
          </div>
          <div className="block w-full overflow-x-auto">
            <table className="items-center w-full bg-transparent border-collapse">
              <thead>
                <tr>
                  <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500">
                    Nombre del Bautizado
                  </th>
                  <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500">
                    Padres
                  </th>
                  <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500">
                    Fecha
                  </th>
                  <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500">
                    Parroquia
                  </th>
                </tr>
              </thead>
              <tbody>
                {bautizos.map((b) => (
                  <tr key={b.id}>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 font-bold">
                      {b.nombre}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {b.padres}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {b.fecha}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {b.parroquia}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}