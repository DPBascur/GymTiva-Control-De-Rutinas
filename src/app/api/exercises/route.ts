import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Exercise } from '@/models';

// GET - Obtener todos los ejercicios
export async function GET() {
  try {
    await dbConnect();

    console.log('🔍 Buscando ejercicios...');
    
    let exercises: any[] = [];
    
    try {
      // Primer intento con timeout extendido
      exercises = await Exercise.find()
        .sort({ name: 1 })
        .maxTimeMS(45000)
        .lean()
        .exec();
      
      console.log('✅ Ejercicios encontrados:', exercises.length);
    } catch (findError) {
      console.log('⚠️ Error al buscar ejercicios, devolviendo array vacío...', findError instanceof Error ? findError.message : 'Error desconocido');
      
      // Si falla, devolver array vacío en lugar de error
      exercises = [];
    }

    return NextResponse.json({ exercises });
  } catch (error) {
    console.error('Error al obtener ejercicios:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST - Crear nuevo ejercicio
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { name, muscleGroup, caloriesPerMinute, description, instructions } = body;

    if (!name || !muscleGroup) {
      return NextResponse.json({ error: 'Nombre y grupo muscular son obligatorios' }, { status: 400 });
    }

    const exercise = new Exercise({
      name,
      muscleGroup,
      caloriesPerMinute: caloriesPerMinute || 5,
      description,
      instructions,
    });

    await exercise.save();

    return NextResponse.json({ exercise }, { status: 201 });
  } catch (error) {
    console.error('Error al crear ejercicio:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}