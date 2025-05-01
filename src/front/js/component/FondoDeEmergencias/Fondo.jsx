import React, { useState, useContext, useEffect } from "react";
import { Context } from "../../store/appContext";
import Swal from "sweetalert2";
import "./Fondo.css";

const BASENAME = import.meta.env.VITE_BASENAME;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Fondo = () => {
    const { actions } = useContext(Context);
    const [monto, setMonto] = useState("");
    const [razon, setRazon] = useState("");
    const [fondoGuardado, setFondoGuardado] = useState(null);

    useEffect(() => {
        const obtenerFondo = async () => {
            try {
                const respuesta = await fetch(`${BACKEND_URL}/api/fondos_emergencia/activo`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("tokenFinanciaE")}`,
                    },
                });

                const resultado = await respuesta.json();
                if (respuesta.ok && resultado.id) {
                    setFondoGuardado({
                        id: resultado.id,
                        monto: resultado.monto,
                        razon: resultado.razon,
                    });
                }
            } catch (error) {
                console.error("Error al obtener el fondo", error);
            }
        };

        obtenerFondo();
    }, []);

    const manejarEnvio = async (e) => {
        e.preventDefault();

        if (!monto || !razon) {
            Swal.fire({
                icon: "error",
                title: "Campos incompletos",
                text: "Por favor, completa todos los campos antes de guardar.",
            });
            return;
        }

        try {
            const respuesta = await fetch(`${BACKEND_URL}/api/fondos_emergencia/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("tokenFinanciaE")}`,
                },
                body: JSON.stringify({
                    monto: parseFloat(monto),
                    razon,
                }),
            });

            const resultado = await respuesta.json();

            if (respuesta.ok) {
                setFondoGuardado({ id: resultado.id, monto: parseFloat(monto), razon });
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Tu fondo de emergencias ha sido guardado.",
                    showConfirmButton: false,
                    timer: 1500,
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: resultado.msg || "Hubo un error al guardar el fondo. Intenta nuevamente.",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Hubo un problema con la conexión al servidor. Intenta más tarde.",
            });
        }

        setMonto("");
        setRazon("");
    };

    const manejarEliminar = async () => {
        const confirmacion = await Swal.fire({
            title: "¿Está seguro de querer eliminar este fondo?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, deseo borrarlo",
            cancelButtonText: "No, lo pensaré un poco más",
        });

        if (confirmacion.isConfirmed) {
            try {
                const respuesta = await fetch(`${BACKEND_URL}/api/fondos_emergencia/`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("tokenFinanciaE")}`,
                    },
                    body: JSON.stringify({
                        "id": fondoGuardado.id,
                    })
                });

                if (respuesta.ok) {
                    setFondoGuardado(null);
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "El fondo de emergencia ha sido eliminado.",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "No se pudo eliminar el fondo. Intente nuevamente.",
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Hubo un problema con la conexión al servidor. Intenta más tarde.",
                });
            }
        }
    };

    return (
        <div className="fondo-container">
            <h2 className="titulo">Fondo de Emergencia</h2>

            {!fondoGuardado ? (
                <form className="fondo-form" onSubmit={manejarEnvio}>
                    <div className="form-group">
                        <label htmlFor="monto" className="form-label">
                            Ingresa el monto deseado como fondo de emergencia
                        </label>
                        <input
                            type="number"
                            id="monto"
                            className="form-input"
                            value={monto}
                            onChange={(e) => setMonto(e.target.value)}
                            placeholder="Ejemplo: 10000"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="razon" className="form-label">
                            Razón del fondo
                        </label>
                        <input
                            type="text"
                            id="razon"
                            className="form-input"
                            value={razon}
                            onChange={(e) => setRazon(e.target.value)}
                            placeholder="Ejemplo: Gastos médicos"
                        />
                    </div>

                    <button type="submit" className="btn-guardar">
                        Guardar Fondo
                    </button>
                </form>
            ) : (
                <div className="fondo-card">
                    <p><strong>Razón:</strong> {fondoGuardado.razon}</p>
                    <p><strong>Monto:</strong> ${fondoGuardado.monto.toFixed(2)}</p>
                    <div className="card-buttons">
                        <button className="btn-eliminar" onClick={manejarEliminar}>
                            Eliminar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Fondo;
