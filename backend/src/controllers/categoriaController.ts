import { Request, Response } from 'express';
import Categoria from '../models/Categoria';

export const createCategoria = async (req: Request, res: Response): Promise<void> => {
  try {
    const categoria = new Categoria(req.body);
    await categoria.save();
    res.status(201).send(categoria);
  } catch (error: any) {
    console.error('Error al crear la categoría:', error);
    res.status(500).send({ message: 'Error al crear la categoría', error: error.message });
  }
};

export const getCategorias = async (req: Request, res: Response): Promise<void> => {
  try {
    const categorias = await Categoria.find();
    res.status(200).send(categorias);
  } catch (error: any) {
    console.error('Error al obtener las categorías:', error);
    res.status(500).send({ message: 'Error al obtener las categorías', error: error.message });
  }
};

export const updateCategoria = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const categoria = await Categoria.findByIdAndUpdate(id, req.body, { new: true });
    if (!categoria) {
      res.status(404).send('Categoría no encontrada');
      return;
    }
    res.status(200).send(categoria);
  } catch (error: any) {
    console.error('Error al actualizar la categoría:', error);
    res.status(500).send({ message: 'Error al actualizar la categoría', error: error.message });
  }
};

export const deleteCategoria = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const categoria = await Categoria.findByIdAndDelete(id);
    if (!categoria) {
      res.status(404).send('Categoría no encontrada');
      return;
    }
    res.status(200).send('Categoría eliminada');
  } catch (error: any) {
    console.error('Error al eliminar la categoría:', error);
    res.status(500).send({ message: 'Error al eliminar la categoría', error: error.message });
  }
};