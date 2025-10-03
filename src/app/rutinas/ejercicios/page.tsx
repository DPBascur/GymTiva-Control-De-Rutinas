'use client';

import { useState, useEffect, useCallback } from 'react';
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

export default function EjerciciosPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const muscleGroups = [
    { key: 'todos', name: 'Todos los ejercicios', emoji: '🏋️‍♂️', color: 'bg-gradient-to-r from-gym-purple to-gym-pink' },
    { key: 'pecho', name: 'Pecho', emoji: '💪', color: 'bg-gym-pink' },
    { key: 'espalda', name: 'Espalda', emoji: '🔙', color: 'bg-gym-purple' },
    { key: 'piernas', name: 'Piernas', emoji: '🦵', color: 'bg-gym-cyan' },
    { key: 'brazos', name: 'Brazos', emoji: '💪', color: 'bg-gym-lime' },
    { key: 'hombros', name: 'Hombros', emoji: '🏋️‍♀️', color: 'bg-gradient-to-r from-gym-pink to-gym-purple' },
    { key: 'core', name: 'Core', emoji: '🎯', color: 'bg-gradient-to-r from-gym-purple to-gym-cyan' },
    { key: 'cardio', name: 'Cardio', emoji: '❤️', color: 'bg-gradient-to-r from-gym-lime to-gym-pink' },
  ];

  useEffect(() => {
    fetchExercises();
  }, []);

  const filterExercises = useCallback(() => {
    let filtered = exercises;

    if (selectedGroup !== 'todos') {
      filtered = filtered.filter(ex => ex.muscleGroup === selectedGroup);
    }

    if (searchTerm) {
      filtered = filtered.filter(ex =>
        ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredExercises(filtered);
  }, [exercises, selectedGroup, searchTerm]);

  useEffect(() => {
    filterExercises();
  }, [filterExercises]);

  const fetchExercises = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/exercises');
      if (!response.ok) throw new Error('Error al cargar ejercicios');
      const data = await response.json();
      
      // Asegurarse de que data sea un array
      const exercisesArray = Array.isArray(data) ? data : (data.exercises || []);
      setExercises(exercisesArray);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  const getMuscleGroupStats = () => {
    const stats = muscleGroups.slice(1).map(group => ({
      ...group,
      count: Array.isArray(exercises) ? exercises.filter(ex => ex.muscleGroup === group.key).length : 0
    }));
    return stats;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-exotico pb-20 flex items-center justify-center">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-8 text-center border border-gray-700/50">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-lg mb-2">Cargando ejercicios...</p>
          <p className="text-gray-400 text-sm">Preparando base de datos de ejercicios</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-exotico pb-20 flex items-center justify-center">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-8 text-center border border-gray-700/50">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-white text-xl font-bold mb-2">Error</h2>
          <p className="text-white/80">{error}</p>
          <button
            onClick={fetchExercises}
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
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-3xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                📚 Biblioteca de Ejercicios
              </h1>
              <p className="text-gray-400">
                Explora todos los ejercicios disponibles para tus rutinas
              </p>
            </div>
            <Link
              href="/rutinas"
              className="bg-gray-700/50 hover:bg-gray-600/50 text-white px-6 py-3 rounded-full font-medium transition-all backdrop-blur-sm border border-gray-600/50"
            >
              ← Volver a Rutinas
            </Link>
          </div>
        </div>
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-6 border border-gray-700/50 md:col-span-1">
            <div className="text-center">
              <p className="text-gray-400 text-sm">Total de Ejercicios</p>
              <p className="text-white text-3xl font-bold">{exercises.length}</p>
              <p className="text-gray-500 text-xs mt-1">disponibles</p>
            </div>
          </div>
          
          <div className="md:col-span-3 bg-gray-800/50 backdrop-blur-lg rounded-3xl p-6 border border-gray-700/50">
            <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
              {getMuscleGroupStats().map((group) => (
                <div key={group.key} className="text-center">
                  <div className="text-2xl mb-1">{group.emoji}</div>
                  <p className="text-white text-lg font-bold">{group.count}</p>
                  <p className="text-gray-500 text-xs">{group.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-6 border border-gray-700/50 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="🔍 Buscar ejercicios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
              />
            </div>
            
            {/* Group Filter */}
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
            >
              {muscleGroups.map((group) => (
                <option key={group.key} value={group.key} className="bg-gray-800">
                  {group.emoji} {group.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Counter */}
        <div className="mb-6">
          <p className="text-gray-400 text-center">
            {filteredExercises.length === exercises.length
              ? `Mostrando todos los ${exercises.length} ejercicios`
              : `Mostrando ${filteredExercises.length} de ${exercises.length} ejercicios`
            }
          </p>
        </div>

        {/* Exercises Grid */}
        {filteredExercises.length === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-12 text-center border border-gray-700/50">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-white text-xl font-bold mb-2">
              No se encontraron ejercicios
            </h3>
            <p className="text-gray-400 mb-6">
              Intenta cambiar los filtros o términos de búsqueda
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedGroup('todos');
              }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-xl"
            >
              Limpiar Filtros
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExercises.map((exercise) => (
              <div
                key={exercise._id}
                className="bg-gray-800/50 backdrop-blur-lg rounded-3xl border border-gray-700/50 overflow-hidden hover:bg-gray-700/50 transition-all group"
              >
                {/* Header with muscle group */}
                <div className={`${
                  muscleGroups.find(g => g.key === exercise.muscleGroup)?.color || 'bg-gray-500'
                } p-4 text-center`}>
                  <div className="text-2xl mb-1">
                    {muscleGroups.find(g => g.key === exercise.muscleGroup)?.emoji || '💪'}
                  </div>
                  <span className="text-white text-xs font-medium uppercase tracking-wider">
                    {exercise.muscleGroup}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-white text-lg font-bold mb-2">
                    {exercise.name}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {exercise.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-green-400 font-semibold">
                      🔥 {exercise.caloriesPerMinute} cal/min
                    </span>
                    <span className="text-gray-500 text-xs">
                      {exercise.instructions.length} pasos
                    </span>
                  </div>

                  {/* Instructions preview */}
                  <div className="mb-4">
                    <h4 className="text-gray-300 text-sm font-medium mb-2">Instrucciones:</h4>
                    <div className="bg-gray-700/30 rounded-lg p-3 max-h-24 overflow-y-auto">
                      <ol className="text-gray-400 text-xs space-y-1">
                        {exercise.instructions.slice(0, 3).map((instruction, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-cyan-400 mr-2">{index + 1}.</span>
                            {instruction}
                          </li>
                        ))}
                        {exercise.instructions.length > 3 && (
                          <li className="text-gray-500 italic">
                            +{exercise.instructions.length - 3} pasos más...
                          </li>
                        )}
                      </ol>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-all">
                      Ver Detalles
                    </button>
                    <button className="bg-gray-700/50 hover:bg-gray-600/50 text-white px-4 py-2 rounded-full text-sm font-medium transition-all border border-gray-600/50">
                      + Rutina
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 text-center">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-8 border border-gray-700/50">
            <h3 className="text-white text-xl font-bold mb-4">
              ¿Listo para entrenar?
            </h3>
            <p className="text-gray-400 mb-6">
              Crea una nueva rutina con los ejercicios que más te gusten
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/rutinas/nueva"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-xl"
              >
                ➕ Nueva Rutina
              </Link>
              <Link
                href="/rutinas"
                className="bg-gray-700/50 hover:bg-gray-600/50 text-white px-8 py-3 rounded-full font-medium transition-all backdrop-blur-sm border border-gray-600/50"
              >
                📊 Mis Rutinas
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <BottomNavbar />
    </div>
  );
}