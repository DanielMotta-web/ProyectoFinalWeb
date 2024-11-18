import { Request, Response } from 'express';
import Comentario from '../models/Comentario';

// Obtener comentarios de una bitácora
export const getComentarios = async (req: Request, res: Response) => {
  try {
    const comentarios = await Comentario.find({ bitacora: req.params.id }).populate('autor', 'nombre');
    res.json(comentarios);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los comentarios' });
  }
};

// Crear un nuevo comentario
export const createComentario = async (req: Request, res: Response) => {
  try {
    const comentario = new Comentario({
      contenido: req.body.contenido,
      autor: req.body.autor,
      bitacora: req.params.id
    });
    await comentario.save();
    res.status(201).json(comentario);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el comentario' });
  }
};

// Eliminar un comentario
export const deleteComentario = async (req: Request, res: Response) => {
  try {
    await Comentario.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el comentario' });
  }
};