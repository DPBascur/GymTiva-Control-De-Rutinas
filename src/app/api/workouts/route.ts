import { NextRequest, NextResponse } from 'next/server';
import { connectDB as dbConnect } from '@/lib/mongodb';
import { Workout } from '@/models/Workout';
import { Exercise } from '@/models/Exercise';

// GET - Obtener rutinas del usuario
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const date = searchParams.get('date');

    console.log('🔍 API Workouts: Parámetros recibidos:', {
      userId,
      date,
      fullUrl: request.url
    });

    if (!userId) {
      return NextResponse.json({ error: 'Usuario requerido' }, { status: 400 });
    }

    interface WorkoutQuery {
      userId: string;
      date?: {
        $gte: Date;
        $lt: Date;
      };
    }
    
    const query: WorkoutQuery = { userId };
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    let workouts: Array<Record<string, unknown>> = [];
    
    try {
      // Verificación rápida primero - solo contar documentos
      const workoutCount = await Workout.countDocuments({ userId })
        .maxTimeMS(5000); // Timeout muy corto para verificación
      
      console.log('📊 Cantidad de workouts para usuario:', workoutCount);
      
      if (workoutCount === 0) {
        console.log('👶 Usuario nuevo detectado, devolviendo array vacío');
        return NextResponse.json({ workouts: [] });
      }
      
      // Si hay workouts, cargarlos normalmente
      try {
        workouts = await Workout.find(query)
          .populate('exercises.exerciseId')
          .sort({ date: -1 })
          .limit(20)
          .maxTimeMS(30000) // Timeout reducido
          .lean()
          .exec();
        
        console.log('✅ Workouts encontrados:', workouts.length);
      } catch (populateError) {
        console.log('⚠️ Error con populate, reintentando sin populate...', populateError instanceof Error ? populateError.message : 'Error desconocido');
        
        // Segundo intento más simple sin populate
        workouts = await Workout.find(query)
          .sort({ date: -1 })
          .limit(20)
          .maxTimeMS(15000) // Timeout aún más corto
          .lean();
        
        console.log('✅ Workouts encontrados (sin populate):', workouts.length);
      }
      
    } catch (error) {
      console.log('⚠️ Error en búsqueda, devolviendo array vacío...', error instanceof Error ? error.message : 'Error desconocido');
      
      // Si hay cualquier error, asumir usuario nuevo
      workouts = [];
      console.log('📝 Devolviendo array vacío para usuario nuevo');
    }

    return NextResponse.json({ workouts });
  } catch (error) {
    console.error('Error al obtener rutinas:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST - Crear nueva rutina
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { userId, exercises, notes } = body;

    if (!userId || !exercises || exercises.length === 0) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    // Calcular calorías quemadas y duración total
    let totalCaloriesBurned = 0;
    let totalDuration = 0;

    for (const exercise of exercises) {
      const exerciseData = await Exercise.findById(exercise.exerciseId);
      if (exerciseData && exercise.duration) {
        totalCaloriesBurned += exerciseData.caloriesPerMinute * exercise.duration;
        totalDuration += exercise.duration;
      }
    }

    const workout = new Workout({
      userId,
      exercises,
      totalDuration,
      totalCaloriesBurned,
      notes,
    });

    await workout.save();
    await workout.populate('exercises.exerciseId');

    // Verificar si es la primera rutina del usuario
    const userWorkoutCount = await Workout.countDocuments({ userId });

    return NextResponse.json({ 
      workout, 
      isFirstWorkout: userWorkoutCount === 1 
    }, { status: 201 });
  } catch (error) {
    console.error('Error al crear rutina:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}