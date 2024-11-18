import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/auth/register/register';
import Login from './pages/auth/login/login';
import Inicio from './pages/inicio/inicio';
import AdminDashboard from './pages/admin/dashboard';
import EditarUsuario from './pages/admin/editarUsuario';
import CrearBitacora from './pages/bitacora/crear-bitacora';
import EditarBitacora from './pages/bitacora/editar';
import DetalleBitacora from './pages/bitacora/detalle';
import TestMapa from './components/mapa/test';
import ProtectedRoute from './components/ProtegerRutas';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'azure-maps-control/dist/atlas.min.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inicio" element={<ProtectedRoute><Inicio /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute roles={['administrador']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/edit/:id" element={<ProtectedRoute roles={['administrador']}><EditarUsuario /></ProtectedRoute>} />
        <Route path="/crear-bitacora" element={<ProtectedRoute roles={['investigador', 'administrador']}><CrearBitacora /></ProtectedRoute>} />
        <Route path="/editar-bitacora/:id" element={<ProtectedRoute roles={['investigador', 'administrador']}><EditarBitacora /></ProtectedRoute>} />
        <Route path="/bitacora/:id" element={<ProtectedRoute><DetalleBitacora /></ProtectedRoute>} />
        <Route path="/test" element={<TestMapa />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;