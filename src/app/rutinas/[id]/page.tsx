'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useWorkout } from '@/contexts/WorkoutContext';
import WelcomeHeader from '@/components/WelcomeHeader';
import BottomNavbar from '@/components/BottomNavbar';

export default function WorkoutSessionPage() {
  const params = useParams();
  const router = useRouter();
  const { activeWorkout, currentDayWorkout, refreshWorkoutData } = useWorkout();
  
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());

  // Actualizar el tiempo cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Función para formatear el tiempo transcurrido
  const formatElapsedTime = () => {
    if (!workoutStartTime) return '00:00:00';
    
    const now = currentTime;
    const elapsed = Math.floor((now.getTime() - workoutStartTime.getTime()) / 1000);
    
    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor((elapsed % 3600) / 60);
    const seconds = elapsed % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Función para iniciar el entrenamiento
  const startWorkout = () => {
    setIsWorkoutStarted(true);
    setWorkoutStartTime(new Date());
  };

  // Función para marcar ejercicio como completado
  const toggleExerciseComplete = (exerciseIndex: number) => {
    const newCompleted = new Set(completedExercises);
    if (completedExercises.has(exerciseIndex)) {
      newCompleted.delete(exerciseIndex);
    } else {
      newCompleted.add(exerciseIndex);
    }
    setCompletedExercises(newCompleted);
  };

  // Función para completar toda la rutina
  const handleCompleteWorkout = async () => {
    try {
      console.log('🎯 Completando rutina del día...');
      
      const response = await fetch(`/api/workouts/${params.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dayCompleted: true })
      });

      if (response.ok) {
        // Mostrar pantalla de felicitaciones
        alert('¡Rutina completada! 🎉\n\nHas completado el entrenamiento de hoy exitosamente.');
        
        // Recargar datos y volver al home
        await refreshWorkoutData();
        router.push('/');
      } else {
        console.error('Error en la respuesta:', await response.text());
        alert('Error al completar la rutina. Inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error completando rutina:', error);
      alert('Error de conexión. Verifica tu internet e inténtalo de nuevo.');
    }
  };

  if (!activeWorkout || !currentDayWorkout) {
    return (
      <div className="min-h-screen bg-exotico pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏋️‍♂️</div>
          <h2 className="text-white text-xl font-bold mb-2">No hay rutina activa</h2>
          <p className="text-gray-400">Selecciona una rutina para comenzar</p>
        </div>
      </div>
    );
  }

  const todayExercises = currentDayWorkout.exercises || [];

  return (
    <div className="min-h-screen bg-exotico pb-20">
      <main className="container mx-auto px-4 py-8">
        <WelcomeHeader />

        {/* Header de la rutina */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 backdrop-blur-lg border border-purple-400/30 rounded-3xl p-6 mb-8 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">
                {currentDayWorkout.dayName} - {currentDayWorkout.muscleGroups.join(' + ')}
              </h1>
              <p className="text-purple-100">
                {todayExercises.length} ejercicios • {activeWorkout.duration}
              </p>
            </div>
            <button
              onClick={() => router.back()}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
          </div>

          {/* Cronómetro */}
          <div className="bg-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">Tiempo transcurrido</p>
                <p className="text-white text-3xl font-bold font-mono">
                  {formatElapsedTime()}
                </p>
              </div>
              
              {!isWorkoutStarted ? (
                <button
                  onClick={startWorkout}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-bold transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <polygon points="5,3 19,12 5,21"/>
                  </svg>
                  Iniciar Rutina
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-300 font-medium">En progreso</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lista de ejercicios */}
        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Ejercicios de Hoy</h2>
            <div className="text-purple-400 font-medium">
              {completedExercises.size}/{todayExercises.length} completados
            </div>
          </div>

          {todayExercises.map((exercise: { 
            name: string; 
            exerciseName?: string;
            sets: number; 
            reps: string; 
            muscleGroup: string; 
            instructions?: string;
            restTime?: number;
          }, index: number) => {
            const isCompleted = completedExercises.has(index);
            
            return (
              <div
                key={index}
                className={`bg-gray-800/50 backdrop-blur-lg rounded-3xl p-6 border transition-all duration-300 ${
                  isCompleted 
                    ? 'border-green-500/50 bg-green-500/10' 
                    : 'border-gray-700/50 hover:border-purple-500/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        isCompleted ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'
                      }`}>
                        {index + 1}
                      </div>
                      <h3 className={`text-lg font-bold ${isCompleted ? 'text-green-300' : 'text-white'}`}>
                        {exercise.exerciseName || exercise.name}
                      </h3>
                    </div>
                    
                    <div className="ml-11">
                      <div className="flex flex-wrap gap-4 mb-3">
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                          {exercise.sets} series
                        </span>
                        <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm">
                          {exercise.reps} repeticiones
                        </span>
                        <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm">
                          {exercise.restTime || 60}s descanso
                        </span>
                      </div>
                      
                      {exercise.muscleGroup && (
                        <div className="text-gray-400 text-sm mb-3">
                          Grupo muscular: <span className="text-white capitalize">{exercise.muscleGroup}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleExerciseComplete(index)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-gray-700/50 hover:bg-purple-500/50 text-gray-400 hover:text-white'
                    }`}
                  >
                    {isCompleted ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cardio section */}
        {currentDayWorkout.cardio && (
          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-lg rounded-3xl p-6 border border-cyan-500/30 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Cardio</h3>
                <p className="text-cyan-300">
                  {currentDayWorkout.cardio.duration} • {currentDayWorkout.cardio.type}
                </p>
              </div>
            </div>
            <p className="text-gray-300 text-sm">
              Completa tu sesión de cardio para maximizar los resultados del entrenamiento.
            </p>
          </div>
        )}

        {/* Botón para completar rutina */}
        {isWorkoutStarted && (
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-6 border border-gray-700/50 text-center">
            <h3 className="text-xl font-bold text-white mb-4">¿Has terminado todos los ejercicios?</h3>
            <p className="text-gray-400 mb-6">
              Marca la rutina como completada para registrar tu progreso.
            </p>
            <button
              onClick={handleCompleteWorkout}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-xl"
              disabled={completedExercises.size === 0}
            >
              ✅ Completar Rutina ({formatElapsedTime()})
            </button>
          </div>
        )}
      </main>

      <BottomNavbar />
    </div>
  );
}