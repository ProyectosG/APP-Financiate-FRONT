import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop.jsx";
import { BackendURL } from "./component/backendURL.jsx";
import { Home } from "./pages/home.jsx";
import injectContext from "./store/appContext";

// Importar los componentes
import LandingPage from './component/LandingPage/LandingPage.jsx';  // Importar la LandingPage
import SobreNosotros from './component/LandingPage/SobreNosotros.jsx';
import Sidebar from './component/Sidebar/Sidebar.jsx';
import Login from './component/Login/Login.jsx';
import Signup from "./component/Signup/Signup.jsx";
import Egresos from "./component/Egresos/Egresos.jsx";
import Ingresos from "./component/Ingresos/Ingresos.jsx";
import Categorias from "./component/Categorias/Categorias.jsx";
import Suscripciones from "./component/Suscripciones/Suscripciones.jsx";
import PlanDeAhorro from "./component/PlanDeAhorro/PlanDeAhorro.jsx"; 
import Reportes from "./component/Reportes/Reportes.jsx"; 
import Fondo from "./component/FondoDeEmergencias/Fondo.jsx";
import Navbar from "./component/LandingPage/Navbar.jsx";

const Layout = () => {
  const BASENAME = import.meta.env.VITE_BASENAME;
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  if (!BACKEND_URL || BACKEND_URL === "") return <BackendURL />;

  return (
    <div>
      <BrowserRouter basename={BASENAME}>
        <ScrollToTop>
          <LayoutContent />
        </ScrollToTop>
      </BrowserRouter>
    </div>
  );
};

const LayoutContent = () => {
  const location = useLocation();
  const hideSidebar = location.pathname === '/' || 
                      location.pathname === '/login' || 
                      location.pathname === '/signup' || 
                      location.pathname === '/lp' || 
                      location.pathname === '/sobre-nosotros';

  return (
    <div style={{ display: 'flex', flexDirection: hideSidebar ? "column":"row" , minHeight: '100vh' }}>
      {!hideSidebar && <Sidebar />}
      {hideSidebar && <Navbar />}
      <div
        style={{
          marginLeft: hideSidebar ? '0' : '250px',
          width: hideSidebar ? '100%' : 'calc(100% - 250px)',
          transition: 'all 0.3s ease',
        }}
      >
        <Routes>
          {/* Rutas principales */}
          <Route element={<SobreNosotros />} path="/sobre-nosotros" />
          <Route element={<LandingPage />} path="/" />
          <Route element={<Login />} path="/login" />
          <Route element={<Signup />} path="/signup" />
          <Route element={<Home />} path="/Home" />
          <Route element={<Egresos />} path="/egresos" />
          <Route element={<Ingresos />} path="/Ingresos" />
          <Route element={<Categorias />} path="/categorias" />
          <Route element={<Suscripciones />} path="/Suscripciones" />
          <Route element={<PlanDeAhorro />} path="/plandeahorro" />
          <Route element={<Reportes />} path="/reportes" />
          <Route element={<Fondo />} path="/fondo" />
          <Route element={<h1>Not found!</h1>} />
        </Routes>
      </div>
    </div>
  );
};

export default injectContext(Layout);

