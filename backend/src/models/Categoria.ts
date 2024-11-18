import mongoose, { Document, Schema } from 'mongoose';

export interface ICategoria extends Document {
  nombre: string;
  descripcion?: string;
}

const CategoriaSchema: Schema = new Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
});

export default mongoose.model<ICategoria>('Categoria', CategoriaSchema);