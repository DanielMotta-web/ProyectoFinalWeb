import { ICategoria } from './Categoria';
import {IEspecie} from './Especie';
import { IUsuario } from './Usuario';

export interface IBitacora {
    _id?: string;
    titulo: string;
    fecha_y_hora: Date;
    localizacion_geografica: {
      latitud: number;
      longitud: number;
    };
    condiciones_climaticas?: string;
    descripcion_habitat?: string;
    fotografias: string[];
    detalles_especies: IEspecie[];
    observaciones_adicionales?: string;
    autor: IUsuario['_id'];
    categoria: ICategoria['_id'];
    notas_adicionales?: string;
    nota_visible?: boolean;
  }