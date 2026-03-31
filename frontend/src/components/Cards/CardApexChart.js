import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import axios from "axios";

const BautizosChart = () => {
  // 1. Estado para los datos de la gráfica
  const [chartData, setChartData] = useState({
    series: [
      { name: "Bautizos", data: [] },
      { name: "Confirmaciones", data: [] }, // Podemos tener dos series si quieres
    ],
    options: {
      chart: {
        height: 350,
        type: "area",
        toolbar: { show: false }, // Limpia la gráfica para que se vea más minimalista
      },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth" },
      colors: ["#4c51bf", "#ed8936"], // Colores Indigo y Naranja de Notus
      xaxis: {
        type: "category", // Cambiamos datetime a category para manejar tus meses (Ene, Feb...)
        categories: [],
      },
      tooltip: {
        x: { format: "dd/MM/yy" },
      },
    },
  });

  // 2. Llamada a la API de Django
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/estadisticas-bautizos/")
      .then((res) => {
        const meses = res.data.map((item) => item.mes);
        const totales = res.data.map((item) => item.total);

        setChartData((prevState) => ({
          ...prevState,
          series: [{ name: "Bautizos", data: totales }],
          options: {
            ...prevState.options,
            xaxis: { ...prevState.options.xaxis, categories: meses },
          },
        }));
      })
      .catch((err) => console.error("Error al cargar datos:", err));
  }, []);

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white p-4">
      <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full max-w-full flex-grow flex-1">
            <h6 className="uppercase text-blueGray-400 mb-1 text-xs font-semibold">
              Estadísticas
            </h6>
            <h2 className="text-blueGray-700 text-xl font-semibold">
              Bautizos por Mes
            </h2>
          </div>
        </div>
      </div>
      <div className="p-4 flex-auto">
        {/* Renderizado de ApexCharts */}
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="area"
          height={350}
        />
      </div>
    </div>
  );
};

export default BautizosChart;