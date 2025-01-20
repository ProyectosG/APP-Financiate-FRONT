import React from "react";
// Cambiar la importación de `react-dom` a `react-dom/client`
import ReactDOM from "react-dom/client"; 
import Layout from "./front/js/layout"; // Ruta correcta al componente
import "bootstrap/dist/css/bootstrap.min.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Layout />);
