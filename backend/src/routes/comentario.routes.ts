import express from 'express';
import { getComentarios, createComentario, deleteComentario } from '../controllers/comentarioController';

const router = express.Router();

router.get('/bitacora/:id/comentarios', getComentarios);
router.post('/bitacora/:id/comentarios', createComentario);
router.delete('/:id', deleteComentario);

export default router;