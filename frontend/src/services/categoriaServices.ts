import axios from 'axios';
import { ICategoria } from '../interfaces/Categoria';

const API_URL = 'http://localhost:3000/api/categorias';

export const createCategoria = async (categoria: ICategoria): Promise<ICategoria> => {
  const response = await axios.post<ICategoria>(API_URL, categoria);
  return response.data;
};

export const getCategorias = async (): Promise<ICategoria[]> => {
  const response = await axios.get<ICategoria[]>(API_URL);
  return response.data;
};

export const updateCategoria = async (id: string, categoria: ICategoria): Promise<ICategoria> => {
  const response = await axios.put<ICategoria>(`${API_URL}/${id}`, categoria);
  return response.data;
};

export const deleteCategoria = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};