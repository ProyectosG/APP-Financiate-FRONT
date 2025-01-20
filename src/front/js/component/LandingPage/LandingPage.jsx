import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logoFinanciaUrlBlue from "../../../img/Financiate_blue.png";
import CerditoVacasImg from "../../../img/Cerdito_Vacas.png";
import LpMan from "../../../img/man-holding.png";
import SuscripcionesImg from "../../../img/Suscripciones.png";
import EmergenciasImg from "../../../img/Emergencias.png";
import './LandingPage.css';
const LandingPage = () => {
    return (
        <div className='bg-custom'>
            <div className="container mt-0">
                <div className="row align-items-center">
                    <div className="col-12 col-md-6 ">
                        <div className="header text-justify">Tus ingresos y egresos a un solo click</div>

                        {/* Descripción */}
                        <p className='text-justify'>
                            FINÁNCIA+E gestiona tu economía mediante categorías personalizadas, alertas de pagos de suscripciones, planes de ahorro y mucho más al alcance de tu mouse o tu celular.
                        </p>

                        {/* Botón CTA */}
                        <Link to="/login" className="fw-bold fs-5 Boton-cta btn btn-primary w-100">
                            Finánciate aquí
                        </Link>
                    </div>

                    {/* Persona con cerdito*/}
                    <div className="col-12 col-md-6 mt-4 mt-md-0">
                        <img src={LpMan} alt="Persona con cerdito" className="img-fluid" />
                    </div>
                </div>
            </div>


            <div className="container mt-5">
                <div className="row align-items-center min-vh-100 pt-5">
                    {/* Columna de imagen - Ahora a la izquierda */}
                    <div className="col-12 col-md-6 order-md-0 mt-4 mt-md-0">
                        <img src={CerditoVacasImg} alt="Imagen de Cerdito y Vacas" className="img-fluid" />
                    </div>

                    {/* Columna de texto - Ahora a la derecha */}
                    <div className="col-12 col-md-6 order-md-1">
                        <div className="header">Ahorrar para las vacaciones nunca antes fue tan fácil con la opción de PLANES DE AHORRO</div>

                        {/* Descripción*/}
                        <p className='text-justify'>
                            Nuestra función de PLANES DE AHORRO sin duda es una de nuestras mejores opciones. Apunta uno o más planes de ahorro en FINÁNCIA+E para organizar tus finanzas y visualiza en una vista tus objetivo financieros más importantes como: vacaciones de familia, compra de coche, vivienda y lo que quieras.
                        </p>
                    </div>
                </div>
                <div className="container mt-0">
                    <div className="row align-items-center">
                        <div className="col-12 col-md-6 ">
                            <div className="header">Recuerda la fecha de tus SUSCRIPCIONES</div>

                            {/* Descripción */}
                            <p className='text-justify'>
                                Con nuestra función de suscripciones podrás recordar el pago mensual de tu plan de internet o el de tu streaming favorito. Si eres de los que le cuesta recordarse del día y el monto de las suscripciones, FINÁNCIA+E te da la solución inmediata.
                            </p>
                        </div>

                        {/* Persona con cerdito*/}
                        <div className="col-12 col-md-6 mt-4 mt-md-0">
                            <img src={SuscripcionesImg} alt="Persona con cerdito" className="img-fluid" />
                        </div>
                    </div>
                </div>
                <div className="row align-items-center min-vh-100 pt-5">
                    {/* Columna de imagen - Ahora a la izquierda */}
                    <div className="col-12 col-md-6 order-md-0 mt-4 mt-md-0">
                        <img src={EmergenciasImg} alt="Imagen de Cerdito y Vacas" className="img-fluid" />
                    </div>

                    {/* Columna de texto - Ahora a la derecha */}
                    <div className="col-12 col-md-6 order-md-1">
                        <div className="header">Define cuanto es el máximo de gastos con tu FONDO DE EMERGENCIAS</div>

                        {/* Descripción*/}
                        <p className='text-justify'>
                            Establece un límite de gastos para tu cartera o tu cuenta bancaria y recibe alertas para reconocer que estas llegando al tope de tus egresos.
                        </p>
                    </div>
                </div>
            </div>


            {/* Footer copyrights*/}
            <footer className="bg-body-secondary py-3">
                <div className="container d-flex justify-content-center align-items-center">
                    <p className="mb-0 text-center pb-4">
                        Copyrights © 2025 | Developed and designed in 4Geeks Academy
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;