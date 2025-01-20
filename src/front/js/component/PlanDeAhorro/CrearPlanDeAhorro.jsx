import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css'; // Importa el estilo de flatpickr
import styles from './CrearPlanDeAhorro.module.css'; // Importamos el CSS module

const BASENAME = import.meta.env.VITE_BASENAME;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const CrearPlanDeAhorro = ({ showModal, onClose, planToEdit, updatePlans }) => {
  const getCurrentDate = () => {
    const today = new Date();
    today.setHours(today.getHours() - today.getHours());
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  };

  const [formData, setFormData] = useState({
    nombre_plan: '',
    fecha_inicio: getCurrentDate(),
    monto_inicial: '',
    fecha_objetivo: getCurrentDate(),
    monto_objetivo: '',
    monto_acumulado: '',
  });

  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [errors, setErrors] = useState({
    monto_inicial: '',
    monto_objetivo: '',
  });

  const formatToDDMMYYYY = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatToYYYYMMDD = (dateString) => {
    const [day, month, year] = dateString.split('-');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (planToEdit) {
      setFormData({
        nombre_plan: planToEdit.nombre_plan || '',
        fecha_inicio: planToEdit.fecha_inicio ? formatToDDMMYYYY(planToEdit.fecha_inicio) : getCurrentDate(),
        monto_inicial: planToEdit.monto_inicial || '',
        fecha_objetivo: planToEdit.fecha_objetivo ? formatToDDMMYYYY(planToEdit.fecha_objetivo) : getCurrentDate(),
        monto_objetivo: planToEdit.monto_objetivo || '',
        monto_acumulado: planToEdit.monto_acumulado || '',
      });
    } else {
      setFormData({
        nombre_plan: '',
        fecha_inicio: getCurrentDate(),
        monto_inicial: '',
        fecha_objetivo: getCurrentDate(),
        monto_objetivo: '',
        monto_acumulado: '',
      });
    }
  }, [planToEdit]);

  useEffect(() => {
    const { nombre_plan, monto_inicial, monto_objetivo, fecha_objetivo, fecha_inicio } = formData;
    if (nombre_plan && monto_inicial && monto_objetivo && fecha_objetivo && fecha_inicio) {
      setIsSaveDisabled(false);
    } else {
      setIsSaveDisabled(true);
    }
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const numericValue = parseFloat(value);

    if (name === 'monto_inicial') {
      if (isNaN(numericValue) || numericValue < 0) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: 'El monto debe ser mayor/igual que 0',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: '',
        }));
      }
    }

    if (name === 'monto_objetivo') {
      if (isNaN(numericValue) || numericValue <= 0) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: 'El monto debe ser mayor que 0',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: '',
        }));
      }
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!formData.nombre_plan || !formData.monto_inicial || !formData.fecha_inicio || !formData.monto_objetivo || !formData.fecha_objetivo) {
      Swal.fire("Por favor, complete todos los campos.");
      return;
    }

    const fechaInicio = new Date(formData.fecha_inicio.split('-').reverse().join('-'));
    const fechaObjetivo = new Date(formData.fecha_objetivo.split('-').reverse().join('-'));

    if (isNaN(fechaInicio) || isNaN(fechaObjetivo)) {
      Swal.fire("Las fechas ingresadas no son válidas.");
      return;
    }

    fechaInicio.setHours(0, 0, 0, 0);
    fechaObjetivo.setHours(0, 0, 0, 0);

    const fecha_inicio_formateada = formatToYYYYMMDD(formData.fecha_inicio);
    const fecha_objetivo_formateada = formatToYYYYMMDD(formData.fecha_objetivo);

    try {
      const url = `${BACKEND_URL}/api/plandeahorro/agregarplan`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('tokenFinanciaE')}`,
        },
        body: JSON.stringify({
          ...formData,
          fecha_inicio: fecha_inicio_formateada,
          fecha_objetivo: fecha_objetivo_formateada
        }),
      });

      if (!response.ok) {
        alert("Error al guardar el plan.");
        return;
      }

      const data = await response.json();

      Swal.fire({
        title: "Plan Guardado Correctamente",
        icon: "success",
      });

      updatePlans(data.nuevo_plan);
      setFormData({
        nombre_plan: '',
        fecha_inicio: '',
        monto_inicial: '',
        fecha_objetivo: '',
        monto_objetivo: '',
        monto_acumulado: '',
      });

      onClose();
    } catch (error) {
      console.error('Error guardando el plan:', error);
      alert('Error al guardar el plan.');
    }
  };

  const handleCloseModal = () => {
    setFormData({
      nombre_plan: '',
      fecha_inicio: '',
      monto_inicial: '',
      fecha_objetivo: '',
      monto_objetivo: '',
      monto_acumulado: '',
    });
    onClose();
  };

  return (
    <div className={`${styles.modalCrearPlan} modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex="-1" aria-labelledby="planModalLabel">
      <div className={`modal-dialog ${styles.modalDialog}`}>
        <div className={`modal-content ${styles.modalContent}`}>
          <div className={`${styles.modalHeader} modal-header`}>
            <h5 className={`modal-title ${styles.modalTitle}`} id="planModalLabel">Agregar Plan</h5>
            <button type="button" className="btn-close" onClick={handleCloseModal} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label htmlFor="nombre_plan" className="form-label">Nombre del Plan</label>
                <input
                  type="text"
                  className="form-control"
                  id="nombre_plan"
                  name="nombre_plan"
                  value={formData.nombre_plan}
                  onChange={(e) => handleChange({
                    target: {
                      name: e.target.name,
                      value: e.target.value.toUpperCase() // Convierte el texto a mayúsculas
                    }
                  })}
                />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="monto_inicial" className="form-label">Monto Inicial</label>
                  <input
                    type="number"
                    className={`form-control ${styles.formControl}`}  // Aplica la clase personalizada
                    id="monto_inicial"
                    name="monto_inicial"
                    value={formData.monto_inicial}
                    onChange={handleChange}
                    style={{
                      backgroundColor: '#fff', // Fondo blanco
                      color: '#000', // Texto negro
                      borderRadius: '4px', // Bordes redondeados
                      padding: '10px', // Espaciado interno
                      fontSize: '1rem', // Tamaño de fuente adecuado
                      height: '40px',
                    }}
                  />
                  {errors.monto_inicial && <small className="text-danger">{errors.monto_inicial}</small>}
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="fecha_inicio" className="form-label">Fecha de Inicio</label>
                  <Flatpickr
                    value={formData.fecha_inicio}
                    onChange={([date]) => setFormData({
                      ...formData,
                      fecha_inicio: formatToDDMMYYYY(date)
                    })}
                    options={{
                      dateFormat: "d-m-Y",
                      minDate: "today" // Evitar fechas pasadas
                    }}
                    className="form-control w-100 text-center"
                    style={{
                      backgroundColor: '#fff', // Fondo blanco
                      color: '#000', // Texto negro
                      borderRadius: '4px', // Bordes redondeados
                      padding: '10px', // Espaciado interno
                      fontSize: '1rem', // Tamaño de fuente adecuado
                    }}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="monto_objetivo" className="form-label">Monto Objetivo</label>
                  <input
                    type="number"
                    className="form-control"
                    id="monto_objetivo"
                    name="monto_objetivo"
                    value={formData.monto_objetivo}
                    onChange={handleChange}
                    style={{
                      backgroundColor: '#fff', // Fondo blanco
                      color: '#000', // Texto negro
                      borderRadius: '4px', // Bordes redondeados
                      padding: '10px', // Espaciado interno
                      fontSize: '1rem', // Tamaño de fuente adecuado
                      height: '40px',
                    }}
                  
                  />
                  {errors.monto_objetivo && <small className="text-danger">{errors.monto_objetivo}</small>}
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="fecha_objetivo" className="form-label">Fecha de Objetivo</label>
                  <Flatpickr
                    value={formData.fecha_objetivo}
                    onChange={([date]) => setFormData({
                      ...formData,
                      fecha_objetivo: formatToDDMMYYYY(date)
                    })}
                    options={{
                      dateFormat: "d-m-Y"
                    }}
                    className="form-control w-100 text-center"  
                    style={{
                      backgroundColor: '#fff', // Fondo blanco
                      color: '#000', // Texto negro
                      borderRadius: '4px', // Bordes redondeados
                      padding: '10px', // Espaciado interno
                      fontSize: '1rem', // Tamaño de fuente adecuado
                      height: '40px',
                    }}
                  />
                </div>
              </div>
            </form>
          </div>
          <div className={`modal-footer ${styles.modalFooter}`}>
            <button type="button" className="btn btn-danger" style= {{width:'180px'}} onClick={handleCloseModal}>Cerrar</button>
            <button type="button" className="btn btn-success" style= {{width:'180px'}} onClick={handleSave} disabled={isSaveDisabled}>Guardar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearPlanDeAhorro;
