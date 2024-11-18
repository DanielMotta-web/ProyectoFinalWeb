import axios from 'axios';
import { IUsuario } from '../interfaces/Usuario';

const API_URL = 'http://localhost:3000/api/usuarios';

export const getUser = async (id: string) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data as IUsuario;
};

export const updateUser = async (id: string, data: IUsuario) => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export const getUsers = async (): Promise<IUsuario[]> => {
    const response = await axios.get<IUsuario[]>(`${API_URL}`);
    return response.data;
};

export const createUser = async (nombre: string, correo: string, contrasena: string, rol: string) => {
  const response = await axios.post(`${API_URL}/register`, { nombre, correo, contrasena, rol });
  return response.data;
};