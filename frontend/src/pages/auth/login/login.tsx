import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { login } from '../../../services/authServices';
import './login.css';

const Login: React.FC = () => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token: string = await login(correo, contrasena) as string;
      localStorage.setItem('token', token);
      navigate('/inicio'); // Redirige a la página de inicio después de iniciar sesión
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
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
          <h1 className="h4 mb-3 fw-bold text-center mt-5">Iniciar sesión</h1>

          <div className="form-floating">
            <input
              type="text"
              className="form-control email"
              id="floatingInput"
              placeholder="name@example.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
            <label htmlFor="floatingInput">Correo</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control password"
              id="floatingPassword"
              placeholder="Password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
            <label htmlFor="floatingPassword">Contraseña</label>
          </div>

          <button className="btn boton w-100 py-2" type="submit">Sign in</button>
        </form>
      </div>
    </div>
  );
};

export default Login;