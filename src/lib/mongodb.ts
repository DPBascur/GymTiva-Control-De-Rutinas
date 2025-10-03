import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface MongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseConnection | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<typeof mongoose> {
  // Verificar si ya existe una conexión válida
  if (cached!.conn && mongoose.connection.readyState === 1) {
    return cached!.conn;
  }

  // Si hay una conexión anterior, cerrarla
  if (mongoose.connection.readyState !== 0) {
    console.log('🔄 Cerrando conexión anterior...');
    await mongoose.disconnect();
    cached!.conn = null;
    cached!.promise = null;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 45000, // Incrementado a 45 segundos
      socketTimeoutMS: 60000, // Incrementado a 60 segundos
      connectTimeoutMS: 45000, // Incrementado a 45 segundos
      maxPoolSize: 10, // Mantener hasta 10 conexiones
      minPoolSize: 2, // Mantener al menos 2 conexiones
      retryWrites: true,
      retryReads: true,
      maxIdleTimeMS: 60000, // Incrementado a 60 segundos
      heartbeatFrequencyMS: 10000, // Frecuencia de heartbeat
      waitQueueTimeoutMS: 45000 // Timeout para cola de espera
    };

    // Configurar opciones globales de Mongoose con timeouts extendidos
    mongoose.set('strictQuery', false);
    mongoose.set('sanitizeFilter', true);
    mongoose.set('maxTimeMS', 45000); // Timeout global para operaciones

    console.log('🔗 Conectando a MongoDB con timeouts extendidos...');
    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ Conectado exitosamente a MongoDB');
      console.log('📊 Estado de conexión:', {
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host,
        name: mongoose.connection.name
      });
      return mongoose;
    }).catch((error) => {
      console.error('❌ Error conectando a MongoDB:', error);
      cached!.promise = null;
      throw error;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    console.error('❌ Error en dbConnect:', e);
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

export default dbConnect;
export { dbConnect as connectDB };