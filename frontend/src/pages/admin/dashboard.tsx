import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, deleteUser, createUser } from '../../services/usuarioService';
import { IUsuario } from '../../interfaces/Usuario';
import { createCategoria, getCategorias, deleteCategoria } from '../../services/categoriaServices';
import { ICategoria } from '../../interfaces/Categoria';

const AdminDashboard: React.FC = () => {
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [rol, setRol] = useState('investigador');
  const [estado, setEstado] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [nombreCategoria, setNombreCategoria] = useState('');
  const [descripcionCategoria, setDescripcionCategoria] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const usuarios = await getUsers();
        setUsuarios(usuarios);
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      }
    };

    const fetchCategorias = async () => {
      try {
        const categorias = await getCategorias();
        setCategorias(categorias);
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
      }
    };

    fetchUsuarios();
    fetchCategorias();
  }, []);

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id);
      setUsuarios(usuarios.filter((usuario: IUsuario) => usuario._id !== id));
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategoria(id);
      setCategorias(categorias.filter((categoria: ICategoria) => categoria._id !== id));
    } catch (error) {
      console.error('Error al eliminar la categoría:', error);
    }
  };

  const handleEditUser = (id: string) => {
    navigate(`/admin/edit/${id}`);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newUser = await createUser(nombre, correo, contrasena, rol) as IUsuario;
      setUsuarios([...usuarios, newUser]);
      setNombre('');
      setCorreo('');
      setContrasena('');
      setRol('investigador');
      setEstado(true);
      setShowUserModal(false);
    } catch (error) {
      console.error('Error al crear el usuario:', error);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newCategory = await createCategoria({ nombre: nombreCategoria, descripcion: descripcionCategoria } as ICategoria);
      setCategorias([...categorias, newCategory]);
      setNombreCategoria('');
      setDescripcionCategoria('');
      setShowCategoryModal(false);
    } catch (error) {
      console.error('Error al crear la categoría:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Gestión de Usuarios y Categorías</h1>
      <div className="mb-3">
        <button className="btn btn-primary me-2" onClick={() => setShowUserModal(true)}>Crear Usuario</button>
        <button className="btn btn-secondary me-2" onClick={() => setShowCategoryModal(true)}>Crear Categoría</button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario: IUsuario) => (
            <tr key={usuario._id}>
              <td>{usuario.nombre}</td>
              <td>{usuario.correo}</td>
              <td>{usuario.rol}</td>
              <td>{usuario.estado ? 'Activo' : 'Inactivo'}</td>
              <td>
                <button className="btn btn-primary me-2" onClick={() => handleEditUser(usuario._id)}>Editar</button>
                <button className="btn btn-danger" onClick={() => handleDeleteUser(usuario._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Gestión de Categorías</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((categoria: ICategoria) => (
            <tr key={categoria._id}>
              <td>{categoria.nombre}</td>
              <td>{categoria.descripcion}</td>
              <td>
                <button className="btn btn-danger" onClick={() => handleDeleteCategory(categoria._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de Crear Usuario */}
      <div className={`modal fade ${showUserModal ? 'show d-block' : ''}`} tabIndex={-1} role="dialog" style={{ backgroundColor: showUserModal ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Crear Usuario</h5>
              <button type="button" className="close" onClick={() => setShowUserModal(false)} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleCreateUser}>
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
                <button className="btn btn-primary" type="submit">Crear Usuario</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Crear Categoría */}
      <div className={`modal fade ${showCategoryModal ? 'show d-block' : ''}`} tabIndex={-1} role="dialog" style={{ backgroundColor: showCategoryModal ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Crear Categoría</h5>
              <button type="button" className="close" onClick={() => setShowCategoryModal(false)} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleCreateCategory}>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="nombreCategoria"
                    placeholder="Nombre"
                    value={nombreCategoria}
                    onChange={(e) => setNombreCategoria(e.target.value)}
                    required
                  />
                  <label htmlFor="nombreCategoria">Nombre</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="descripcionCategoria"
                    placeholder="Descripción"
                    value={descripcionCategoria}
                    onChange={(e) => setDescripcionCategoria(e.target.value)}
                  />
                  <label htmlFor="descripcionCategoria">Descripción</label>
                </div>
                <button className="btn btn-primary" type="submit">Crear Categoría</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;