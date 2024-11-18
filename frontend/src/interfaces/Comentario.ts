import { IUsuario } from './Usuario';

export interface IComentario {
  _id: string;
  contenido: string;
  autor: IUsuario;
  bitacora: string;
  fecha: Date;
}