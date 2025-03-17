import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom'; // Importar NavLink
import { useNavigate } from 'react-router-dom';
import { Button, Form, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import logoFinanciaUrl from "../../../img/LogoFinancia.png";
import agregarUsuario from "../../../img/agregarUsuario.gif";
import styles from './Signup.module.css'; // Importar CSS como un módulo

const BASENAME = import.meta.env.VITE_BASENAME;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Signup = () => {
  const [nombre_usuario, setNombre_usuario] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  console.log(BACKEND_URL)
    // UseEffect para desplazar hacia el top al cargar la página
    useEffect(() => {
      window.scrollTo(0, 0); // Desplaza la página hacia arriba
    }, []); // Se ejecuta solo una vez cuando el componente se monta

  const validateForm = () => {
    const errors = {};
    if (contrasena.length < 8) {
      errors.contrasena = 'La contraseña debe tener al menos 8 caracteres.';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(BACKEND_URL + "/usuarios/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre_usuario, correo, contrasena }),
    });
    const data = await response.json();

    if (response.ok) {
      navigate("/login"); // Redirigir a la página de inicio de sesión
    } else {
      alert("Error al registrarse");
    }

    console.log('Registro exitoso:');
  };

  return (
    <div className={styles.bgGradient}>
      <Container fluid className="d-flex justify-content-center align-items-center min-vh-100">
        <div className={`${styles.signUpForm} p-5 shadow-lg bg-white`}>
          <div className={`text-center mb-4 ${styles.logoContainer}`}>
            <div className ={styles.containerLogoF}>
              <img
                src={logoFinanciaUrl}
                alt="Logo Financia"
                className={styles.logoF}
                style={{ maxHeight: '50px', width: '100%' }}
              />
            </div>
            <img
              src={agregarUsuario}
              alt="Logo Financia"
              className={styles.logoU}
              style={{ maxHeight: '50px', width: '100%' }}
            />
          </div>
          {/* <h2 className="text-center mb-5">Sign Up</h2> */}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicUsername" className="mb-4">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa tu nombre de usuario"
                value={nombre_usuario}
                onChange={(e) => setNombre_usuario(e.target.value)}
              />
            </Form.Group>

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
                placeholder="contraseña (maximo 8 caracteres)"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
              />
              {errors.contrasena && (
                <Form.Text className="text-danger">{errors.contrasena}</Form.Text>
              )}
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Sign Up
            </Button>
          </Form>
          <div className="text-center mt-4">
            ¿Ya tienes una cuenta?
            <NavLink to="/login" className="btn btn-link">
              Login
            </NavLink>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Signup;
