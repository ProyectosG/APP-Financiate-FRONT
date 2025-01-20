import React, { useState, useEffect, useRef } from 'react';
import './Suscripciones.css';
import Swal from 'sweetalert2';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css'; 

const BASENAME = import.meta.env.VITE_BASENAME;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


function Suscripciones() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isMounted = useRef(true);

    const [modalData, setModalData] = useState({
        nombre: '',
        costo: '',
        frecuencia: 'mensual',
        fecha_inicio: ''
    });

    // Obtener todas las suscripciones
    const fetchSubscriptions = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/suscripciones/suscripcion`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('tokenFinanciaE')}`,
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error del servidor:", errorText);
                Swal.fire("Error", "No se pudieron obtener las suscripciones.", "error");
                return;
            }

            const data = await response.json();
            if (isMounted.current) {
                setSubscriptions(data);
            }
        } catch (error) {
            console.error('Error al obtener las suscripciones:', error);
            Swal.fire("Error", "Hubo un problema al conectar con el servidor.", "error");
        }
    };

    useEffect(() => {
        fetchSubscriptions();
        return () => {
            isMounted.current = false;
        };
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setModalData({ ...modalData, [name]: value });
    };

    // Agregar una nueva suscripción
    const handleAddSubscription = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${BACKEND_URL}/api/suscripciones/suscripcion`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('tokenFinanciaE')}`,
                },
                body: JSON.stringify(modalData),
            });

            if (!response.ok) {
                Swal.fire("Error", "No se pudo guardar la suscripción.", "error");
                return;
            }

            const data = await response.json();
            Swal.fire("Éxito", "Suscripción guardada correctamente.", "success");
            setSubscriptions([...subscriptions, data.suscripcion]);
            setModalData({ nombre: '', costo: '', frecuencia: 'mensual', fecha_inicio: '' });
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error al guardar la suscripción:', error);
            Swal.fire("Error", "Hubo un problema al guardar la suscripción.", "error");
        }
    };

    // Eliminar una suscripción
    const handleDeleteSubscription = async (id) => {
        const result = await Swal.fire({
            title: "¿Está seguro?",
            text: "¿Desea eliminar esta suscripción?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#007bff", 
            cancelButtonColor: "#dc3545", 
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "No, cancelar",
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`${BACKEND_URL}/api/suscripciones/suscripcion`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('tokenFinanciaE')}`,
                    },
                    body: JSON.stringify({ id }),
                });

                if (response.ok) {
                    Swal.fire("Eliminado", "La suscripción ha sido eliminada.", "success");
                    setSubscriptions((prev) => prev.filter((sub) => sub.id !== id));
                } else {
                    const errorText = await response.text();
                    console.error("Error al eliminar la suscripción:", errorText);
                    Swal.fire("Error", "No se pudo eliminar la suscripción.", "error");
                }
            } catch (error) {
                console.error("Error al eliminar la suscripción:", error);
                Swal.fire("Error", "Hubo un problema al eliminar la suscripción.", "error");
            }
        }
    };

    // Registrar el pago de una suscripción como egreso
    const handleMarkAsPaid = async (subscription) => {
        const result = await Swal.fire({
            title: "¿Está seguro?",
            text: "¿Desea marcar esta suscripción como pagada?",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#007bff", 
            cancelButtonColor: "#dc3545", 
            confirmButtonText: "Sí, marcar",
            cancelButtonText: "No, cancelar",
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`${BACKEND_URL}/api/suscripciones/suscripcion/pagar`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('tokenFinanciaE')}`,
                    },
                    body: JSON.stringify({
                        id: subscription.id,
                        fecha: new Date().toISOString().split('T')[0], // Fecha en formato YYYY-MM-DD
                    }),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("Error al registrar el pago:", errorText);
                    Swal.fire("Error", "No se pudo registrar el pago.", "error");
                    return;
                }

                Swal.fire("Éxito", "Pago registrado correctamente.", "success");
                fetchSubscriptions();
            } catch (error) {
                console.error("Error al registrar el pago:", error);
                Swal.fire("Error", "Hubo un problema al registrar el pago.", "error");
            }
        }
    };

    return (
        <div className="suscripciones-container">
            <h2 className="titulo">Administrar Suscripciones y Pagos</h2>
            <button className="open-modal-button" onClick={() => setIsModalOpen(true)}>
                Agregar Suscripción
            </button>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Registrar Suscripción o Pago</h3>
                        <form onSubmit={handleAddSubscription}>
                            <div className="form-field">
                                <label htmlFor="nombre">Nombre:</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    value={modalData.nombre}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-field">
                                <label htmlFor="costo">Costo:</label>
                                <input
                                    type="number"
                                    id="costo"
                                    name="costo"
                                    value={modalData.costo}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-field">
                                <label htmlFor="frecuencia">Frecuencia:</label>
                                <select
                                    id="frecuencia"
                                    name="frecuencia"
                                    value={modalData.frecuencia}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="mensual">Mensual</option>
                                    <option value="anual">Anual</option>
                                </select>
                            </div>
                            <div className="form-field">
                                <label htmlFor="fecha_inicio">Fecha de Inicio:</label>
                                <input
                                    type="date"
                                    id="fecha_inicio"
                                    name="fecha_inicio"
                                    value={modalData.fecha_inicio}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="buttons-container">
                                <button type="submit" className="save-button">Guardar</button>
                                <button
                                    type="button"
                                    className="close-button"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="subscriptions-list">
                {subscriptions.map((sub) => (
                    <div key={sub.id} className="subscription-card">
                        <div className="card-left">
                            <h4>{sub.nombre}</h4>
                            <p>Costo: ${sub.costo.toFixed(2)}</p>
                            <p>Frecuencia: {sub.frecuencia}</p>
                            <p>Fecha de Inicio: {sub.fecha_inicio}</p>
                        </div>
                        <div className="card-actions">
                            <button
                                className="delete-button"
                                onClick={() => handleDeleteSubscription(sub.id)}
                            >
                                Eliminar
                            </button>
                            <button
                                className="paid-button"
                                onClick={() => handleMarkAsPaid(sub)}
                            >
                                Pagado
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Suscripciones;
