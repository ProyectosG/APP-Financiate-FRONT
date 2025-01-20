import React, { useState, useEffect, useRef } from "react";
import './PlanDeAhorro.css';
import CrearPlanDeAhorro from "./CrearPlanDeAhorro.jsx";
import Detalles from './Detalles.jsx';

const BASENAME = import.meta.env.VITE_BASENAME;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const formatNumber = (number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(number);
};

const PlanDeAhorro = () => {
  const [plans, setPlans] = useState([]);
  const [showModalCrear, setShowModalCrear] = useState(false);
  const [showModalDetalles, setShowModalDetalles] = useState(false);
  const [planToEdit, setPlanToEdit] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga
  const isMounted = useRef(true);
  
  // Función para obtener los planes de la API
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
        setPlans(data.planes);
        setLoading(false); // Cambiar el estado de carga a falso una vez que se reciban los planes
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      setLoading(false); // En caso de error, también se cambia el estado de carga
    }
  };

  useEffect(() => {
    isMounted.current = true;
    fetchPlans(); // Llamada a la API al montar el componente
    return () => {
      isMounted.current = false;
    };
  }, []); // Este useEffect solo se ejecuta al montar el componente

  // Función para actualizar los planes después de agregar/editar
  const updatePlans = (newPlan) => {
    if (newPlan.id) {
      setPlans(prevPlans => prevPlans.map(plan => plan.id === newPlan.id ? newPlan : plan));
    } else {
      setPlans(prevPlans => [...prevPlans, newPlan]);
    }
    setShowModalCrear(false); // Cerrar el modal

    fetchPlans(); // Vuelve a cargar los planes después de agregar/editar
  };


  // Función para ver detalles del plan
  const handleDetalles = (plan) => {
    setPlanToEdit(plan);
    setShowModalDetalles(true); // Abre el modal de detalles
  };

  // Función para cerrar el modal de creación/edición
  const handleCloseCrearModal = () => {
    setShowModalCrear(false);
    setPlanToEdit(null);
  };

  // Función para cerrar el modal de detalles
  const handleCloseDetallesModal = () => {
    setShowModalDetalles(false);
    setPlanToEdit(null);
  };

  
  return (
    <div className="container text-center">
      <h2>Gestión de Planes de Ahorro</h2>
      <button onClick={() => setShowModalCrear(true)} className="btn btn-primary">
        Nuevo Plan
      </button>

      {/* Modal de Crear/Editar Plan */}
      <CrearPlanDeAhorro
        showModal={showModalCrear}
        onClose={handleCloseCrearModal}
        planToEdit={planToEdit}
        updatePlans={updatePlans} // Pasa la función updatePlans al modal
      />

      {/* Modal de Detalles */}
      <Detalles
        plan={planToEdit}
        onClose={handleCloseDetallesModal}
        onEdit={() => handleEdit(planToEdit)}
        onDelete={() => handleDelete(planToEdit)}
        updatePlans={updatePlans}
      />

      {/* Listado de planes */}
      <div className="row mt-4 d-flex justify-content-center">
        {loading ? (
          <p>Cargando planes...</p> // Mensaje mientras los datos cargan
        ) : plans.length === 0 ? (
          <p>No hay planes disponibles.</p> // Mensaje si no hay planes
        ) : (
          plans.map(plan => (
            <div className="col-md-4" key={`${plan.id}-${Date.now()}`}>
              
              <div className="card cardplan">
                <div className="card-body">
                  <h5 className="card-title small-title">{plan.nombre_plan}</h5>
                  <p className="card-text small-title">🏁 Monto Objetivo: {formatNumber(plan.monto_objetivo)}</p>
                  <button
                    onClick={() => handleDetalles(plan)}
                    className="btn btn-outline-primary"
                  >
                    Ver detalles
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PlanDeAhorro;
