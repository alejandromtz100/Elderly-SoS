import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Componentes de páginas
import Login from './auth/Login';
import Register from './auth/Register';
import Inicio from './pages/inicio';
import Admin from './pages/admin';
import Navbar from './componentes/Navbar';
import NavbarAdmin from './componentes/NavAdmin';
import RegistroAdulto from './usuario/registroadulto';
import Recordatorios from './usuario/Recordatorios'; 
import Graficas from './usuario/graficas';
import ErrorBoundary from './components/ErrorBoundary';
import Mapa from './usuario/mapa';

const AppRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Rutas públicas */}
        <Route path="/" element={<Inicio />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/registroadulto" element={<RegistroAdulto />} />

        {/* Admin */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/navbar" element={<Navbar />} />
        <Route path="/navbaradmin" element={<NavbarAdmin />} />
        <Route path="/graficas" element={<Graficas />} />

        {/* Navbar Usuario */}
        <Route path="/recordatorios" element={<Recordatorios />} />
        <Route path="/mapa" element={<Mapa />} />

        {/* 🔥 FIX para eliminar warning: manejo especial de /assets/ */}
        <Route path="/assets/*" element={<Navigate to="/" replace />} />

        {/* 🔥 Wildcard para rutas no reconocidas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
    </Router>
  );
};

export default App;
