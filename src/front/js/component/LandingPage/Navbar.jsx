import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logoFinanciaUrlBlue from "../../../img/Financiate_blue.png";
import './LandingPage.css';

const Navbar = () => {
    return (
        <div>
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg bg-body-secondary">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/">
                        <img src={logoFinanciaUrlBlue} alt="Logo" className="navbar-logo" />
                    </a>
                    <div className="navbar-nav">
                        {/* Link "Home" */}
                        <Link className="fw-bold fs-5 nav-link" to="/"><i className="fa-solid fa-house"></i></Link>
                        <Link className="fw-bold fs-5 nav-link" to="/sobre-nosotros">Sobre nosotros</Link>
                    </div>
                    <div className="ms-auto">
                        <Link to="/login" className="boton-is fw-bold btn btn-transparent">Iniciar sesión</Link>
                        <Link to="/signup" className="boton-r fw-bold btn btn-primary text-white ms-2">Regístrate</Link>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;