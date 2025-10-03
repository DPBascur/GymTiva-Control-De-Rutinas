import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

console.log('🔗 Probando conexión a MongoDB...');
console.log('📍 URI:', MONGODB_URI ? MONGODB_URI.replace(/:[^:@]+@/, ':****@') : 'NO DEFINIDA');

async function testConnection() {
  try {
    console.log('⏳ Conectando...');
    const startTime = Date.now();
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 10000,
      connectTimeoutMS: 10000
    });
    
    const endTime = Date.now();
    console.log(`✅ Conexión exitosa en ${endTime - startTime}ms`);
    console.log('📊 Estado:', {
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name
    });
    
    // Probar una consulta simple
    console.log('🔍 Probando consulta...');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📂 Colecciones disponibles:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log('✅ Desconectado correctamente');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('📋 Detalles:', error);
    process.exit(1);
  }
}

testConnection();
