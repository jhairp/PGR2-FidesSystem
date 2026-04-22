import React, { useState } from "react"; // 1. Importamos useState
import { Switch, Route, Redirect } from "react-router-dom";

// components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";

// views
import Dashboard from "views/admin/Dashboard.js";
import Maps from "views/admin/Maps.js";
import Settings from "views/admin/Settings.js";
import Tables from "views/admin/Tables.js";
import Bautizos from "views/admin/Bautizos.js";

import UsuariosList from "../components/Usuarios/UsuariosList.jsx";

export default function Admin() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // 1. Detectar si estamos en la ruta de mapas
  const isMapsPage = window.location.href.indexOf("/admin/capillas") !== -1;
  return (
    <>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div 
        className="relative transition-all duration-300 min-h-screen bg-blueGray-100"
        style={{ 
          marginLeft: isCollapsed ? '5rem' : '16rem', 
          width: 'auto'
        }}
      >
        <AdminNavbar />

        {/* 2. SOLO mostrar el Header si NO estamos en mapas */}
        {!isMapsPage && <HeaderStats />}
        
        <div className={`mx-auto w-full ${isMapsPage ? "p-0 pb-0" : "px-4 md:px-10 -m-24"}`}>
          <Switch>
            <Route path="/admin/dashboard" exact component={Dashboard} />
            <Route path="/admin/usuarios" exact component={UsuariosList} />
            <Route path="/admin/capillas" exact component={Maps} />
            {/* ... resto de rutas */}
          </Switch>

          {/* 3. SOLO mostrar el Footer si NO estamos en mapas */}
          {!isMapsPage && <FooterAdmin />}
        </div>
      </div>
    </>
  );
}