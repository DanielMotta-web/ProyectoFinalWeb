/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getComentarios, createComentario, deleteComentario } from '../../services/comentarioServices';
import { IComentario } from '../../interfaces/Comentario';
import { IUsuario } from '../../interfaces/Usuario';
import {jwtDecode} from 'jwt-decode';
import { getUser } from '../../services/usuarioService';

const Comentarios: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [comentarios, setComentarios] = useState<IComentario[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [usuario, setUsuario] = useState<IUsuario | null>(null);

  useEffect(() => {
    const fetchComentarios = async () => {
      const data = await getComentarios(id!);
      setComentarios(data);
    };

    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decoded: any = jwtDecode(token);
          const userId = decoded.id;
          const user = await getUser(userId);
          setUsuario(user);
        }
      } catch (error) {
        console.error('Error al obtener el usuario actual:', error);
      }
    };

    fetchComentarios();
    fetchCurrentUser();
  }, [id]);

  const handleCreateComentario = async () => {
    if (nuevoComentario.trim() && usuario) {
      const comentario = await createComentario(id!, { contenido: nuevoComentario, autor: usuario._id });
      const comentarioCompleto = {
        ...comentario,
        autor: {
          _id: usuario._id,
          nombre: usuario.nombre,
          correo: usuario.correo,
          rol: usuario.rol,
          estado: usuario.estado
        }
      };
      setComentarios([...comentarios, comentarioCompleto]);
      setNuevoComentario('');
    }
  };

  const handleDeleteComentario = async (comentarioId: string) => {
    await deleteComentario(comentarioId);
    setComentarios(comentarios.filter(comentario => comentario._id !== comentarioId));
  };

  return (
    <div className="container mt-4">
      <h3>Comentarios</h3>
      <div className="list-group mb-4">
        {comentarios.map(comentario => (
          <div key={comentario._id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
            <div>
              <p className="mb-1"><strong>{comentario.autor.nombre}</strong>: {comentario.contenido}</p>
            </div>
            {usuario && usuario._id === comentario.autor._id && (
              <button className="btn btn-danger btn-sm" onClick={() => handleDeleteComentario(comentario._id)}>Eliminar</button>
            )}
          </div>
        ))}
      </div>
      <div className="mb-3">
        <textarea
          className="form-control"
          value={nuevoComentario}
          onChange={(e) => setNuevoComentario(e.target.value)}
          placeholder="Escribe un comentario..."
        />
      </div>
      <button className="btn btn-primary" onClick={handleCreateComentario}>Comentar</button>
    </div>
  );
};

export default Comentarios;