import React, { useState } from "react";
import styles from './Detalles.module.css'; // Importa los estilos como un módulo
import Swal from "sweetalert2";
import EditarPlan from "./EditarPlan.jsx";
import RegistrarAhorro from "./RegistrarAhorro.jsx";
import moment from "moment"; // Importamos moment.js

const BASENAME = import.meta.env.VITE_BASENAME;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const formatNumber = (number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(number);
};

const Detalles = ({ plan, onClose, updatePlans }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRegistrarAhorroModal, setShowRegistrarAhorroModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleRegistrarAhorro = () => {
    setShowRegistrarAhorroModal(true);
  };

  const handleCloseRegistrarAhorro = () => {
    setShowRegistrarAhorroModal(false);
    onClose();
  };

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
      updatePlans(data); // Esto debería actualizar el estado en el componente principal
      setLoading(false);
    } catch (error) {
      console.error('Error fetching plans:', error);
      setLoading(false);
    }
  };

  const handleEliminar = async () => {
    if (!plan || !plan.id) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BACKEND_URL}/api/plandeahorro/eliminar_plan_ahorro`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('tokenFinanciaE')}`,
        },
        body: JSON.stringify({ "plan_ahorro_id": plan.id }),
      });

      if (response.ok) {
        fetchPlans();
        onClose();
        Swal.fire("Deleted!", "Your plan has been deleted.", "success");
      } else {
        setError("Error al eliminar el plan de ahorro.");
        Swal.fire("Error", "No se pudo eliminar el plan.", "error");
      }
    } catch (err) {
      setError("Hubo un error al intentar eliminar el plan.");
      Swal.fire("Error", "Hubo un problema al eliminar el plan.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!plan) return null;

  const validFechaInicio = plan.fecha_inicio ? moment(plan.fecha_inicio).format("DD/MM/YYYY") : null;
  const validFechaObjetivo = plan.fecha_objetivo ? moment(plan.fecha_objetivo).format("DD/MM/YYYY") : null;

  return (
    <div>
      <div className={`${styles.modalDetallesPlan} modal fade show`} tabIndex="-1" style={{ display: "block" }} aria-labelledby="detallesModalLabel" aria-hidden="false">
        <div className={`${styles.modalDialog} modal-dialog`}>
          <div className={`${styles.modalContent} modal-content`}>
            <div className={`${styles.modalHeader} modal-header`}>
              <h5 className={`${styles.modalTitle} modal-title`} id="detallesModalLabel">Detalles del Plan de ahorro</h5>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <table className="table table-bordered">
                <tbody>
                  <tr><th>Nombre del Plan</th><td>{plan.nombre_plan}</td></tr>
                  <tr><th>Fecha de Inicio</th><td>{validFechaInicio ? validFechaInicio : "Fecha inválida"}</td></tr>
                  <tr><th>Monto Inicial</th><td>{formatNumber(plan.monto_inicial)}</td></tr>
                  <tr><th>Fecha Objetivo</th><td>{validFechaObjetivo ? validFechaObjetivo : "Fecha inválida"}</td></tr>
                  <tr><th>Monto Objetivo</th><td>{formatNumber(plan.monto_objetivo)}</td></tr>
                  <tr><th>Monto Acumulado</th><td>{formatNumber(plan.monto_acumulado)}</td></tr>
                </tbody>
              </table>
            </div>
            <div className={`${styles.modalFooter} modal-footer`}>
              <button type="button" className="btn btn-outline-danger" onClick={() => {
                Swal.fire({
                  title: "Estas Seguro?",
                  text: "No podras revertir esta accion!",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Si, Eliminalo!",
                }).then((result) => {
                  if (result.isConfirmed) {
                    handleEliminar();
                  }
                });
              }} disabled={loading}>
                {loading ? "Eliminando..." : "🗑️ Eliminar"}
              </button>
              <button type="button" className="btn btn-outline-warning" onClick={handleEdit}>✏️ Editar</button>
              <button type="button" className="btn btn-outline-success" onClick={handleRegistrarAhorro}>🐷 Ahorrar</button>
            </div>
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditarPlan
          plan={plan}
          onClose={handleCloseEditModal}
        />
      )}

      {showRegistrarAhorroModal && (
        <RegistrarAhorro
          plan={plan}
          onClose={handleCloseRegistrarAhorro}
        />
      )}
    </div>
  );
};

export default Detalles;
