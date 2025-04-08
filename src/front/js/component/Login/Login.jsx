import React, { useState, useContext, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../store/appContext';
import { Container, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Login.module.css';

import logoFinanciaUrl from "../../../img/LogoFinancia.png";

const iconoSignup =
  "https://png.pngtree.com/png-clipart/20230918/original/pngtree-flat-style-sign-up-icon-with-finger-cursor-on-white-vector-png-image_12377125.png";


  const monedas = [
    ["USD", "Dólar estadounidense"],
    ["CAD", "Dólar canadiense"],
    ["MXN", "Peso mexicano"],
    ["BRL", "Real brasileño"],
    ["ARS", "Peso argentino"],
    ["COP", "Peso colombiano"],
    ["PEN", "Nuevo sol peruano"],
    ["CLP", "Peso chileno"],
    ["UYU", "Peso uruguayo"],
    ["VES", "Soberano venezolano"]
  ];

const BASENAME = import.meta.env.VITE_BASENAME;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Login = () => {
  const [id, setId] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [capital_inicial, setCapital_inicial] = useState('');
  const [moneda, setMoneda] = useState('');
  const navigate = useNavigate();
  const { store, actions } = useContext(Context);
  const isMounted = useRef(true);
  const [errors, setErrors] = useState({ capital_inicial: '' });

  // UseEffect para desplazar hacia el top al cargar la página
  useEffect(() => {
    window.scrollTo(0, 0); // Desplaza la página hacia arriba
  }, []); // Se ejecuta solo una vez cuando el componente se monta

  useEffect(() => {
     const fetchCategorias = async () => {
       try {
         const response = await fetch(`${BACKEND_URL}/api/categorias/default`, {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
           },
         });

         if (!response.ok) {
           const errorText = await response.text();
           throw new Error('Error al obtener las categorías');
         }

         const result = await response.json();
         console.log("RESULT ES IGUAL A EN EL FRONT...",result)
       } catch (error) {
         console.error('Error:', error.message);
         if (error.message.includes("Token")) {
           actions.logout();
         }
       }
     };

     fetchCategorias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(BACKEND_URL + "/api/usuarios/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, contrasena }),
    });

    const data = await response.json();
    console.log(data)

    if (response.ok && data.token) {
      actions.setToken(data.token);
      actions.setCorreo(correo);
      actions.setUsuarioId(data.usuario.id);
      actions.setNombreUsuario(data.usuario.nombre_usuario);
      setId(data.usuario.id);

      if (data.usuario.capital_inicial === null || data.usuario.moneda === null) {
        if (isMounted.current) {
          setShowModal(true);
        }
      } else {
        if (isMounted.current) {
          navigate("/Home");
        }
      }
    } else {
      alert("Error al iniciar sesión");
    }
  };

  const handleModalSubmit = async () => {
    console.log("Datos a enviar:", { correo, capital_inicial, moneda });
    const response = await fetch(BACKEND_URL + "/api/usuarios/config-inicial", {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${store.token}`,
      },
      body: JSON.stringify({ correo, capital_inicial: parseFloat(capital_inicial), moneda })

    });

    const data = await response.json();
    console.log("en liniea 121 de front  en await response.json(); me sale esto",data)
  
    if (response.ok) {
      if (isMounted.current) {
        navigate("/Home");
      }
    } else {
      alert("Error al actualizar los datos financieros");
    }

    if (isMounted.current) {
      setShowModal(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericValue = parseFloat(value);

    if (name === 'capital_inicial') {
      setCapital_inicial(value);

      if (isNaN(numericValue) || numericValue < 0) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: 'El monto debe ser mayor o igual que 0',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: '',
        }));
      }
    }
  };

  return (
    <div className={`${styles.bgGradient} pt-4 pb-4`}> {/* Agregando márgenes superiores e inferiores */}
      <Container fluid className="d-flex justify-content-center align-items-center min-vh-100">
        <div className={`${styles.loginForm} p-5 shadow-lg animate__animated animate__zoomIn bg-white`}>
          <div className={`${styles.logoContainer} text-center mb-4`}>
            <img
              src={logoFinanciaUrl}
              alt="Logo Financia"
              style={{ maxHeight: '50px', width: '100%' }}
            />
          </div>
          <h2 className="text-center mb-3">Login</h2>

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail" className="mb-4">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingresa tu email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword" className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingresa tu Contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 animate__animated animate__pulse">
              Login
            </Button>
          </Form>

          <div className="text-center mt-4">
            ¿Aún no tienes una cuenta?
            <NavLink to="/signup" className="btn btn-link">
              <img src={iconoSignup} className={styles.iconoSignup} alt="Signup" />
            </NavLink>
          </div>
        </div>
      </Container>
      

      {/* Modal */}
      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        style={{ display: showModal ? "block" : "none" }}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="financialConfigModal"
        aria-hidden={!showModal}
      >
        <div className={`${styles.modalDialog}`} role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="financialConfigModal">
                Configuración Financiera Inicial
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="row">
                  <div className="col-12 mb-4 d-flex flex-column justify-content-center align-items-center">
                    <label htmlFor="formCapital" className="form-label">Capital Inicial</label>
                    <input
                      type="number"
                      className={`form-control ${styles.inputCapitalInicial}`}  
                      id="formCapital"
                      name="capital_inicial"
                      placeholder="$"
                      value={capital_inicial}
                      onChange={handleChange}
                    />
                    {errors.capital_inicial && <small className="text-danger">{errors.capital_inicial}</small>}
                  </div>

                  <div className="col-12 mb-4 d-flex flex-column justify-content-center align-items-center">
                    <label htmlFor="formMoneda" className="form-label">Moneda</label>
                    <select
                      className={`form-select ${styles.selectMoneda}`}
                      id="formMoneda"
                      value={moneda}
                      onChange={(e) => setMoneda(e.target.value)}
                    >
                      <option value="">Selecciona tu moneda</option>
                      {monedas.map(([abreviatura, nombre]) => (
                        <option key={abreviatura} value={abreviatura}>
                          {nombre} ({abreviatura})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="modal-footer m-2 d-flex justify-content-center align-items-center">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleModalSubmit}
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
       
    </div>
    
  );
};

export default Login;
