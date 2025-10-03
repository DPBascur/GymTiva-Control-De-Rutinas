import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Workout } from '@/models/Workout';
import jwt from 'jsonwebtoken';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    
    const params = await context.params;

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
    
    // Obtener rutina específica
    const workout = await Workout.findOne({
      _id: params.id,
      userId: decoded.userId
    }).lean();

    if (!workout) {
      return NextResponse.json(
        { error: 'Rutina no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      workout
    });

  } catch (error) {
    console.error('❌ Error obteniendo rutina:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    
    const params = await context.params;

    const { dayCompleted } = await request.json();
    
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
    
    // Obtener rutina
    const workout = await Workout.findOne({
      _id: params.id,
      userId: decoded.userId
    });

    if (!workout) {
      return NextResponse.json(
        { error: 'Rutina no encontrada' },
        { status: 404 }
      );
    }

    // Actualizar progreso según el tipo de acción
    if (dayCompleted !== undefined) {
      // Obtener el día actual de la semana (1=lunes, 7=domingo)
      const today = new Date();
      const currentDayOfWeek = today.getDay() === 0 ? 7 : today.getDay();
      
      // Solo marcar como completado si es un día de entrenamiento (lunes a viernes)
      if (currentDayOfWeek <= 5) {
        const currentWeek = workout.weeks.find((w: { weekNumber: number }) => w.weekNumber === workout.currentWeek);
        if (currentWeek) {
          const currentDay = currentWeek.days.find((d: { dayNumber: number }) => d.dayNumber === currentDayOfWeek);
          if (currentDay) {
            currentDay.completed = dayCompleted;
            currentDay.completedAt = dayCompleted ? new Date() : undefined;
            
            // Si se completó el día, actualizar estadísticas
            if (dayCompleted) {
              workout.lastWorkoutDate = new Date();
            }
          }
        }
      }
    }

    await workout.save();

    return NextResponse.json({
      success: true,
      workout: {
        _id: workout._id,
        currentWeek: workout.currentWeek,
        currentDay: workout.currentDay,
        progressPercentage: workout.progressPercentage
      }
    });

  } catch (error) {
    console.error('❌ Error actualizando rutina:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}