'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WorkoutType {
  _id: string;
  name: string;
  type: 'ExoticoTramax' | 'Personalizada';
  description: string;
  difficulty: string;
  duration: string;
  frequency: string;
  currentWeek: number;
  currentDay: number;
  totalWeeks: number;
  progressPercentage: number;
  totalWorkouts: number;
  completedWorkouts: number;
  isActive: boolean;
  isPaused: boolean;
  startDate: string;
  lastWorkoutDate?: string;
  weeks?: Array<{
    weekNumber: number;
    days: Array<{
      dayNumber: number;
      dayName: string;
      muscleGroups: string[];
      exercises: Array<{
        name: string;
        sets: number;
        reps: number;
        weight?: number;
      }>;
      completed?: boolean;
      cardio?: {
        type: string;
        duration: number;
      };
    }>;
  }>;
}

interface WorkoutContextType {
  activeWorkout: WorkoutType | null;
  currentDayWorkout: any;
  todayProgress: {
    hasWorkout: boolean;
    isRestDay: boolean;
    dayName: string;
    muscleGroups: string[];
    exercisesCount: number;
    completed: boolean;
    dayNumber: number;
    exercises?: Array<any>;
    cardio?: {
      type: string;
      duration: string | number;
    };
  };
  weeklyProgress: Array<{
    day: string;
    date: Date;
    hasWorkout: boolean;
    completed: boolean;
    muscleGroups?: string[];
  }>;
  workoutStats: {
    totalWorkouts: number;
    completedWorkouts: number;
    currentStreak: number;
    weekProgress: number;
  };
  isLoading: boolean;
  error: string | null;
  refreshWorkoutData: () => Promise<void>;
  completeWorkout: (workoutId: string) => Promise<void>;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

interface WorkoutProviderProps {
  children: ReactNode;
}

export function WorkoutProvider({ children }: WorkoutProviderProps) {
  const [activeWorkout, setActiveWorkout] = useState<WorkoutType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener el día actual de la semana (1=lunes, 7=domingo)
  const getCurrentDayOfWeek = () => {
    const today = new Date();
    const day = today.getDay();
    return day === 0 ? 7 : day; // Convertir domingo (0) a 7
  };

  // Función para obtener datos de rutina activa
  const fetchActiveWorkout = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔄 Iniciando carga de rutinas...');
      
      const response = await fetch('/api/workouts/create', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      console.log('📡 Respuesta de API:', response.status, response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('📊 Datos recibidos:', data);
        console.log('🏋️ Total rutinas:', data.workouts?.length || 0);
        
        const activeRoutine = data.workouts?.find((w: any) => w.isActive) || null;
        console.log('✅ Rutina activa encontrada:', activeRoutine);
        
        if (activeRoutine) {
          console.log('📋 Estructura de rutina activa:', {
            name: activeRoutine.name,
            type: activeRoutine.type,
            currentWeek: activeRoutine.currentWeek,
            totalWeeks: activeRoutine.totalWeeks,
            hasWeeks: !!activeRoutine.weeks,
            weeksLength: activeRoutine.weeks?.length
          });
        }
        
        setActiveWorkout(activeRoutine);
      } else {
        console.log('❌ Error en respuesta API:', response.status);
        const errorData = await response.text();
        console.log('❌ Detalles del error:', errorData);
        setActiveWorkout(null);
      }
    } catch (err) {
      console.error('❌ Error cargando rutina activa:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setActiveWorkout(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Calcular progreso del día actual
  const getCurrentDayWorkout = () => {
    if (!activeWorkout) {
      console.log('❌ No hay rutina activa');
      return null;
    }

    const currentDayOfWeek = getCurrentDayOfWeek();
    console.log('📅 Día actual de la semana:', currentDayOfWeek, '(1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes, 6=Sábado, 7=Domingo)');
    console.log('🏋️ Rutina activa:', activeWorkout);
    
    // Los entrenamientos son de lunes (1) a viernes (5)
    if (currentDayOfWeek > 5) {
      console.log('🏖️ Es fin de semana - día de descanso');
      return {
        hasWorkout: false,
        isRestDay: true,
        dayName: currentDayOfWeek === 6 ? 'Sábado' : 'Domingo',
        muscleGroups: [],
        exercisesCount: 0,
        completed: false,
        dayNumber: 0
      };
    }

    // Buscar el entrenamiento para el día actual de la semana actual
    console.log('🔍 Buscando semana:', activeWorkout.currentWeek, 'en weeks:', activeWorkout.weeks?.length);
    const currentWeek = activeWorkout.weeks?.find((w: any) => w.weekNumber === activeWorkout.currentWeek);
    console.log('📅 Semana encontrada:', currentWeek);
    
    if (!currentWeek) {
      console.log('❌ No se encontró la semana actual');
      return null;
    }

    console.log('🔍 Buscando día:', currentDayOfWeek, 'en days:', currentWeek.days?.length);
    const currentDay = currentWeek.days?.find((d: any) => d.dayNumber === currentDayOfWeek);
    console.log('📅 Día encontrado:', currentDay);
    
    if (!currentDay) {
      console.log('❌ No se encontró el día actual');
      return null;
    }

    console.log('✅ Día encontrado:', currentDay);
    
    return {
      hasWorkout: true,
      isRestDay: false,
      dayName: currentDay.dayName,
      muscleGroups: currentDay.muscleGroups || [],
      exercisesCount: currentDay.exercises?.length || 0,
      completed: currentDay.completed || false,
      dayNumber: currentDay.dayNumber,
      cardio: currentDay.cardio,
      exercises: currentDay.exercises || []
    };
  };

  // Calcular progreso semanal basado en datos reales
  const getWeeklyProgress = () => {
    const today = new Date();
    const weekProgress = [];
    
    // Obtener los últimos 7 días
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay();
      const dayNames = ['', 'L', 'M', 'M', 'J', 'V', 'S', 'D'];
      
      // Determinar si hay entrenamiento (lunes a viernes)
      const hasWorkout = dayOfWeek <= 5;
      
      let completed = false;
      let muscleGroups: string[] = [];
      
      if (hasWorkout && activeWorkout && activeWorkout.weeks) {
        // Calcular qué semana corresponde a esta fecha desde el inicio de la rutina
        const startDate = new Date(activeWorkout.startDate);
        const diffTime = date.getTime() - startDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        // Determinar qué semana del ciclo (1-4) corresponde a esta fecha
        const weeksSinceStart = Math.floor(diffDays / 7);
        const weekInCycle = (weeksSinceStart % activeWorkout.totalWeeks) + 1;
        
        // Solo considerar fechas después del inicio de la rutina
        if (diffDays >= 0) {
          const week = activeWorkout.weeks.find(w => w.weekNumber === weekInCycle);
          if (week && week.days) {
            const day = week.days.find(d => d.dayNumber === dayOfWeek);
            if (day) {
              completed = day.completed || false;
              muscleGroups = day.muscleGroups || [];
            }
          }
        }
      }
      
      weekProgress.push({
        day: dayNames[dayOfWeek],
        date,
        hasWorkout,
        completed: hasWorkout ? completed : true, // Días de descanso se marcan como "completados"
        muscleGroups
      });
    }
    
    return weekProgress;
  };

  // Calcular estadísticas
  const getWorkoutStats = () => {
    if (!activeWorkout) {
      return {
        totalWorkouts: 0,
        completedWorkouts: 0,
        currentStreak: 0,
        weekProgress: 0
      };
    }

    const weekProgress = getWeeklyProgress();
    const workoutDaysThisWeek = weekProgress.filter(day => day.hasWorkout);
    const completedThisWeek = workoutDaysThisWeek.filter(day => day.completed);
    
    // Calcular racha actual basada en datos reales
    let currentStreak = 0;
    const today = new Date();
    
    // Verificar días hacia atrás desde hoy para calcular la racha
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay();
      
      if (dayOfWeek <= 5 && activeWorkout && activeWorkout.weeks) { // Solo días de entrenamiento
        const startDate = new Date(activeWorkout.startDate);
        const diffTime = date.getTime() - startDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        // Solo considerar fechas después del inicio de la rutina
        if (diffDays >= 0) {
          const weeksSinceStart = Math.floor(diffDays / 7);
          const weekInCycle = (weeksSinceStart % activeWorkout.totalWeeks) + 1;
          
          const week = activeWorkout.weeks.find(w => w.weekNumber === weekInCycle);
          if (week && week.days) {
            const day = week.days.find(d => d.dayNumber === dayOfWeek);
            if (day && day.completed) {
              currentStreak++;
            } else if (date < today) {
              // Solo romper la racha si es un día pasado no completado
              break;
            }
          } else if (date < today) {
            break;
          }
        } else {
          // Fechas antes del inicio de la rutina no cuentan
          break;
        }
      }
    }

    return {
      totalWorkouts: activeWorkout.totalWorkouts || 0,
      completedWorkouts: activeWorkout.completedWorkouts || 0,
      currentStreak: currentStreak,
      weekProgress: workoutDaysThisWeek.length > 0 ? Math.round((completedThisWeek.length / workoutDaysThisWeek.length) * 100) : 0
    };
  };

  // Completar entrenamiento del día actual
  const completeWorkout = async (workoutId: string) => {
    try {
      console.log('🎯 Completando entrenamiento:', workoutId);
      
      const response = await fetch(`/api/workouts/${workoutId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dayCompleted: true })
      });

      if (response.ok) {
        console.log('✅ Entrenamiento completado exitosamente');
        await fetchActiveWorkout(); // Recargar datos para reflejar el progreso
      } else {
        console.error('❌ Error en respuesta de la API');
      }
    } catch (error) {
      console.error('❌ Error completando entrenamiento:', error);
    }
  };

  const refreshWorkoutData = fetchActiveWorkout;

  useEffect(() => {
    fetchActiveWorkout();
  }, []);

  const currentDayWorkout = getCurrentDayWorkout();
  const weeklyProgress = getWeeklyProgress();
  const workoutStats = getWorkoutStats();

  const value: WorkoutContextType = {
    activeWorkout,
    currentDayWorkout,
    todayProgress: currentDayWorkout || {
      hasWorkout: false,
      isRestDay: true,
      dayName: 'Sin rutina',
      muscleGroups: [],
      exercisesCount: 0,
      completed: false,
      dayNumber: 0,
      exercises: [],
      cardio: undefined
    },
    weeklyProgress,
    workoutStats,
    isLoading,
    error,
    refreshWorkoutData,
    completeWorkout
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
}