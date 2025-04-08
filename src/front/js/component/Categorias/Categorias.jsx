import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaTrash } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import ModalAgregarCategoria from './ModalAgregarCategoria.jsx';
import styles from './Categorias.module.css';

const BASENAME = import.meta.env.VITE_BASENAME;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [refreshCategories, setRefreshCategories] = useState(false);
  const navigate = useNavigate();

  // Función para cargar categorías desde la API
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const token = localStorage.getItem('tokenFinanciaE');
        if (!token) throw new Error('Token no disponible');
        
        const response = await fetch(`${BACKEND_URL}/api/categorias/traertodas`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json();  // Captura el cuerpo del error
          throw new Error(`Error al obtener las categorías: ${errorData.msg || response.statusText}`);
        }

        const result = await response.json();
        console.log(result)
        setCategorias(result);
      } catch (error) {
        console.error('Error:', error.message);
      }f
    };
    fetchCategorias();
  }, [refreshCategories]);

  // Función para eliminar una categoría
  const deleteCategory = async (categoryId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/categorias/categoria`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('tokenFinanciaE')}`,
        },
        body: JSON.stringify({ id: categoryId }),
      });

      if (!response.ok) throw new Error('Error al eliminar la categoría');
      setCategorias((prev) => prev.filter((cat) => cat.id !== categoryId));
      Swal.fire('Éxito', 'Categoría eliminada', 'success');
    } catch (error) {
      console.error('Error:', error.message);
      Swal.fire('Error', 'No se pudo eliminar la categoría', 'error');
    }
  };

  // Función para eliminar todas las categorías
  const deleteAllCategories = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/categorias/eliminartodas`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('tokenFinanciaE')}`,
        },
      });

      if (!response.ok) throw new Error('Error al eliminar todas las categorías');
      setRefreshCategories(true);
      Swal.fire('Éxito', 'Todas las categorías fueron eliminadas', 'success');
    } catch (error) {
      console.error('Error:', error.message);
      Swal.fire('Error', 'No se pudieron eliminar todas las categorías', 'error');
    }
  };

  return (
    <div className="container text-center d-flex flex-column align-items-center justify-content-center min-vh-100">
      <h2>Gestión de Categorías</h2>
      
      {/* Tabla de Categorías */}
      <div className="table-responsive" style={{ width: '80%', maxHeight: '400px', overflowY: 'auto' }}>
        <table className="table table-hover table-striped table-bordered mt-3">
          <thead>
            <tr>
              <th className={`${styles.predeterminadas} d-flex justify-content-evenly`}>
                <span className= {styles.spanNombre}>Nombre</span>
                <span>⭐ = Predeterminadas</span>
              </th>

              <th>Icono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id}>
                <td>{categoria.nombre}{categoria.is_default && ' ⭐'}</td>
                <td>{categoria.icono}</td>
                <td>
                  <div className={styles.btnTooltipContainer}>
                    <button
                      className={`btn ${categoria.is_default ? "btn-secondary" : "btn-danger"}`}
                      aria-disabled={categoria.is_default ? "true" : "false"}
                      onClick={() => deleteCategory(categoria.id)}
                      disabled={categoria.is_default}
                    >
                      <FaTrash className={categoria.is_default ? "text-muted" : ""} />
                    </button>

                    {categoria.is_default && (
                      <span className={styles.tooltip}>
                        Imposible Eliminar Categorías Predeterminadas
                      </span>
                    )}
                  </div>
                </td>


              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botones */}
      <div className="d-flex gap-3 mt-4">
        <button className="btn btn-outline-danger w-100" onClick={deleteAllCategories}>
          Eliminar Todas
        </button>
        <button className="btn btn-outline-primary w-100" onClick={() => setShowModal(true)}>
          Agregar Categoría
        </button>
        <button className="btn btn-outline-dark w-100" onClick={() => navigate('/Home')}>
          Cerrar
        </button>
      </div>

      {/* Modal */}
      {showModal && <ModalAgregarCategoria setShowModal={setShowModal} setRefreshCategories={setRefreshCategories} />}
    </div>
  );
};

export default Categorias;
