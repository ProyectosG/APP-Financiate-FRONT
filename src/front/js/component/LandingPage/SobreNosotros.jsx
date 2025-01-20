//INTENTO DE SOL1B
import React from 'react';
import VadhirImg from "../../../img/Vadhir.png";
import RadovanImg from "../../../img/Radovann.png";
import PabloImg from "../../../img/Pablo.png";
import EnriqueImg from "../../../img/Enrique.png";
import CerditoImg from "../../../img/Cerdito.png";
import TechlogosImg from "../../../img/Technologos.png";
import './Sobrenosotros.css';


const SobreNosotros = () => {
    return (
        <div>
            <div className="mt-0">

                {/* DESCRIPCION DE APP */}
                <div className="row p-5 bg-custom2">
                    <div className="fw-bold fs-1">Sobre Nosotros</div>
                    <div className="col-8">
                        <p className="text-justify">FINÁNCIA+E es la app definitiva para gestionar tu economía personal de manera sencilla y efectiva. Organiza tus gastos con categorías personalizadas, recibe alertas de tus suscripciones y planifica tus ahorros. Todo esto y mucho más, al alcance de tu mouse o celular. ¡Toma el control de tus finanzas hoy mismo! <br /> <br />La aplicación financiera fue desarrollada en 4GEEKS ACADEMY bajo la tutela del Profesor Bryan García y de José Velásquez, con mucho empeño y dedicación implementamos tecnologías como Html, Css, Bootstrap, JavaScript, React, Python, Flask, SweetAlert2, Postgresql, Recharts y Flatpickr entre otras.  </p>
                        {/* Imagen Techlogos dentro del mismo contenedor */}
                        <div className="row p-5 bg-custom2">
                            <div className="col-12 d-flex justify-content-center">
                                <img src={TechlogosImg} alt="Technologos" className="img-fluid" />
                            </div>
                        </div>
                    </div>
                    <div className="col-4 d-flex align-items-center justify-content-center">
                        <img src={CerditoImg} alt="Cerdito" className="img-fluid" />
                    </div>
                </div>



                {/* Descripción Enrique */}
                <div className="row p-5 align-items-center bg-custom">
                    <div className="col-4 d-flex justify-content-center flex-column align-items-center">
                        <img src={EnriqueImg} alt="Enrique" className="img-fluid" />
                        <p className="fw-bold text-center mt-2">Enrique López</p>
                    </div>
                    <div className="col-8">
                        <p className="text-justify">Web Developer Full Stack
                            Ingeniero en Sistemas Computacionales | Especialista en Análisis y Visualización de Datos Masivos

                            Con más de 20 años de experiencia en la industria tecnológica, soy un desarrollador full stack apasionado por crear soluciones innovadoras que combinen funcionalidad y diseño. Domino tanto el front-end como el back-end, y tengo una sólida experiencia en bases de datos.
                        </p>
                        <p className="txtNosotros">
                            Mi expertise incluye:

                            Front-end: HTML, CSS, JavaScript, Bootstrap, React
                            Back-end: Python, Flask, NodeJs
                            Bases de Datos: PostgreSQL, SQL Server, MongoDB
                            Mi enfoque está en construir aplicaciones robustas, escalables y eficientes, con un diseño intuitivo que brinde una experiencia excepcional a los usuarios. Estoy comprometido con la mejora continua y la colaboración en equipo para alcanzar resultados sobresalientes.</p>
                    </div>
                </div>

                {/* Descripción Vadhir */}
                <div className="row p-5 align-items-center bg-custom2">
                    <div className="col-8">
                        <p className="text-justify">Licenciado en Docencia de Idiomas con más de ocho años de experiencia en el ámbito educativo. Durante su trayectoria, observó cómo la tecnología puede transformar y enriquecer el proceso de enseñanza-aprendizaje, inspirándolo a explorar nuevas formas de integrar herramientas digitales en la educación. Esto lo llevó a iniciar su formación como Full Stack Developer, donde desarrolló habilidades en tecnologías como HTML, CSS, JavaScript, React, Python, SQL, entre otras. Su objetivo ahora es combinar la experiencia pedagógica con los conocimientos en programación para crear soluciones innovadoras que impulsen el aprendizaje y la accesibilidad en la educación.</p>
                    </div>
                    <div className="col-4 d-flex justify-content-center flex-column align-items-center">
                        <img src={VadhirImg} alt="Vadhir" className="img-fluid" />
                        <p className="fw-bold text-center mt-2">Jesus Lorenzo</p>
                    </div>
                </div>

                {/* Descripción Radovan */}
                <div className="row p-5 align-items-center bg-custom">
                    <div className="col-4 d-flex justify-content-center flex-column align-items-center">
                        <img src={RadovanImg} alt="Radovan" className="img-fluid" />
                        <p className="fw-bold text-center mt-2">Radovan Halir</p>
                    </div>
                    <div className="col-8">
                        <p className="text-justify">Web Developer Full Stack
                            Licenciado en Comunicación Social, mención audiovisual, con más de diez años de experiencia en el ámbito del marketing digital y animación tanto 2D como 3D, dominio de programas como: Adobe Photoshop, Adobe Illustrator, After Effects y Blender. Durante su trayectoria, se especializó en el modelado 3D de productos para videos publicitarios. Actualmente ve la programación como una oportunidad de expansión del diseño web y otras tecnologías digitales. Esto lo lleva a iniciar su formación en tecnologías como: HTML, CSS, JavaScript, Python, PSQL y React. De esta forma puede integrar tanto funcionalidad operativa como diseño web.</p>
                    </div>
                </div>

                {/* Descripción Pablo */}
                <div className="row p-5 align-items-center bg-custom2">
                    <div className="col-8">
                        <p className="text-justify">Ingeniero Industrial y Magíster en Seguridad y Salud Ocupacional, con especialidad en Administración y Gerencia de Instituciones de Salud. Con más de 12 años de experiencia liderando proyectos en diversos sectores, he descubierto que la tecnología es el puente hacia el futuro, capaz de transformar tanto a las empresas como a las personas.

                            A lo largo de mi trayectoria, he sido un apasionado por la innovación tecnológica y su impacto en la vida diaria. Este interés me llevó a embarcarme en un nuevo desafío: formarme como Full Stack Developer. Durante este proceso, he adquirido habilidades en tecnologías como HTML, CSS, JavaScript, React, Python y SQL, con el firme propósito de combinar mi experiencia profesional con soluciones digitales.

                            Mi objetivo es desarrollar software y herramientas que impulsen la transformación empresarial en áreas como finanzas, gestión, administración y salud. Creo firmemente en el poder de la tecnología para crear un cambio positivo y estoy decidido a ser parte de ese cambio, aportando soluciones creativas y funcionales que marquen la diferencia.</p>
                    </div>
                    <div className="col-4 d-flex justify-content-center flex-column align-items-center">
                        <img src={PabloImg} alt="Pablo" className="img-fluid" />
                        <p className="fw-bold text-center mt-2">Pablo Terán</p>
                    </div>
                </div>

            </div>
            <footer className="bg-body-secondary p-3">
                <div className="container d-flex justify-content-center align-items-center">
                    <p className="mb-0 text-center pb-4">
                        Copyrights 2025 | Developed and designed in 4Geeks Academy
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default SobreNosotros;