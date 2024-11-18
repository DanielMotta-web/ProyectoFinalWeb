import axios from 'axios';
import { IComentario } from '../interfaces/Comentario';

const API_URL = 'http://localhost:3000/api/comentarios';

export const getComentarios = async (bitacoraId: string): Promise<IComentario[]> => {
  const response = await axios.get<IComentario[]>(`${API_URL}/bitacora/${bitacoraId}/comentarios`);
  return response.data;
};

export const createComentario = async (bitacoraId: string, comentario: { contenido: string, autor: string }): Promise<IComentario> => {
  const response = await axios.post<IComentario>(`${API_URL}/bitacora/${bitacoraId}/comentarios`, comentario);
  return response.data;
};

export const deleteComentario = async (comentarioId: string): Promise<void> => {
  await axios.delete(`${API_URL}/${comentarioId}`);
};