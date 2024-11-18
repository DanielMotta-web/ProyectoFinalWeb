import mongoose, { Schema, Document } from 'mongoose';
import { IUsuario } from './Usuario';
import { IBitacora } from './Bitacora';

export interface IComentario extends Document {
  contenido: string;
  autor: IUsuario['_id'];
  bitacora: IBitacora['_id'];
  fecha: Date;
}

const ComentarioSchema: Schema = new Schema({
  contenido: { type: String, required: true },
  autor: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  bitacora: { type: Schema.Types.ObjectId, ref: 'Bitacora', required: true },
  fecha: { type: Date, default: Date.now }
});

export default mongoose.model<IComentario>('Comentario', ComentarioSchema);