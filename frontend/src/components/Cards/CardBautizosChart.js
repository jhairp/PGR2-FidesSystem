import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import axios from "axios";

const CardBautizosChart = () => {
  const [chartData, setChartData] = useState({
    series: [
      { name: "Bautizos", data: [] },
      { name: "Matrimonios", data: [] }
    ],
    options: {
      chart: {
        type: "area",
        height: 350,
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true
          }
        },
      },
      colors: ["#008FFB", "#00E396"], // Azul y Verde exactos de tu imagen
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 4 },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3, // Bajamos un poco para que se vea el fondo blanco
          stops: [0, 90, 100]
        }
      },
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        labels: { colors: "#334155" } // Texto oscuro para fondo blanco
      },
      markers: {
        size: 0,
        hover: { size: 6 }
      },
      xaxis: {
        type: 'category', // ¡CAMBIO CLAVE! 'category' en lugar de 'datetime'
        categories: [],
        labels: {
          style: { colors: "#8e8e8e" }
        }
      },
      yaxis: {
        labels: {
          style: { colors: "#8e8e8e" }
        }
      },
      tooltip: {
        theme: "light"
      }
    },
  });

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/estadisticas-bautizos/")
      .then((res) => {
        const meses = res.data.map((item) => item.mes);
        const datosBautizos = res.data.map((item) => item.bautizos);
        const datosMatrimonios = res.data.map((item) => item.matrimonios);

        setChartData((prevState) => ({
          ...prevState,
          series: [
            { name: "Bautizos", data: datosBautizos },
            { name: "Matrimonios", data: datosMatrimonios }
          ],
          options: {
            ...prevState.options,
            xaxis: { 
                ...prevState.options.xaxis, 
                categories: meses 
            }
          },
        }));
      })
      .catch((err) => console.error("Error cargando datos:", err));
  }, []);

  return (
    <div className="relative z-10 bg-white p-4 rounded shadow-lg border border-blueGray-200">
      <div className="mb-4 px-2">
        <h6 className="uppercase text-blueGray-400 mb-1 text-xs font-semibold">
          Resumen Anual
        </h6>
        <h2 className="text-blueGray-700 text-xl font-bold">
          Comparativa de sacramentos
        </h2>
      </div>
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="area"
        height={350}
      />
    </div>
  );
};

export default CardBautizosChart;