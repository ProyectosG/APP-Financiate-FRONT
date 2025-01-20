import React, { useState } from 'react';
import Swal from 'sweetalert2';
import styles from './ModalAgregarCategorias.module.css';

const BASENAME = import.meta.env.VITE_BASENAME;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ModalAgregarCategoria = ({ setShowModal, setRefreshCategories }) => {
  const [newCategory, setNewCategory] = useState({ nombre: '', icono: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });
  };

  const addCategory = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/categorias/categoria`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('tokenFinanciaE')}`,
        },
        body: JSON.stringify(newCategory),
      });

      if (!response.ok) throw new Error('Error al crear la categoría');
      setRefreshCategories((prev) => !prev);
      setShowModal(false);
      Swal.fire('Éxito', 'Categoría creada', 'success');
    } catch (error) {
      console.error('Error:', error.message);
      Swal.fire('Error', 'No se pudo crear la categoría', 'error');
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h5>Agregar Categoría</h5>
        <input
          type="text"
          className="form-control my-2"
          name="nombre"
          placeholder="Nombre"
          value={newCategory.nombre}
          onChange={handleInputChange}
        />
        <input
          type="text"
          className="form-control my-2"
          name="icono"
          placeholder="Icono (emoji)"
          value={newCategory.icono}
          onChange={handleInputChange}
        />
        <div className="d-flex gap-2">
          <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </button>
          <button className="btn btn-success" onClick={addCategory}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAgregarCategoria;
