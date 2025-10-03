import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  try {
    console.log('🔍 Probando conexión a MongoDB...');
    
    const startTime = Date.now();
    await connectDB();
    const connectionTime = Date.now() - startTime;
    
    const dbState = mongoose.connection.readyState;
    const stateNames = {
      0: 'disconnected',
      1: 'connected', 
      2: 'connecting',
      3: 'disconnecting'
    };
    
    console.log(`✅ Conexión exitosa en ${connectionTime}ms`);
    
    return NextResponse.json({
      status: 'success',
      message: 'Conexión a MongoDB exitosa',
      connectionTime: `${connectionTime}ms`,
      dbState: stateNames[dbState as keyof typeof stateNames] || 'unknown',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    
    return NextResponse.json({
      status: 'error',
      message: 'Error de conexión a MongoDB',
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}