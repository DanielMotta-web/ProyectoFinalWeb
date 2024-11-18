import mongoose, { Document, Schema } from 'mongoose';
import { IEspecie } from './Especie';
import { IUsuario } from './Usuario';
import { ICategoria } from './Categoria';

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

const BitacoraSchema: Schema = new Schema({
  titulo: { type: String, required: true },
  fecha_y_hora: { type: Date, required: true },
  localizacion_geografica: {
    latitud: { type: Number, required: true },
    longitud: { type: Number, required: true }
  },
  condiciones_climaticas: { type: String },
  descripcion_habitat: { type: String },
  fotografias: { type: [String], required: true },
  detalles_especies: { type: [Schema.Types.Mixed], required: true },
  observaciones_adicionales: { type: String },
  autor: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  categoria: { type: Schema.Types.ObjectId, ref: 'Categoria', required: true }, 
  notas_adicionales: { type: String },
  nota_visible: { type: Boolean, default: false }
});

export default mongoose.model<IBitacora>('Bitacora', BitacoraSchema);