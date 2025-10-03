'use client';

import Link from "next/link";
import WelcomeHeader from '@/components/WelcomeHeader';
import BottomNavbar from '@/components/BottomNavbar';
import { useWorkout } from '@/contexts/WorkoutContext';

export default function Home() {
  const { todayProgress, weeklyProgress, workoutStats, activeWorkout, isLoading } = useWorkout();

  // Obtener el día de la semana actual
  const getDayName = () => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[new Date().getDay()];
  };

  return (
    <div className="min-h-screen bg-exotico pb-20">
      <main className="container mx-auto px-4 py-8">
        <WelcomeHeader />

        {/* Quick Stats - Estilo Moderno */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-cyan-400">📊</span>
            Resumen de Hoy - {getDayName()}
          </h2>
          
          {/* Card Principal de Progreso */}
          <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-red-400 rounded-3xl p-8 mb-6 shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-white/80 text-lg font-medium mb-2">
                  {activeWorkout ? 'Progreso de Rutina' : 'Sin Rutina Activa'}
                </h3>
                <div className="text-6xl font-bold text-white mb-2">
                  {activeWorkout ? `${Math.round((workoutStats.completedWorkouts / workoutStats.totalWorkouts) * 100) || 0}%` : '0%'}
                </div>
                <p className="text-white/70">
                  {activeWorkout 
                    ? `${workoutStats.completedWorkouts}/${workoutStats.totalWorkouts} entrenamientos` 
                    : 'Crea tu primera rutina'}
                </p>
              </div>
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-cyan-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/>
                </svg>
              </div>
            </div>
            
            <div className="w-full bg-white/20 rounded-full h-3 mb-4">
              <div 
                className="bg-gradient-to-r from-cyan-400 to-cyan-300 h-3 rounded-full transition-all duration-500" 
                style={{width: `${activeWorkout ? Math.round((workoutStats.completedWorkouts / workoutStats.totalWorkouts) * 100) || 0 : 0}%`}}
              />
            </div>
          </div>

          {/* Grid de estadísticas secundarias */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-6 border border-gray-700/50">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {activeWorkout ? `${activeWorkout.duration}` : '0m'}
              </div>
              <div className="text-gray-400 text-sm">Duración Rutina</div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-6 border border-gray-700/50">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{workoutStats.currentStreak}</div>
              <div className="text-gray-400 text-sm">Racha Días</div>
            </div>
          </div>

          {/* Sección Entrenamientos Hoy */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Entrenamientos Hoy</h3>
              <div className="w-8 h-8 bg-gray-700/50 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
            </div>
            
            {isLoading ? (
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-6 border border-gray-700/50">
                <div className="animate-pulse flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-700 rounded-2xl"/>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-700 rounded mb-2 w-3/4"/>
                    <div className="h-4 bg-gray-700 rounded w-1/2"/>
                  </div>
                </div>
              </div>
            ) : !todayProgress.hasWorkout ? (
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-6 border border-gray-700/50">
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🏖️</div>
                  <h4 className="text-xl font-bold text-white mb-2">
                    {todayProgress.isRestDay ? `¡${todayProgress.dayName} de Descanso!` : 'Sin Entrenamiento Hoy'}
                  </h4>
                  <p className="text-gray-400 mb-4">
                    {todayProgress.isRestDay 
                      ? 'Es tu día libre. Descansa y recupérate para mañana 💪'
                      : activeWorkout 
                        ? 'Hoy no tienes entrenamiento programado'
                        : 'Crea tu primera rutina para comenzar'
                    }
                  </p>
                  {!activeWorkout && (
                    <Link 
                      href="/rutinas/nueva"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-full font-medium transition-all"
                    >
                      ➕ Crear Rutina
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-6 border border-gray-700/50 hover:bg-gray-800/70 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 bg-gradient-to-r rounded-2xl flex items-center justify-center ${
                      todayProgress.completed 
                        ? 'from-green-500 to-emerald-500' 
                        : 'from-purple-500 to-pink-500'
                    }`}>
                      {todayProgress.completed ? (
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                      ) : (
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29l-1.43-1.43z"/>
                        </svg>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="text-xl font-bold text-white mb-1">
                        {todayProgress.dayName} - {todayProgress.muscleGroups.join(' + ')}
                      </h4>
                      <p className="text-gray-400">
                        {todayProgress.exercisesCount} ejercicios • {activeWorkout?.duration || '45 min'} • 
                        {todayProgress.completed ? ' ✅ Completado' : ' Pendiente'}
                      </p>
                    </div>
                  </div>
                  
                  {!todayProgress.completed && (
                    <Link 
                      href={`/rutinas/${activeWorkout?._id}`}
                      className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center hover:bg-cyan-500/30 transition-all duration-300"
                    >
                      <svg className="w-6 h-6 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                        <polygon points="5,3 19,12 5,21"/>
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Progreso Semanal Simplificado */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Progreso Semanal</h3>
              <div className="text-purple-400 font-medium">{workoutStats.weekProgress}% completado</div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-6 border border-gray-700/50">
              <div className="grid grid-cols-7 gap-3">
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => {
                  const isWorkoutDay = index < 5; // Lunes a Viernes
                  const isToday = index === new Date().getDay() - 1 || (new Date().getDay() === 0 && index === 6);
                  
                  return (
                    <div key={index} className="flex flex-col items-center">
                      <div className="text-gray-400 text-sm mb-3 font-medium">{day}</div>
                      
                      {!isWorkoutDay ? (
                        <div className="w-12 h-12 bg-blue-500/20 border-2 border-blue-500/30 rounded-2xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          </svg>
                        </div>
                      ) : isToday ? (
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-purple-400/50">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          </svg>
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gray-700/50 border-2 border-gray-600/50 rounded-2xl flex items-center justify-center">
                          <div className="w-2 h-2 bg-gray-500 rounded-full"/>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CTA principal */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-8 border border-gray-700/50">
            <div className="text-center">
              <div className="text-4xl mb-4">🔥</div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {activeWorkout ? '¡Sigue así!' : '¡Comienza hoy!'}
              </h3>
              <p className="text-gray-400 mb-6">
                {activeWorkout 
                  ? 'Mantén tu racha de entrenamientos y alcanza tus metas fitness'
                  : 'Crea tu primera rutina ExoticoTramax y comienza tu transformación'
                }
              </p>
              
              <Link
                href={activeWorkout ? "/rutinas" : "/rutinas/nueva"}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                </svg>
                {activeWorkout ? 'Ver Mis Rutinas' : 'Crear Mi Primera Rutina'}
              </Link>
            </div>
          </div>
        </div>

      </main>
      
      <BottomNavbar />
    </div>
  );
}