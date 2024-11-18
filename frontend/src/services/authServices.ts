import axios from 'axios';

const API_URL = 'http://localhost:3000/api/usuarios';

export const register = async (nombre: string, correo: string, contrasena: string, rol: string) => {
  const response = await axios.post(`${API_URL}/register`, { nombre, correo, contrasena, rol });
  return response.data;
};

export const login = async (correo: string, contrasena: string) => {
  const response = await axios.post(`${API_URL}/login`, { correo, contrasena });
  return response.data;
};