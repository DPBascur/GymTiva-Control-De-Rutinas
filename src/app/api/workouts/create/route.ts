import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Workout } from '@/models/Workout';
import { User } from '@/models/User';
import { createExoticoTraMaxWorkout } from '@/lib/exoticoTramax';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    await connectDB();

    const { type, customName } = await request.json();
    
    // Obtener token del usuario
    const token = request.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
    if (!token) {
      return NextResponse.json(
        { error: 'Token de autenticación requerido' },
        { status: 401 }
      );
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    
    // Obtener usuario
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si el usuario ya tiene una rutina activa
    const existingWorkout = await Workout.findOne({ 
      userId: decoded.userId, 
      isActive: true 
    });

    if (existingWorkout) {
      return NextResponse.json(
        { error: 'Ya tienes una rutina activa. Completa o pausa la actual antes de crear una nueva.' },
        { status: 400 }
      );
    }

    let workoutData;

    if (type === 'exotico-tramax') {
      // Crear rutina ExoticoTramax
      workoutData = createExoticoTraMaxWorkout(decoded.userId, user.name || user.email.split('@')[0]);
    } else if (type === 'personalizada') {
      // Rutina personalizada (para implementar después)
      workoutData = {
        userId: decoded.userId,
        name: customName || `Rutina Personalizada - ${user.name || user.email.split('@')[0]}`,
        type: 'Personalizada',
        description: 'Rutina personalizada creada por el usuario',
        difficulty: 'Intermedio',
        duration: 'Variable',
        frequency: 'Personalizada',
        currentWeek: 1,
        currentDay: 1,
        totalWeeks: 1,
        weeks: [{
          weekNumber: 1,
          days: [],
          completed: false
        }],
        totalWorkouts: 0,
        completedWorkouts: 0,
        startDate: new Date(),
        isActive: true,
        isPaused: false
      };
    } else {
      return NextResponse.json(
        { error: 'Tipo de rutina no válido' },
        { status: 400 }
      );
    }

    // Crear la rutina en la base de datos
    const workout = new Workout(workoutData);
    await workout.save();

    console.log('🏋️‍♂️ Nueva rutina creada:', {
      type: workout.type,
      userId: decoded.userId,
      workoutId: workout._id
    });

    return NextResponse.json({
      success: true,
      message: 'Rutina creada exitosamente',
      workout: {
        _id: workout._id,
        name: workout.name,
        type: workout.type,
        currentWeek: workout.currentWeek,
        currentDay: workout.currentDay,
        progressPercentage: 0,
        totalWorkouts: workout.totalWorkouts
      }
    });

  } catch (error) {
    console.error('❌ Error creando rutina:', error);
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await connectDB();

    // Obtener token del usuario
    const token = request.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token de autenticación requerido' },
        { status: 401 }
      );
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    // Obtener rutinas del usuario
    const workouts = await Workout.find({ userId: decoded.userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      workouts: workouts.map(workout => ({
        _id: workout._id,
        name: workout.name,
        type: workout.type,
        description: workout.description,
        difficulty: workout.difficulty,
        duration: workout.duration,
        frequency: workout.frequency,
        currentWeek: workout.currentWeek,
        currentDay: workout.currentDay,
        totalWeeks: workout.totalWeeks,
        progressPercentage: Math.round((workout.completedWorkouts / workout.totalWorkouts) * 100) || 0,
        totalWorkouts: workout.totalWorkouts,
        completedWorkouts: workout.completedWorkouts,
        isActive: workout.isActive,
        isPaused: workout.isPaused,
        startDate: workout.startDate,
        lastWorkoutDate: workout.lastWorkoutDate,
        weeks: workout.weeks ? workout.weeks.map(week => ({
          weekNumber: week.weekNumber,
          completed: week.completed,
          days: week.days ? week.days.map(day => ({
            dayName: day.dayName,
            dayNumber: day.dayNumber,
            muscleGroups: day.muscleGroups,
            exercises: day.exercises || [],
            cardio: day.cardio,
            completed: day.completed,
            completedAt: day.completedAt
          })) : []
        })) : []
      }))
    });

  } catch (error) {
    console.error('❌ Error obteniendo rutinas:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}