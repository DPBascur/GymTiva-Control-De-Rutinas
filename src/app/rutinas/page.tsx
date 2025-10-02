'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Exercise {
  _id: string;
  name: string;
  muscleGroup: string;
  caloriesPerMinute: number;
}

interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  notes?: string;
}

export default function RutinasPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workout, setWorkout] = useState<WorkoutExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await fetch('/api/exercises');
      const data = await response.json();
      setExercises(data.exercises || []);
    } catch (error) {
      console.error('Error al cargar ejercicios:', error);
    } finally {
      setLoading(false);
    }
  };

  const addExercise = (exerciseId: string) => {
    const newExercise: WorkoutExercise = {
      exerciseId,
      sets: 3,
      reps: 12,
      duration: 5,
    };
    setWorkout([...workout, newExercise]);
  };

  const updateExercise = (index: number, field: keyof WorkoutExercise, value: any) => {
    const updatedWorkout = [...workout];
    updatedWorkout[index] = { ...updatedWorkout[index], [field]: value };
    setWorkout(updatedWorkout);
  };

  const removeExercise = (index: number) => {
    setWorkout(workout.filter((_, i) => i !== index));
  };

  const saveWorkout = async () => {
    if (workout.length === 0) {
      alert('Agrega al menos un ejercicio a tu rutina');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'temp-user-id', // En producción esto vendría de la autenticación
          exercises: workout,
        }),
      });

      if (response.ok) {
        alert('¡Rutina guardada exitosamente!');
        setWorkout([]);
      } else {
        throw new Error('Error al guardar la rutina');
      }
    } catch (error) {
      console.error('Error al guardar rutina:', error);
      alert('Error al guardar la rutina');
    } finally {
      setSaving(false);
    }
  };

  const getExerciseName = (exerciseId: string) => {
    const exercise = exercises.find(ex => ex._id === exerciseId);
    return exercise ? exercise.name : 'Ejercicio desconocido';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-2xl">⏳ Cargando ejercicios...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            💪 Rutinas de Gym
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Crea tu rutina diaria con 3 ciclos y 12 repeticiones
          </p>
        </div>
        <Link
          href="/"
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          ← Volver al Inicio
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Lista de Ejercicios Disponibles */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Ejercicios Disponibles</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {exercises.map((exercise) => (
              <div
                key={exercise._id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div>
                  <h3 className="font-medium">{exercise.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">
                    {exercise.muscleGroup} • {exercise.caloriesPerMinute} cal/min
                  </p>
                </div>
                <button
                  onClick={() => addExercise(exercise._id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                >
                  Agregar
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Rutina Actual */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Tu Rutina de Hoy</h2>
          
          {workout.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">🏋️‍♂️</div>
              <p>Selecciona ejercicios para crear tu rutina</p>
            </div>
          ) : (
            <div className="space-y-4">
              {workout.map((exercise, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">{getExerciseName(exercise.exerciseId)}</h3>
                    <button
                      onClick={() => removeExercise(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Ciclos
                      </label>
                      <input
                        type="number"
                        value={exercise.sets}
                        onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Repeticiones
                      </label>
                      <input
                        type="number"
                        value={exercise.reps}
                        onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus-ring-blue-500"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Peso (kg)
                      </label>
                      <input
                        type="number"
                        value={exercise.weight || ''}
                        onChange={(e) => updateExercise(index, 'weight', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                        step="0.5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Duración (min)
                      </label>
                      <input
                        type="number"
                        value={exercise.duration || ''}
                        onChange={(e) => updateExercise(index, 'duration', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="pt-4 border-t">
                <button
                  onClick={saveWorkout}
                  disabled={saving}
                  className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {saving ? '💾 Guardando...' : '💾 Guardar Rutina'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}