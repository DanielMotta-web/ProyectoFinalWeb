import mongoose, { Document, Schema } from 'mongoose';

export interface IEspecie extends Document {
  nombre_cientifico?: string;
  nombre_comun: string;
  familia?: string;
  cantidad_muestras: number;
  estado_planta: 'viva' | 'seca' | 'otro';
  fotografias_especies: string[];
}

const EspecieSchema: Schema = new Schema({
  nombre_cientifico: { type: String },
  nombre_comun: { type: String, required: true },
  familia: { type: String },
  cantidad_muestras: { type: Number, required: true },
  estado_planta: { type: String, enum: ['viva', 'seca', 'otro'], required: true },
  fotografias_especies: { type: [String], required: true }
});

export default mongoose.model<IEspecie>('Especie', EspecieSchema);