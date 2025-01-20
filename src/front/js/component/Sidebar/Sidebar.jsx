import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Importamos useNavigate
import { Context } from "../../store/appContext";
import './Sidebar.css';
import Logo from '../../../img/LogoFinancia.png';

const Sidebar = () => {
  const { store, actions } = useContext(Context); 
  const location = useLocation();
  const navigate = useNavigate();
// Comentario para hacer un push
  const handleLogout = () => {
    // Borra la información del localStorage usando la acción del contexto
    actions.logout();

    // Redirige a la página de inicio sin recargar la página
    navigate('/'); 
  };

  // Condición para ocultar la barra lateral en páginas específicas
  if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        {/* Fecha y hora */}
        <div className="date-time">
          {new Date().toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })}
        </div>
        {/* Contenedor del logo con fondo azul */}
        <div className="logo-container">
          <img src={Logo} alt="Logo Financia" />
        </div>
      </div>

      <div className="sidebar-body">
        <nav className="nav flex-column">
          <Link className="nav-link" to="/Home">
            <i className="fa-solid fa-gauge-high"></i> Dashboard
          </Link>
          <Link className="nav-link" to="/Ingresos">
            <i className="fa-solid fa-plus"></i> Registrar Ingresos
          </Link>
          <Link className="nav-link" to="/egresos">
            <i className="fa-solid fa-minus"></i> Registrar Egresos
          </Link>
          <Link className="nav-link" to="/categorias">
            <i className="fa-solid fa-tags"></i> Categorías
          </Link>
          <Link className="nav-link" to="/reportes">
            <i className="fa-solid fa-chart-line"></i> Reportes
          </Link>
          <Link className="nav-link" to="/Suscripciones">
            <i className="fa-solid fa-list"></i> Suscripciones
          </Link>
          <Link className="nav-link" to="/plandeahorro">
            <i className="fa-solid fa-piggy-bank"></i> Plan de Ahorro
          </Link>
          {/* Sección nueva para fondos de emergencia */}
          <Link className="nav-link nav-link-fondo" to="/fondo">
            <i className="fa-solid fa-heart"></i> Fondos de Emergencia
          </Link>
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="user-info">
          <span><i className="fa-solid fa-user"></i> {store.nombreUsuario}</span>
          <button onClick={handleLogout} className="btn btn-outline-danger">Sign Out</button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
