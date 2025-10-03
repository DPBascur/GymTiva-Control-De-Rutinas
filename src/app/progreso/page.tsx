'use client';

import { useEffect, useState } from 'react';
import WelcomeHeader from '@/components/WelcomeHeader';
import BottomNavbar from '@/components/BottomNavbar';
import { useWorkout } from '@/contexts/WorkoutContext';

export default function ProgresoPage() {
  const { 
    activeWorkout, 
    weeklyProgress, 
    workoutStats, 
    isLoading 
  } = useWorkout();

  // Calcular estadísticas adicionales
  const [additionalStats, setAdditionalStats] = useState({
    totalCalories: 0,
    avgDuration: 0,
    monthlyGoal: {
      target: 20,
      current: 0,
      percentage: 0
    },
    calorieGoal: {
      target: 8000,
      current: 0,
      percentage: 0
    }
  });

  useEffect(() => {
    if (activeWorkout && workoutStats) {
      // Calcular calorías estimadas (promedio de 10-12 kcal por minuto)
      const avgCaloriesPerMinute = 11;
      const estimatedDuration = parseInt(activeWorkout.duration?.split('-')[0] || '45');
      const totalCalories = workoutStats.completedWorkouts * estimatedDuration * avgCaloriesPerMinute;
      
      // Calcular progreso mensual (asumiendo que comenzó este mes)
      const monthlyProgress = Math.min(workoutStats.completedWorkouts, 20);
      const monthlyPercentage = (monthlyProgress / 20) * 100;
      
      // Calcular progreso de calorías
      const caloriePercentage = Math.min((totalCalories / 8000) * 100, 100);
      
      setAdditionalStats({
        totalCalories,
        avgDuration: estimatedDuration,
        monthlyGoal: {
          target: 20,
          current: monthlyProgress,
          percentage: monthlyPercentage
        },
        calorieGoal: {
          target: 8000,
          current: totalCalories,
          percentage: caloriePercentage
        }
      });
    }
  }, [activeWorkout, workoutStats]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-exotico pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando progreso...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-exotico pb-20">
      <main className="container mx-auto px-4 py-8">
        <WelcomeHeader />
        
        {/* Progreso Semanal */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Progreso Semanal</h2>
          
          {/* Gráfico de progreso semanal */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-8 border border-gray-700/50 mb-6">
            <div className="grid grid-cols-7 gap-4 mb-4">
              {weeklyProgress.map((dayData, index) => (
                <div key={index} className="text-center">
                  <div className="text-gray-400 text-sm mb-2">{dayData.day}</div>
                  <div className={`w-full h-20 rounded-lg flex items-end justify-center ${
                    dayData.completed 
                      ? dayData.hasWorkout
                        ? 'bg-gradient-to-t from-purple-500 to-purple-300'
                        : 'bg-gradient-to-t from-blue-500 to-blue-300'
                      : dayData.hasWorkout
                        ? 'bg-gray-700 border-2 border-purple-500/30'
                        : 'bg-gray-700'
                  }`}>
                    {dayData.completed && (
                      <svg className="w-6 h-6 text-white mb-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    )}
                  </div>
                  {/* Indicador visual de grupos musculares */}
                  <div className="flex justify-center gap-1 mt-2">
                    {dayData.muscleGroups && dayData.muscleGroups.length > 0 && 
                      dayData.muscleGroups.slice(0, 2).map((group, idx) => (
                        <div 
                          key={idx}
                          className="w-2 h-2 rounded-full bg-purple-400 opacity-70"
                          title={group}
                        />
                      ))
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Estadísticas de progreso */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <div className="text-3xl font-bold text-white mb-1">{workoutStats.completedWorkouts}</div>
              <div className="text-gray-400 text-sm">Entrenamientos</div>
              <div className="text-green-400 text-xs mt-1">
                {weeklyProgress.filter(d => d.hasWorkout && d.completed).length} esta semana
              </div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <div className="text-3xl font-bold text-white mb-1">{additionalStats.avgDuration}</div>
              <div className="text-gray-400 text-sm">Min promedio</div>
              <div className="text-green-400 text-xs mt-1">{activeWorkout?.duration || 'N/A'}</div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <div className="text-3xl font-bold text-white mb-1">
                {additionalStats.totalCalories >= 1000 
                  ? `${(additionalStats.totalCalories / 1000).toFixed(1)}k` 
                  : additionalStats.totalCalories
                }
              </div>
              <div className="text-gray-400 text-sm">Calorías quemadas</div>
              <div className="text-green-400 text-xs mt-1">Estimado total</div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <div className="text-3xl font-bold text-white mb-1">{workoutStats.currentStreak}</div>
              <div className="text-gray-400 text-sm">Racha días</div>
              <div className="text-green-400 text-xs mt-1">
                {workoutStats.currentStreak > 0 ? '¡Sigue así!' : 'Comienza hoy'}
              </div>
            </div>
          </div>
        </div>

        {/* Progreso de objetivos */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Objetivos del Mes</h3>
          
          <div className="space-y-4">
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-4 border border-gray-700/50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-medium">Entrenar {additionalStats.monthlyGoal.target} días</span>
                <span className="text-gray-400 text-sm">
                  {additionalStats.monthlyGoal.current}/{additionalStats.monthlyGoal.target}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500" 
                  style={{width: `${additionalStats.monthlyGoal.percentage}%`}}
                ></div>
              </div>
              <div className="mt-2 text-xs text-gray-400">
                {additionalStats.monthlyGoal.percentage >= 100 
                  ? '¡Objetivo completado! 🎉' 
                  : `${Math.round(additionalStats.monthlyGoal.percentage)}% completado`
                }
              </div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-4 border border-gray-700/50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-medium">Quemar {additionalStats.calorieGoal.target.toLocaleString()} calorías</span>
                <span className="text-gray-400 text-sm">
                  {additionalStats.calorieGoal.current >= 1000 
                    ? `${(additionalStats.calorieGoal.current / 1000).toFixed(1)}k` 
                    : additionalStats.calorieGoal.current
                  }/{additionalStats.calorieGoal.target >= 1000 
                    ? `${(additionalStats.calorieGoal.target / 1000).toFixed(0)}k` 
                    : additionalStats.calorieGoal.target
                  }
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500" 
                  style={{width: `${additionalStats.calorieGoal.percentage}%`}}
                ></div>
              </div>
              <div className="mt-2 text-xs text-gray-400">
                {additionalStats.calorieGoal.percentage >= 100 
                  ? '¡Objetivo completado! 🔥' 
                  : `${Math.round(additionalStats.calorieGoal.percentage)}% completado`
                }
              </div>
            </div>
          </div>
        </div>

        {/* Información de rutina activa */}
        {activeWorkout && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Rutina Actual</h3>
            
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">{activeWorkout.name}</h4>
                  <p className="text-purple-200 text-sm">{activeWorkout.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    {Math.round((workoutStats.completedWorkouts / workoutStats.totalWorkouts) * 100)}%
                  </div>
                  <div className="text-purple-200 text-xs">Completado</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{activeWorkout.currentWeek}</div>
                  <div className="text-purple-200 text-xs">Semana actual</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{activeWorkout.totalWeeks}</div>
                  <div className="text-purple-200 text-xs">Semanas totales</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{activeWorkout.frequency}</div>
                  <div className="text-purple-200 text-xs">Frecuencia</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{activeWorkout.difficulty}</div>
                  <div className="text-purple-200 text-xs">Dificultad</div>
                </div>
              </div>
              
              <div className="w-full bg-purple-800/30 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-400 to-pink-400 h-3 rounded-full transition-all duration-500" 
                  style={{width: `${Math.round((workoutStats.completedWorkouts / workoutStats.totalWorkouts) * 100)}%`}}
                ></div>
              </div>
              <div className="mt-2 text-center text-purple-200 text-sm">
                {workoutStats.completedWorkouts} de {workoutStats.totalWorkouts} entrenamientos completados
              </div>
            </div>
          </div>
        )}
      </main>
      
      <BottomNavbar />
    </div>
  );
}