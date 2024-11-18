import axios from 'axios';
import { IBitacora } from '../interfaces/Bitacora';

const API_URL = 'http://localhost:3000/api/bitacoras';

export const createBitacora = async (data: IBitacora): Promise<IBitacora> => {
  const response = await axios.post(API_URL, data);
  return response.data as IBitacora;
};

export const getBitacoras = async (): Promise<IBitacora[]> => {
  const response = await axios.get(API_URL);
  return response.data as IBitacora[];
};

export const getBitacora = async (id: string): Promise<IBitacora> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data as IBitacora;
};

export const updateBitacora = async (id: string, data: IBitacora): Promise<IBitacora> => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data as IBitacora;
};

export const deleteBitacora = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};