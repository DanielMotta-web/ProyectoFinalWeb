import { Request, Response } from 'express';
import Bitacora from '../models/Bitacora';
import { sendEmail } from '../services/emailService';
import Usuario from '../models/Usuario';

const notifyCollaborators = async (bitacora: any, action: string) => {
  try {
    const colaboradores = await Usuario.find({ rol: 'colaborador' });
    const emails = colaboradores.map((colaborador: any) => colaborador.correo);
    const subject = `Notificación de Bitácora: ${action}`;
    const text = `La bitácora titulada "${bitacora.titulo}" ha sido ${action}.`;

    for (const email of emails) {
      await sendEmail(email, subject, text);
    }
  } catch (error) {
    console.error('Error al notificar a los colaboradores:', error);
  }
};

export const createBitacora = async (req: Request, res: Response): Promise<void> => {
  try {
    const bitacora = new Bitacora(req.body);
    await bitacora.save();
    await notifyCollaborators(bitacora, 'creada');
    res.status(201).send(bitacora);
  } catch (error: any) {
    console.error('Error al crear la bitácora:', error);
    res.status(500).send({ message: 'Error al crear la bitácora', error: error.message });
  }
};

export const getBitacora = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const bitacora = await Bitacora.findById(id);
    if (!bitacora) {
      res.status(404).send('Bitácora no encontrada');
      return;
    }
    res.status(200).send(bitacora);
  } catch (error: any) {
    console.error('Error al obtener la bitácora:', error);
    res.status(500).send({ message: 'Error al obtener la bitácora', error: error.message });
  }
};

export const getBitacoras = async (req: Request, res: Response): Promise<void> => {
  try {
    const bitacoras = await Bitacora.find();
    res.status(200).send(bitacoras);
  } catch (error: any) {
    console.error('Error al obtener las bitácoras:', error);
    res.status(500).send({ message: 'Error al obtener las bitácoras', error: error.message });
  }
};

export const updateBitacora = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const bitacora = await Bitacora.findByIdAndUpdate(id, req.body, { new: true });
    if (!bitacora) {
      res.status(404).send('Bitácora no encontrada');
      return;
    }
    await notifyCollaborators(bitacora, 'actualizada');
    res.status(200).send(bitacora);
  } catch (error: any) {
    console.error('Error al actualizar la bitácora:', error);
    res.status(500).send({ message: 'Error al actualizar la bitácora', error: error.message });
  }
};

export const deleteBitacora = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const bitacora = await Bitacora.findByIdAndDelete(id);
    if (!bitacora) {
      res.status(404).send('Bitácora no encontrada');
      return;
    }
    res.status(200).send('Bitácora eliminada');
  } catch (error: any) {
    console.error('Error al eliminar la bitácora:', error);
    res.status(500).send({ message: 'Error al eliminar la bitácora', error: error.message });
  }
};