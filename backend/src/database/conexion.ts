import mongoose from 'mongoose';

const dbURI = 'mongodb://localhost:27017/bitacoras';

export const connectDB = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log('Conectado a MongoDB');
  } catch (error: any) {
    console.error('Error al conectar a MongoDB:', error.message);
  }
};

export default mongoose;