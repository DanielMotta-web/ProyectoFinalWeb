import { Router } from 'express';
import { createCategoria, getCategorias, updateCategoria, deleteCategoria } from '../controllers/categoriaController';

const router = Router();

router.post('/', createCategoria);
router.get('/', getCategorias);
router.put('/:id', updateCategoria);
router.delete('/:id', deleteCategoria);

export default router;