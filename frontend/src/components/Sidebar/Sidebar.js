/*eslint-disable*/
import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: "/admin/dashboard", icon: "fas fa-chart-line", label: "Dashboard" },
    { to: "/admin/usuarios", icon: "fas fa-users", label: "Usuarios" },
    { to: "/admin/capillas", icon: "fas fa-church", label: "Capillas" },
    { to: "/admin/bautizos", icon: "fas fa-tint", label: "Bautizos" },
    { to: "/admin/calendario", icon: "fas fa-calendar-alt", label: "Calendario" },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 h-full z-60 transition-all duration-300 ease-in-out bg-white border-r border-blueGray-200 
      ${isCollapsed ? "w-20" : "w-64"} 
      hidden md:flex flex-col m-0 p-0 shadow-sm`} // Agregamos p-0 y m-0 explícito
    >
      {/* Cabecera */}
      <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"} h-20 px-4 mb-2`}>
        {!isCollapsed && (
          <span className="text-blueGray-700 text-xs uppercase font-bold truncate ml-2">
            Sistema Parroquial
          </span>
        )}
        <button 
          className="text-blueGray-500 hover:text-lightBlue-600 p-2 rounded-lg bg-blueGray-50 transition-colors"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <i className={`fas ${isCollapsed ? "fa-bars" : "fa-times"} text-lg`}></i>
        </button>
      </div>

      {/* Lista de Navegación */}
      <ul className="flex flex-col list-none px-3">
        {navLinks.map((link) => (
          <li key={link.to} className="mb-1">
            <Link
              to={link.to}
              className={`flex items-center p-3 rounded-lg transition-all duration-200 mx-2
                ${isActive(link.to) 
                  ? "bg-lightBlue-500 text-white shadow-md" 
                  : "text-blueGray-500 hover:bg-blueGray-100"}`}
            >
              <div className={`flex items-center justify-center ${isCollapsed ? "w-full" : "w-10"}`}>
                <i className={`${link.icon} text-lg`}></i>
              </div>
              {!isCollapsed && (
                <span className="ml-3 text-xs uppercase font-bold whitespace-nowrap">
                  {link.label}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}