import { Router } from 'express';
import { register, login, getUsers, getUser, updateUser, deleteUser } from '../controllers/usuarioController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/', getUsers);
router.get('/:id', getUser); // Asegúrate de que esta ruta esté definida
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;