import React from "react";
// Componentes de la plantilla
import CardLineChart from "components/Cards/CardLineChart.js";
import CardBarChart from "components/Cards/CardBarChart.js";
import CardBautizosChart from "components/Cards/CardBautizosChart.js";

export default function Dashboard() {
  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
          <CardBautizosChart />
        </div>
        <div className="w-full xl:w-4/12 px-4">
          <CardBarChart title="Bautizos por Capilla" />
        </div>
      </div>
    
    </>
  );
} 