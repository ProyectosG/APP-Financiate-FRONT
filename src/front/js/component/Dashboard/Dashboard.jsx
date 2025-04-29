import React, { useState, useEffect, useContext, useRef } from "react";
import { NavLink } from 'react-router-dom';
import { Context } from "../../store/appContext";
import DonutChart from "./DonutChart.jsx"; // Importamos el gráfico de dona
import PieChartComponent from './PieChartComponent.jsx'; // Importamos el gráfico de pastel
import LineChartComponent from "./LineChartComponent.jsx"; // Importamos el gráfico de líneas
import ProgressBar from "./ProgressBar.jsx";
import "./Dashboard.css";

const BASENAME = import.meta.env.VITE_BASENAME;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Dashboard = () => {
    const { store } = useContext(Context);
    const [showAlert, setShowAlert] = useState(false);
    const [totales, setTotales] = useState([]);
    const [capitales, setCapitales] = useState([]);
    const [fondosEmergencia, setFondosEmergencia] = useState(null);
    const [datosMensuales, setDatosMensuales] = useState([]);
    const [planes, setPlanes] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const isMounted = useRef(true);
    const [leyendaSinDatos, setLeyendaSinDatos] = useState('');
    const [selectedChart, setSelectedChart] = useState('donut'); // Estado para seleccionar el gráfico

    // ALERTA DEL FONDO Y EL CAPITAL ACTUAL
        useEffect(() => {
            const fetchFondoEmergenciaActivo = async () => {
                try {
                    const response = await fetch(`${BACKEND_URL}/api/fondos_emergencia/activo`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${store.token}`,
                        },
                    });
    
                    if (!response.ok) {
                        if (response.status === 404) {
                            console.log("No se encontró un fondo de emergencia activo.");
                            return;
                        }
                        throw new Error(`Error ${response.status}: ${response.statusText}`);
                    }
    
                    const data = await response.json();
                    setFondosEmergencia(data);
    
                    const capitalActual = capitales.capital_actual;
                    const montoFondoEmergencia = data.monto;
                    const diferencia = capitalActual - montoFondoEmergencia;
    
                    if (diferencia <= 0) {
                        setShowAlert({
                            show: true,
                            message: "¡Cuidado! Has excedido tu Fondo de Emergencia."
                        });
                    } else if (diferencia <= 1000) {
                        setShowAlert({
                            show: true,
                            message: "¡Alerta! El capital actual está a punto de igualar el fondo de emergencia."
                        });
                    } else {
                        setShowAlert({ show: false });
                    }
    
                } catch (err) {
                    setError(err.message);
                }
            };
    
            if (store.usuario_id) {
                fetchFondoEmergenciaActivo();
            }
        }, [store.usuario_id, capitales.capital_actual]);
    
    

    // LLAMADAS A LA API Y FETCHING DE DATOS
    useEffect(() => {
        const fetchTotales = async () => {
            try {
                setLoading(true);
                if (!store.usuario_id) throw new Error("ID del usuario requerido");

                const response = await fetch(`${BACKEND_URL}/api/usuarios/totales`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${store.token}`,
                    },
                });

                if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

                const data = await response.json();

                const formattedData = [
                    { name: "Ingresos", value: data.total_ingresos },
                    { name: "Egresos", value: data.total_egresos },
                ];
                setTotales(formattedData);
                setLeyendaSinDatos(data.total_ingresos === 0 && data.total_egresos === 0
                    ? '(Aún no hay ingresos o egresos por graficar)'
                    : ''
                );
                setCapitales({
                    "capital_inicial": data.capital_inicial,
                    "capital_actual": data.capital_actual,
                });

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTotales();
    }, [store.usuario_id, store.token]);

    // LLAMADA A LA API PARA GRAFICO DE LINEAS
    useEffect(() => {
        const fetchTotalDatosMensuales = async () => {
            try {
                setLoading(true);

                if (!store.usuario_id) {
                    throw new Error("ID del usuario requerido");
                }
                const response = await fetch(BACKEND_URL + '/api/usuarios/datosmensuales', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${store.token}`,
                    },
                    body: JSON.stringify({
                        meses: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                    }),
                });
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();

                const formattedData = data.map(d => ({
                    mes: d.mes,
                    ingresos: d.ingresos,
                    egresos: d.egresos,
                }));

                setDatosMensuales(formattedData);
            } catch (err) {
                setError("Error.....", err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTotalDatosMensuales();
    }, []);

    const fetchPlans = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/plandeahorro/traerplan`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('tokenFinanciaE')}`,
                },
            });
            const data = await response.json();
            if (isMounted.current) {
                setPlanes(data.planes);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching plans:', error);
            if (isMounted.current) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        isMounted.current = true;
        fetchPlans();
        return () => {
            isMounted.current = false;
        };
    }, []);

    const handleHideLeyenda = () => {
        setLeyendaSinDatos('');
    };

    useEffect(() => {
        const hideLeyendaHandler = () => {
            handleHideLeyenda();
        };

        // Detectar movimiento del mouse
        const handleMouseMove = () => {
            hideLeyendaHandler();
        };

        // Detectar cualquier tecla presionada
        const handleKeyPress = () => {
            hideLeyendaHandler();
        };

        // Agregar event listeners
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('keydown', handleKeyPress);

        // Limpiar event listeners
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    // Cambiar gráfico según la selección del radio button
    const handleChartChange = (e) => {
        setSelectedChart(e.target.value);
    };

    return (
        <div className="dashboard-container">
            <h3 className="main-title">Dashboard Fináncia+E</h3>
            {/* Contenedor de radio buttons */}
            <div className="chart-type-container">
                <h5>Tipo de Gráfico</h5>
                <div className="radio-buttons">
                    <label>
                        <input
                            type="radio"
                            value="donut"
                            checked={selectedChart === 'donut'}
                            onChange={handleChartChange}
                        />
                        Dona
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="pie"
                            checked={selectedChart === 'pie'}
                            onChange={handleChartChange}
                        />
                        Pastel
                    </label>
                </div>
            </div>

            {showAlert.show && (
                <div className="custom-alert">
                    <p>{showAlert.message}</p>
                    <button onClick={() => setShowAlert({ show: false })}>Cerrar</button>
                </div>
            )}

            {loading ? (
                <p className="loading-text">Cargando datos...</p>
            ) : error ? (
                <p className="error-text">{error}</p>
            ) : (
                <div className="dashboard">
                    <div className="row justify-content-center mb-2">
                        {/* Contenedor para los gráficos */}
                        <div className="col-12 d-flex justify-content-between align-items-start">
                            {/* Contenedor de gráficos */}
                            <div className="chart-container">
                                {selectedChart === 'donut' ? (
                                    <DonutChart
                                        data={totales}
                                        leyendaSinDatos={leyendaSinDatos}
                                        capitalInicial={capitales.capital_inicial}
                                        capitalActual={capitales.capital_actual}
                                    />
                                ) : (
                                    <PieChartComponent
                                        data={totales}
                                        leyendaSinDatos={leyendaSinDatos}
                                        capitalInicial={capitales.capital_inicial}
                                        capitalActual={capitales.capital_actual}
                                    />
                                )}
                            </div>


                        </div>

                        <div className="col-12">
                            <h4 className="chart-title">Evolución Mensual de Ingresos y Egresos</h4>
                            <LineChartComponent data={datosMensuales} />
                        </div>

                        <NavLink to='/plandeahorro'>
                            <p className="navlink-text">PLANES DE AHORRO</p>
                        </NavLink>

                        {/* Leyenda de sin datos */}
                        {leyendaSinDatos && (
                            <>
                                <div className="fondo-opaco"></div> {/* Fondo opaco */}
                                <div className={`leyenda-sin-datos ${leyendaSinDatos ? 'show' : ''}`}>
                                    {leyendaSinDatos}
                                </div>
                            </>
                        )}

                        <div className="progress-container mt-5">
                            {planes.length > 0 ? (
                                planes.map((plan, index) => (
                                    <ProgressBar
                                        key={index}
                                        nombre_plan={plan.nombre_plan}
                                        monto_inicial={plan.monto_inicial}
                                        total={plan.monto_objetivo}
                                        current={plan.monto_acumulado}
                                    />
                                ))
                            ) : (
                                <p>No hay planes disponibles</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
