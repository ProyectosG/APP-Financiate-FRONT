import React, { useState, useEffect } from 'react';
import styles from './RegistrarAhorro.module.css';
import Swal from 'sweetalert2';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css';
import moment from 'moment'; // Importamos moment.js para trabajar con fechas

const BASENAME = import.meta.env.VITE_BASENAME;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const RegistrarAhorro = ({ plan, onClose }) => {
  const [monto_ahorro, setMonto_ahorro] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [descripcion, setDescripcion] = useState('Depósito al plan de ahorro.');
  const [error, setError] = useState('');
  const [errorMonto, setErrorMonto] = useState('');
  const [capitalActual, setCapitalActual] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const getCurrentDate = () => moment().startOf('day').format('DD-MM-YYYY');
  const formatToDDMMYYYY = (dateString) => moment(dateString).format('DD-MM-YYYY');
  const formatToYYYYMMDD = (dateString) => moment(dateString, 'DD-MM-YYYY').format('YYYY-MM-DD');

  useEffect(() => {
    setFecha(getCurrentDate());
    const fetchCapitalAndPlans = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/plandeahorro/traerplan`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${localStorage.getItem('tokenFinanciaE')}` },
        });
        const data = await response.json();
        if (data.capital_actual) setCapitalActual(data.capital_actual);
      } catch (error) {
        console.error('Error fetching capital and plans:', error);
      }
    };
    fetchCapitalAndPlans();
  }, []);

  const validateMonto = (monto) => {
    const montoValue = parseFloat(monto);
    if (isNaN(montoValue) || montoValue <= 0) {
      setErrorMonto('El monto debe ser mayor que 0');
      setIsButtonDisabled(true);
    } else if (montoValue > capitalActual) {
      setErrorMonto(`El monto no puede ser mayor que el capital actual (${capitalActual})`);
      setIsButtonDisabled(true);
    } else {
      setErrorMonto('');
      setIsButtonDisabled(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (monto_ahorro <= 0 || !monto_ahorro || !fecha) {
      setError('El monto de ahorro y la fecha son requeridos');
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/plandeahorro/depositar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('tokenFinanciaE')}`,
        },
        body: JSON.stringify({
          plan_id: plan.id,
          nombre_plan: plan.nombre_plan,
          monto_ahorro,
          descripcion,
          fecha: formatToYYYYMMDD(fecha),
        }),
      });

      if (!response.ok) throw new Error('Error al registrar el depósito');
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Depósito registrado con éxito',
        confirmButtonText: 'Aceptar',
      }).then(onClose);
    } catch (error) {
      console.error('Error submitting deposit:', error);
      setError('Error al registrar el depósito');
    }
  };

  return (
    <div className={`${styles.modalRegistrarAhorro} modal fade show`} style={{ display: 'block' }} aria-hidden="false">
      <div className={styles.modalDialog}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h5 className={styles.modalTitle}>Registrar Ahorro</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            {plan ? (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className={`${styles.formLabel}`}>Nombre del Plan</label>
                  <input type="text" 
                    className="form-control" 
                    value={plan.nombre_plan} 
                    disabled 
                    style={{
                      background: "linear-gradient(to right, #add8e6,rgba(0, 0, 139, 0.41))", // Azul bajito (#add8e6) a azul fuerte (#00008b)
                      color: '#000', // Texto negro
                      borderRadius: '4px', // Bordes redondeados
                      padding: '10px', // Espaciado interno
                      fontSize: '1rem', // Tamaño de fuente adecuado
                      textAlign: 'center',
                    }}
                  />
                </div>
                <div className="mb-3 d-flex flex-column justify-content-center align-items-center">
                  <label className={`${styles.formLabel}`}>Monto a Depositar</label>
                  <input
                    type="number"
                    className="form-control"
                    value={monto_ahorro}
                    onChange={(e) => {
                      setMonto_ahorro(e.target.value);
                      validateMonto(e.target.value);
                      
                    }}
                    style = {{width:'40%'}}
                  />
                  {errorMonto && <small className="text-danger">{errorMonto}</small>}
                </div>
                <div className="mb-3 d-flex flex-column justify-content-center align-items-center">
                  <label className={`${styles.formLabel}`}>Fecha del Ahorro</label>
                  <Flatpickr
                    value={fecha}
                    onChange={([date]) => setFecha(formatToDDMMYYYY(date))}
                    options={{ dateFormat: 'd-m-Y' }}
                    className="form-control"
                    style={{
                      backgroundColor: '#fff', // Fondo blanco
                      color: '#000', // Texto negro
                      borderRadius: '4px', // Bordes redondeados
                      padding: '10px', // Espaciado interno
                      fontSize: '1rem', // Tamaño de fuente adecuado
                      width:'40%',
                      textAlign:'center',
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label className={`${styles.formLabel}`}>Descripción</label>
                  <textarea
                    className="form-control"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                  />
                </div>
                <div className={`${styles.modalFooter}`}>
                  <button type="button" className="btn btn-danger" style= {{width:'180px'}} onClick={onClose}>
                    Cerrar
                  </button>
                  <button type="submit" className="btn btn-success" style= {{width:'180px'}} disabled={isButtonDisabled}>
                    Registrar
                  </button>
                </div>
              </form>
            ) : (
              <p>Cargando detalles del plan...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrarAhorro;
