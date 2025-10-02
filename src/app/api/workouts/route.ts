import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Workout, Exercise } from '@/models';

// GET - Obtener rutinas del usuario
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const date = searchParams.get('date');

    if (!userId) {
      return NextResponse.json({ error: 'Usuario requerido' }, { status: 400 });
    }

    const query: any = { userId };
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    const workouts = await Workout.find(query)
      .populate('exercises.exerciseId')
      .sort({ date: -1 })
      .limit(20);

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

    return NextResponse.json({ workout }, { status: 201 });
  } catch (error) {
    console.error('Error al crear rutina:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}