import React, { useState, useContext, useEffect } from 'react';
import { format } from 'date-fns';
import { Context } from '../../store/appContext';

const BASENAME = import.meta.env.VITE_BASENAME;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Reportes = () => {
  const [reportes, setReportes] = useState([]);
  const { store, actions } = useContext(Context);
  const usuario_id = store.usuario_id;

  const fetchReportes = async () => {
    if (!usuario_id) {
      console.error("usuario_id no está disponible");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/usuarios/reportes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('tokenFinanciaE')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReportes(data);
      } else {
        console.error("Error al obtener reportes");
      }
    } catch (error) {
      console.error("Error en fetch:", error);
    }
  };

  useEffect(() => {
    fetchReportes();
  }, [usuario_id]);

  return (
    <div className="container text-center">
      <h2 style={{ marginBottom: "20px" }}>Reportes</h2>

      <div className="table-responsive" style={{ width: '100%', maxHeight: '400px', overflowY: 'auto' }}>
        <table className="table table-striped table-bordered mx-auto" style={{ width: '80%' }}>
          <thead>
            <tr>
              <th>Ingreso/Egreso</th>
              <th>Monto</th>
              <th>Descripción</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {reportes
              .slice()
              .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
              .map((reporte) => (
                <tr
                  key={`${reporte.tipo}-${reporte.id}`}
                  style={{
                    backgroundColor: "white",
                    borderLeft: `5px solid ${reporte.tipo === "ingreso" ? "green" : "red"}`,
                  }}
                >
                  <td>{reporte.tipo.toUpperCase()}</td>
                  <td>${reporte.monto.toFixed(2)}</td>
                  <td>{reporte.descripcion}</td>
                  <td>{new Date(reporte.fecha).toISOString().split('T')[0]}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reportes;


