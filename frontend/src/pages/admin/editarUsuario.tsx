import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUser, updateUser } from '../../services/usuarioService';
import { Usuario } from '../../interfaces/Usuario';

const EditarUsuario: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [rol, setRol] = useState('investigador');
  const [estado, setEstado] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const usuario = await getUser(id!) as Usuario;
        setNombre(usuario.nombre);
        setCorreo(usuario.correo);
        setRol(usuario.rol);
        setEstado(usuario.estado);
      } catch (error) {
        console.error('Error al obtener el usuario:', error);
      }
    };

    fetchUsuario();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser(id!, { _id: id!, nombre, correo, rol, estado });
      navigate('/admin');
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Editar Usuario</h1>
      <form onSubmit={handleSubmit}>
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
        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            id="estado"
            checked={estado}
            onChange={(e) => setEstado(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="estado">Activo</label>
        </div>
        <button className="btn btn-primary" type="submit">Guardar</button>
      </form>
    </div>
  );
};

export default EditarUsuario;