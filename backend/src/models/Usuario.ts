import mongoose, { Document, Schema } from 'mongoose';

export interface IUsuario extends Document {
  nombre: string;
  correo: string;
  contrasena: string;
  rol: 'administrador' | 'investigador' | 'colaborador';
  estado: boolean;
}

const usuarioSchema: Schema = new Schema({
  nombre: { type: String, required: true },
  correo: { type: String, unique: true, required: true },
  contrasena: { type: String, required: true },
  rol: { type: String, enum: ['administrador', 'investigador', 'colaborador'], required: true },
  estado: { type: Boolean, default: true }
});

export default mongoose.model<IUsuario>('Usuario', usuarioSchema);
