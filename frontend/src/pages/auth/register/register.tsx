import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { register } from '../../../services/authServices';
import './register.css';

const Register: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [rol, setRol] = useState('investigador');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(nombre, correo, contrasena, rol);
      navigate('/login'); // Redirige a la página de login después de registrarse
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
    }
  };

  return (
    <div className="form-signin vh-100 w-100 d-flex justify-content-center align-items-center">
      <div className="w-100 login">

        <ul className="nav nav-pills nav-justified mb-3" id="ex1" role="tablist">
          <li className="nav-item me-1" role="presentation">
            <Link
              className={`nav-link ${location.pathname === '/login' ? 'boton' : ''}`}
              id="tab-login"
              role="tab"
              aria-controls="pills-login"
              aria-selected={location.pathname === '/login'}
              to="/login"
            >
              Login
            </Link>
          </li>
          <li className="nav-item" role="presentation">
            <Link
              className={`nav-link ${location.pathname === '/register' ? 'boton' : ''}`}
              id="tab-register"
              role="tab"
              aria-controls="pills-register"
              aria-selected={location.pathname === '/register'}
              to="/register"
            >
              Register
            </Link>
          </li>
        </ul>

        <form onSubmit={handleSubmit}>
          <h1 className="h4 mb-3 fw-bold text-center mt-5">Registro</h1>

          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="nombre"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
            <label htmlFor="nombre">Nombre</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="correo"
              placeholder="Correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
            <label htmlFor="correo">Correo</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
              id="contrasena"
              placeholder="Contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
            <label htmlFor="contrasena">Contraseña</label>
          </div>
          <div className="form-floating mb-3">
            <select
              className="form-control"
              id="rol"
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              required
            >
              <option value="administrador">Administrador</option>
              <option value="investigador">Investigador</option>
              <option value="colaborador">Colaborador</option>
            </select>
            <label htmlFor="rol">Rol</label>
          </div>

          <button className="btn boton w-100 py-2" type="submit">Registrarse</button>
        </form>
      </div>
    </div>
  );
};

export default Register;