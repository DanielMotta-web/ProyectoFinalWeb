import express from 'express';
import { connectDB } from './database/conexion';
import usuarioRoutes from './routes/usuario.routes';
import bitacoraRoutes from './routes/bitacora.routes';
import categoriaRoutes from './routes/categoria.routes';
import comentariosRoutes from './routes/comentario.routes';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// Conectar a la base de datos
connectDB();

// Usar las rutas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/bitacoras', bitacoraRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/comentarios', comentariosRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});