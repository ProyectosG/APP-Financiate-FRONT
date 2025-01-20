import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../store/appContext';
import './Egresos.css';

const BASENAME = import.meta.env.VITE_BASENAME;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function Egresos() {
  const { store } = useContext(Context);
  const [egreso, setEgreso] = useState({
    description: "",
    category: "",
    amount: 0,
    fecha: "",
  });

  const [categorias, setCategorias] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(true);

  const navigate = useNavigate();

  //traemos todas las categorias para listarlas despues
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/categorias/traertodas`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('tokenFinanciaE')}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener las categorías");
        }
        const data = await response.json();
        setCategorias(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchCategorias();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEgreso((prevEgreso) => ({ ...prevEgreso, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { amount, description, fecha, category } = egreso;
    const usuario_id = store.usuario_id;

    try {
      const response = await fetch(`${BACKEND_URL}/api/egresos/agrega_egreso`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('tokenFinanciaE')}`,
        },
        body: JSON.stringify({
          monto: amount,
          descripcion: description,
          fecha,
          usuario_id,
          categoria_id: category,
        }),
      });

      if (response.ok) {
        navigate("/Home");
      } else {
        alert("Error al registrar el egreso");
      }
    } catch (error) {
      console.error("Error al enviar el egreso:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate('/Home');
  };

  return (
    <div>
      {isModalOpen && (
        <div className="modal-egreso">
          <div className="modal-contenido-egreso">
            <h2 className="fw-bold modal-titulo-egreso">EGRESOS</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label htmlFor="description">Razón del egreso:</label>
                <input
                  type="text"
                  name="description"
                  value={egreso.description}
                  onChange={handleChange}
                  placeholder="Escribe la razón del egreso"
                  required
                />
              </div>

              <div className="form-contenedor-egreso">
                <div className="left-column">
                  <div className="form-field">
                    <label htmlFor="amount">Monto:</label>
                    <input
                      type="number"
                      name="amount"
                      value={egreso.amount}
                      onChange={handleChange}
                      placeholder="Ingresa monto"
                      required
                    />
                  </div>

                  <div className="form-field-egreso">
                    <label htmlFor="category">Categoría:</label>
                    <select
                      name="category"
                      value={egreso.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecciona una categoría</option>
                      {categorias.map((categoria) => (
                        <option key={categoria.id} value={categoria.id}>
                          {categoria.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="right-column">
                  <div className="form-field">
                    <label htmlFor="fecha">Fecha:</label>
                    <input
                      type="date"
                      name="fecha"
                      value={egreso.fecha}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-field buttons-container">
                <button type="submit" className="modal-b fw-bold registrar-button">
                  REGISTRAR
                </button>
                <button type="button" className="modal-b close-button" onClick={handleCloseModal}>
                  CERRAR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Egresos;


