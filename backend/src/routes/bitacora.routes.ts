import { Router } from 'express';
import { createBitacora, getBitacora, getBitacoras, updateBitacora, deleteBitacora } from '../controllers/bitacoraController';

const router = Router();

router.post('/', createBitacora);
router.get('/', getBitacoras); // Asegúrate de que esta ruta esté definida
router.get('/:id', getBitacora);
router.put('/:id', updateBitacora);
router.delete('/:id', deleteBitacora);

export default router;