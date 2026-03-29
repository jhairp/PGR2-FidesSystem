import React from "react";
// Componentes de la plantilla
import CardLineChart from "components/Cards/CardLineChart.js";
import CardBarChart from "components/Cards/CardBarChart.js";
import CardPageVisits from "components/Cards/CardPageVisits.js";
import CardSocialTraffic from "components/Cards/CardSocialTraffic.js";

export default function Dashboard() {
  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
          {/* Aquí el gráfico mostrará la tendencia de bautizos por mes */}
          <CardLineChart title="Bautizos Realizados - Periodo 2026" />
        </div>
        <div className="w-full xl:w-4/12 px-4">
          <CardBarChart title="Bautizos por Capilla" />
        </div>
      </div>
    </>
  );
}