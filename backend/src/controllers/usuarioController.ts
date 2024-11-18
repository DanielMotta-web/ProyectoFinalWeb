import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Usuario, { IUsuario } from '../models/Usuario';

const secretKey = 'chocochispis'; // Reemplaza con tu clave secreta

export const register = async (req: Request, res: Response): Promise<void> => {
  const { nombre, correo, contrasena, rol } = req.body;
  const saltRounds = 10;

  try {
    const hashedPassword = await bcrypt.hash(contrasena, saltRounds);
    const usuario = new Usuario({ nombre, correo, contrasena: hashedPassword, rol });
    await usuario.save();
    res.status(201).send('usuario creado exitosamente');
  } catch (error: any) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).send({ message: 'Error al registrar el usuario', error: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { correo, contrasena } = req.body;

  try {
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      res.status(401).send('Credenciales inválidas');
      return;
    }

    const match = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!match) {
      res.status(401).send('Credenciales inválidas');
      return;
    }

    const token = jwt.sign({ id: usuario._id, rol: usuario.rol }, secretKey);
    res.send(token);
  } catch (error: any) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).send({ message: 'Error al iniciar sesión', error: error.message });
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarios = await Usuario.find();
    res.status(200).send(usuarios);
  } catch (error: any) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).send({ message: 'Error al obtener los usuarios', error: error.message });
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      res.status(404).send('Usuario no encontrado');
      return;
    }
    res.status(200).send(usuario);
  } catch (error: any) {
    console.error('Error al obtener el usuario:', error);
    res.status(500).send({ message: 'Error al obtener el usuario', error: error.message });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { nombre, correo, rol, estado } = req.body;

  try {
    const usuario = await Usuario.findByIdAndUpdate(id, { nombre, correo, rol, estado }, { new: true });
    if (!usuario) {
      res.status(404).send('Usuario no encontrado');
      return;
    }
    res.status(200).send(usuario);
  } catch (error: any) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).send({ message: 'Error al actualizar el usuario', error: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findByIdAndDelete(id);
    if (!usuario) {
      res.status(404).send('Usuario no encontrado');
      return;
    }
    res.status(200).send('Usuario eliminado');
  } catch (error: any) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).send({ message: 'Error al eliminar el usuario', error: error.message });
  }
};