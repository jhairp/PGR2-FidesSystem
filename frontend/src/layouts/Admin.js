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

  return (
    <>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div 
        className="relative transition-all duration-300 min-h-screen bg-blueGray-100"
        style={{ 
          // Si w-64 (256px) deja espacio, probemos con rem exactos o bajando 1px
          marginLeft: isCollapsed ? '5rem' : '16rem', 
          width: 'auto'
        }}
      >
        <AdminNavbar />
        {/* Header */}
        <HeaderStats />
        
        {/* Este es el contenedor de las vistas (Dashboard, Tablas, etc.) */}
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <Switch>
            <Route path="/admin/dashboard" exact component={Dashboard} />
            <Route path="/admin/usuarios" exact component={UsuariosList} />
            <Route path="/admin/capillas" exact component={Maps} />
            <Route path="/admin/bautizos" exact component={Tables} /> 
            <Route path="/admin/calendario" exact component={Settings} />
            <Redirect from="/admin" to="/admin/dashboard" />
          </Switch>
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}