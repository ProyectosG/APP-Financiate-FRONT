import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css';
import moment from 'moment';
import styles from './EditarPlan.module.css'; // Asegúrate de usar el módulo de CSS

const BASENAME = import.meta.env.VITE_BASENAME;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const EditarPlan = ({ plan, onClose, updatePlans }) => {
  const getCurrentDate = () => {
    const today = moment().startOf('day');
    return today.format('DD-MM-YYYY');
  };

  const [formData, setFormData] = useState({
    nombre_plan: '',
    fecha_inicio: '',
    fecha_objetivo: '',
    monto_objetivo: ''
  });

  const formatToDDMMYYYY = (dateString) => {
    return moment(dateString).format('DD-MM-YYYY');
  };

  const formatToYYYYMMDD = (dateString) => {
    return moment(dateString, 'DD-MM-YYYY').format('YYYY-MM-DD');
  };

  useEffect(() => {
    if (plan) {
      setFormData({
        nombre_plan: plan.nombre_plan || '',
        fecha_inicio: plan.fecha_inicio ? formatToDDMMYYYY(plan.fecha_inicio) : getCurrentDate(),
        fecha_objetivo: plan.fecha_objetivo ? formatToDDMMYYYY(plan.fecha_objetivo) : getCurrentDate(),
        monto_objetivo: plan.monto_objetivo || '',
      });
    } else {
      setFormData({
        nombre_plan: '',
        fecha_inicio: getCurrentDate(),
        fecha_objetivo: getCurrentDate(),
        monto_objetivo: '',
      });
    }
  }, [plan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BACKEND_URL}/api/plandeahorro/editarplan`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('tokenFinanciaE')}`,
        },
        body: JSON.stringify({
          id: plan.id,
          ...formData,
          fecha_inicio: formatToYYYYMMDD(formData.fecha_inicio),
          fecha_objetivo: formatToYYYYMMDD(formData.fecha_objetivo),
        })
      });

      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Plan Editado con éxito',
          confirmButtonText: 'Aceptar'
        });

        onClose();
      } else {
        Swal.fire({
          title: "Hubo un error al actualizar el plan",
          text: data.error,
          icon: "error"
        });
      }
    } catch (error) {
      console.error('Error al editar el plan:', error);
      alert("Error al actualizar el plan");
    }
  };

  return (
    <div className={`${styles.modalDetallesPlan} modal fade show bodyContainer`} tabIndex="-1" style={{ display: "block" }} aria-labelledby="editarPlanLabel" aria-hidden="false">
      <div className={`${styles.modalDialog} modal-dialog modal-lg`}>
        <div className={`${styles.modalContent} modal-content shadow-lg rounded-3`}>
          <div className={`${styles.modalHeader} modal-header`}>
            <h5 className={`${styles.modalTitle} modal-title`} id="editarPlanLabel">Editar Plan de Ahorro</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body d-flex flex-column justify-content-center align-items-center">
              <div className="row g-3 w-100 d-flex flex-column align-items-center">
                <div className="col-12 mb-3 text-center">
                  <label htmlFor="nombre_plan" className="form-label text-muted">Nombre del Plan</label>
                  <input
                    type="text"
                    id="nombre_plan"
                    name="nombre_plan"
                    className="form-control form-control-lg border-0 shadow-sm rounded-2 mx-auto"
                    value={formData.nombre_plan}
                    onChange={handleChange}
                    style={{
                      backgroundColor: '#fff', // Fondo blanco
                      color: '#000', // Texto negro
                      borderRadius: '4px', // Bordes redondeados
                      padding: '5px', // Espaciado interno
                      fontSize: '1rem', // Tamaño de fuente adecuado
                      width: "100%"
                    }}
                  />
                </div>

                <div className="col-12 d-flex flex-column justify-content-center align-items-center mb-2">
                  <div className="text-center p-3 border rounded-3 shadow-sm bg-light w-100">
                    <div className="mb-2">
                      <label htmlFor="fecha_inicio" className="form-label text-muted">Fecha de Inicio</label>
                      <Flatpickr
                        value={formData.fecha_inicio}
                        onChange={([date]) => setFormData({ ...formData, fecha_inicio: formatToDDMMYYYY(date) })}
                        options={{ dateFormat: "d-m-Y" }}
                        className="form-control form-control-lg text-center shadow-sm rounded-2 mx-auto"
                        style={{
                          backgroundColor: '#fff', // Fondo blanco
                          color: '#000', // Texto negro
                          borderRadius: '4px', // Bordes redondeados
                          padding: '5px', // Espaciado interno
                          fontSize: '1rem', // Tamaño de fuente adecuado
                          width: "40%"
                        }}
                        
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="monto_objetivo" className="form-label text-muted">Monto Objetivo</label>
                      <input
                        type="number"
                        id="monto_objetivo"
                        name="monto_objetivo"
                        className="form-control form-control-lg text-center shadow-sm rounded-2 mx-auto"
                        value={formData.monto_objetivo}
                        onChange={handleChange}
                        style={{
                          backgroundColor: '#fff', // Fondo blanco
                          color: '#000', // Texto negro
                          borderRadius: '4px', // Bordes redondeados
                          padding: '5px', // Espaciado interno
                          fontSize: '1rem', // Tamaño de fuente adecuado
                          width: "40%"
                        }}
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="fecha_objetivo" className="form-label text-muted">Fecha Objetivo</label>
                      <Flatpickr
                        value={formData.fecha_objetivo}
                        onChange={([date]) => setFormData({ ...formData, fecha_objetivo: formatToDDMMYYYY(date) })}
                        options={{ dateFormat: "d-m-Y" }}
                        className="form-control form-control-lg text-center shadow-sm rounded-2 mx-auto"
                        style={{
                          backgroundColor: '#fff', // Fondo blanco
                          color: '#000', // Texto negro
                          borderRadius: '4px', // Bordes redondeados
                          padding: '10px', // Espaciado interno
                          fontSize: '1rem', // Tamaño de fuente adecuado
                          width: "40%"
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${styles.modalFooter} modal-footer border-top-0`}>
              <button type="button" style= {{width:'180px'}} className="btn btn-danger px-4" onClick={onClose}>Cerrar</button>
              <button type="submit" style= {{width:'180px'}} className="btn btn-primary px-4">Guardar Cambios</button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default EditarPlan;
