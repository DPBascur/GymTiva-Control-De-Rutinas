'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import WelcomeHeader from '@/components/WelcomeHeader';
import BottomNavbar from '@/components/BottomNavbar';

interface Exercise {
  _id: string;
  name: string;
  muscleGroup: string;
  caloriesPerMinute: number;
  description: string;
  instructions: string[];
}

interface Workout {
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
  date?: string;
  caloriesBurned?: number;
  exercises?: Array<{
    exercise?: { name: string };
    name?: string;
    sets: number;
    reps: number;
  }>;
  weeks?: Array<{
    weekNumber: number;
    days: Array<{
      dayNumber: number;
      dayName: string;
      exercises: Array<{
        name: string;
        sets: number;
        reps: number;
        weight?: number;
      }>;
    }>;
  }>;
}

export default function RutinasPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);
  
  // Función para limpiar cache de usuario nuevo
  const clearNewUserCache = () => {
    const userData = localStorage.getItem('user-data');
    if (userData) {
      const user = JSON.parse(userData);
      const userId = user.id || user._id;
      localStorage.removeItem(`user-cache-${userId}`);
    }
  };
  
  // Limpiar cache cuando se navega a crear rutina
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Si el usuario está navegando para crear una rutina, limpiar cache
      if (window.location.href.includes('/rutinas/nueva')) {
        clearNewUserCache();
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Obtener datos del usuario del localStorage
      const userData = localStorage.getItem('user-data');
      
      if (!userData) {
        throw new Error('Usuario no encontrado. Por favor, inicia sesión de nuevo.');
      }
      
      const user = JSON.parse(userData);
      const userId = user.id || user._id;
      
      console.log('👤 Usuario parseado:', { user, userId });
      
      if (!userId) {
        throw new Error('ID de usuario no válido. Por favor, inicia sesión de nuevo.');
      }
      
      // Verificar si es usuario nuevo desde localStorage
      const userCache = localStorage.getItem(`user-cache-${userId}`);
      const now = Date.now();
      
      if (userCache) {
        const cache = JSON.parse(userCache);
        // Si el cache es reciente (menos de 5 minutos) y indica que es usuario nuevo
        if (cache.timestamp > now - 300000 && cache.isNewUser) {
          console.log('� Usuario nuevo detectado desde cache, cargando solo ejercicios');
          setIsNewUser(true);
          
          // Solo cargar ejercicios para usuarios nuevos
          const exercisesRes = await fetch('/api/exercises');
          if (!exercisesRes.ok) {
            throw new Error('Error al cargar ejercicios');
          }
          const exercisesData = await exercisesRes.json();
          
          setWorkouts([]);
          setExercises(Array.isArray(exercisesData) ? exercisesData : []);
          setIsLoading(false);
          return;
        }
      }
      
      console.log('🔗 Cargando rutinas del usuario...');
      
      // Cargar rutinas del usuario usando la nueva API
      const workoutResponse = await fetch('/api/workouts/create', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      let workoutsData = [];
      if (workoutResponse.ok) {
        const workoutData = await workoutResponse.json();
        console.log('✅ Rutinas cargadas:', workoutData.workouts?.length || 0);
        workoutsData = workoutData.workouts || [];
        
        // Si no hay rutinas, es usuario nuevo
        if (workoutsData.length === 0) {
          console.log('👶 Usuario nuevo detectado - sin rutinas');
          setIsNewUser(true);
        }
      } else {
        console.log('⚠️ Error cargando rutinas, asumiendo usuario nuevo');
        setIsNewUser(true);
      }

      // Cargar ejercicios (para estadísticas)
      let exercisesData = [];
      try {
        const exerciseResponse = await fetch('/api/exercises');
        if (exerciseResponse.ok) {
          const exerciseData = await exerciseResponse.json();
          exercisesData = exerciseData.exercises || [];
        }
      } catch (exerciseError) {
        console.log('⚠️ Error cargando ejercicios:', exerciseError);
      }
      
      setWorkouts(workoutsData);
      setExercises(exercisesData);
      
    } catch (err) {
      console.error('Error al cargar datos:', err);
      
      // Si hay error de timeout o conexión, asumir usuario nuevo
      if (err instanceof Error && (err.name === 'AbortError' || err.message.includes('timeout'))) {
        console.log('⏰ Timeout detectado, asumiendo usuario nuevo');
        const userData = localStorage.getItem('user-data');
        if (userData) {
          const user = JSON.parse(userData);
          const userId = user.id || user._id;
          localStorage.setItem(`user-cache-${userId}`, JSON.stringify({
            isNewUser: true,
            timestamp: Date.now()
          }));
        }
        setIsNewUser(true);
        setWorkouts([]);
        
        // Intentar cargar solo ejercicios
        try {
          const exercisesRes = await fetch('/api/exercises');
          if (exercisesRes.ok) {
            const exercisesData = await exercisesRes.json();
            setExercises(Array.isArray(exercisesData) ? exercisesData : []);
          }
        } catch (exerciseError) {
          console.error('Error cargando ejercicios:', exerciseError);
        }
      } else {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      }
    } finally {
      setIsLoading(false);
    }
  };



  if (isLoading) {
    return (
      <div className="min-h-screen bg-exotico flex items-center justify-center pb-20">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-8 text-center border border-gray-700/50">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-lg mb-2">
            {isNewUser ? 'Configurando tu espacio...' : 'Cargando rutinas...'}
          </p>
          <p className="text-gray-400 text-sm">
            {isNewUser ? 'Preparando todo para tu primera rutina' : 'Obteniendo tus entrenamientos'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gym-purple via-gym-pink to-gym-cyan flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-white text-xl font-bold mb-2">Error</h2>
          <p className="text-white/80">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-full transition-all"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-exotico pb-20">
      <main className="container mx-auto px-4 py-8">
        <WelcomeHeader />
        
        {/* Título de sección */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 backdrop-blur-lg border border-purple-400/30 rounded-3xl p-6 mb-8 shadow-lg">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              💪 Mis Rutinas
            </h1>
            <p className="text-purple-100">
              Gestiona y registra tus entrenamientos diarios
            </p>
          </div>
        </div>
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Rutinas Activas</p>
                <p className="text-white text-2xl font-bold">{workouts.filter(w => w.isActive).length}</p>
              </div>
              <div className="text-3xl">🏋️‍♂️</div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Ejercicios Disponibles</p>
                <p className="text-white text-2xl font-bold">{exercises.length}</p>
              </div>
              <div className="text-3xl">💪</div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Progreso Total</p>
                <p className="text-white text-2xl font-bold">
                  {(() => {
                    const activeWorkouts = workouts.filter(w => w.isActive);
                    return activeWorkouts.length > 0 
                      ? Math.round(activeWorkouts.reduce((acc, w) => acc + (w.progressPercentage || 0), 0) / activeWorkouts.length) 
                      : 0;
                  })()}%
                </p>
              </div>
              <div className="text-3xl">🔥</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Link
            href="/rutinas/nueva"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-xl"
          >
            ➕ Nueva Rutina
          </Link>
          
          {/* Ver Ejercicios - Condicional */}
          {workouts.length > 0 ? (
            <Link
              href="/rutinas/ejercicios"
              className="bg-gray-800/50 hover:bg-gray-700/50 text-white px-6 py-3 rounded-full font-medium transition-all backdrop-blur-sm border border-gray-700/50"
            >
              📚 Ver Ejercicios
            </Link>
          ) : (
            <button
              disabled
              title="Crea tu primera rutina para ver los ejercicios"
              className="bg-gray-900/50 text-gray-500 px-6 py-3 rounded-full font-medium cursor-not-allowed backdrop-blur-sm border border-gray-800/50"
            >
              📚 Ver Ejercicios
            </button>
          )}
          
          {/* Registro de Entrenamientos - Condicional */}
          {workouts.length > 0 ? (
            <Link
              href="/rutinas/registro"
              className="bg-gray-800/50 hover:bg-gray-700/50 text-white px-6 py-3 rounded-full font-medium transition-all backdrop-blur-sm border border-gray-700/50"
            >
              📊 Registro de Entrenamientos
            </Link>
          ) : (
            <button
              disabled
              title="Crea tu primera rutina para registrar entrenamientos"
              className="bg-gray-900/50 text-gray-500 px-6 py-3 rounded-full font-medium cursor-not-allowed backdrop-blur-sm border border-gray-800/50"
            >
              📊 Registro de Entrenamientos
            </button>
          )}
        </div>

        {/* Workouts List */}
        {workouts.length === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-12 text-center border border-gray-700/50">
            <div className="text-6xl mb-4">🏋️‍♂️</div>
            <h3 className="text-white text-xl font-bold mb-2">
              {isNewUser ? '¡Bienvenido a GymTiva!' : '¡Comienza tu primera rutina!'}
            </h3>
            <p className="text-gray-400 mb-6">
              {isNewUser 
                ? 'Como usuario nuevo, crea tu primera rutina de entrenamiento personalizada'
                : 'Crea tu primera rutina de entrenamiento para empezar a registrar tu progreso'
              }
            </p>
            <Link
              href="/rutinas/nueva"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full font-bold transition-all inline-block shadow-lg hover:shadow-xl"
            >
              {isNewUser ? 'Crear Mi Primera Rutina' : 'Crear Primera Rutina'}
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {workouts.filter(workout => workout.isActive).map((workout) => (
              <div
                key={workout._id}
                className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-6 border border-gray-700/50 hover:bg-gray-700/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-white text-xl font-bold mb-1">
                      {workout.name}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      📅 {(() => {
                        const date = workout.date || workout.startDate;
                        if (!date) return 'Fecha no disponible';
                        
                        try {
                          const validDate = new Date(date);
                          if (isNaN(validDate.getTime())) return 'Fecha no válida';
                          
                          return validDate.toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          });
                        } catch {
                          return 'Error en fecha';
                        }
                      })()}
                    </p>
                  </div>
                  <div className="text-right">
                    {workout.duration && (
                      <p className="text-gray-400 text-sm">
                        ⏱️ {workout.duration} min
                      </p>
                    )}
                    {workout.caloriesBurned && (
                      <p className="text-green-400 font-bold">
                        🔥 {workout.caloriesBurned} cal
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {/* Mostrar información basada en el tipo de rutina */}
                  {workout.type === 'ExoticoTramax' ? (
                    // Para rutinas ExoticoTramax, mostrar información de progreso
                    <>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30">
                        Semana {workout.currentWeek}/{workout.totalWeeks}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30">
                        {workout.frequency}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30">
                        {workout.progressPercentage}% completado
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 border border-orange-500/30">
                        {workout.difficulty}
                      </span>
                    </>
                  ) : (
                    // Para rutinas personalizadas, mostrar ejercicios si existen
                    workout.exercises?.map((ex, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30"
                      >
                        {ex.exercise?.name || ex.name || 'Ejercicio'} ({ex.sets}×{ex.reps})
                      </span>
                    )) || (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-300 border border-gray-500/30">
                        Rutina personalizada
                      </span>
                    )
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Link
                    href={`/rutinas/${workout._id}`}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-all"
                  >
                    Ver Detalles
                  </Link>
                  <Link
                    href={`/rutinas/${workout._id}/editar`}
                    className="bg-gray-700/50 hover:bg-gray-600/50 text-white px-4 py-2 rounded-full text-sm font-medium transition-all border border-gray-600/50"
                  >
                    Editar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      <BottomNavbar />
    </div>
  );
}