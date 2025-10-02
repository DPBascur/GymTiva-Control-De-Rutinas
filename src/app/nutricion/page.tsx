'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Food {
  _id: string;
  name: string;
  caloriesPer100g: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface Meal {
  foodId: string;
  quantity: number;
  mealType: 'desayuno' | 'almuerzo' | 'merienda' | 'cena' | 'snack';
  calories?: number;
}

export default function NutricionPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedMealType, setSelectedMealType] = useState<string>('desayuno');
  const [selectedFood, setSelectedFood] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(100);
  const [saving, setSaving] = useState(false);

  // Alimentos predefinidos comunes (en producción estos vendrían de la DB)
  const commonFoods: Food[] = [
    { _id: '1', name: 'Pechuga de pollo', caloriesPer100g: 165, protein: 31, carbs: 0, fat: 3.6 },
    { _id: '2', name: 'Arroz blanco cocido', caloriesPer100g: 130, protein: 2.7, carbs: 28, fat: 0.3 },
    { _id: '3', name: 'Brócoli', caloriesPer100g: 34, protein: 2.8, carbs: 7, fat: 0.4 },
    { _id: '4', name: 'Plátano', caloriesPer100g: 89, protein: 1.1, carbs: 23, fat: 0.3 },
    { _id: '5', name: 'Avena', caloriesPer100g: 389, protein: 16.9, carbs: 66, fat: 6.9 },
    { _id: '6', name: 'Huevo entero', caloriesPer100g: 155, protein: 13, carbs: 1.1, fat: 11 },
    { _id: '7', name: 'Salmón', caloriesPer100g: 208, protein: 25, carbs: 0, fat: 12 },
    { _id: '8', name: 'Batata', caloriesPer100g: 86, protein: 1.6, carbs: 20, fat: 0.1 },
  ];

  const addMeal = () => {
    if (!selectedFood) {
      alert('Selecciona un alimento');
      return;
    }

    const food = commonFoods.find(f => f._id === selectedFood);
    if (!food) return;

    const calories = (food.caloriesPer100g * quantity) / 100;

    const newMeal: Meal = {
      foodId: selectedFood,
      quantity,
      mealType: selectedMealType as Meal['mealType'],
      calories,
    };

    setMeals([...meals, newMeal]);
    setQuantity(100);
  };

  const removeMeal = (index: number) => {
    setMeals(meals.filter((_, i) => i !== index));
  };

  const saveDayNutrition = async () => {
    if (meals.length === 0) {
      alert('Agrega al menos una comida');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/nutrition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'temp-user-id', // En producción esto vendría de la autenticación
          meals: meals,
        }),
      });

      if (response.ok) {
        alert('¡Registro nutricional guardado exitosamente!');
        setMeals([]);
      } else {
        throw new Error('Error al guardar el registro');
      }
    } catch (error) {
      console.error('Error al guardar nutrición:', error);
      alert('Error al guardar el registro nutricional');
    } finally {
      setSaving(false);
    }
  };

  const getFoodName = (foodId: string) => {
    const food = commonFoods.find(f => f._id === foodId);
    return food ? food.name : 'Alimento desconocido';
  };

  const getTotalCalories = () => {
    return meals.reduce((total, meal) => total + (meal.calories || 0), 0);
  };

  const getMealsByType = (type: string) => {
    return meals.filter(meal => meal.mealType === type);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🍎 Control Nutricional
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Registra tus comidas y controla las calorías diarias
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
        {/* Agregar Comida */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Agregar Comida</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo de Comida
              </label>
              <select
                value={selectedMealType}
                onChange={(e) => setSelectedMealType(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="desayuno">🌅 Desayuno</option>
                <option value="almuerzo">☀️ Almuerzo</option>
                <option value="merienda">🍪 Merienda</option>
                <option value="cena">🌙 Cena</option>
                <option value="snack">🥜 Snack</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Alimento
              </label>
              <select
                value={selectedFood}
                onChange={(e) => setSelectedFood(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Seleccionar alimento...</option>
                {commonFoods.map((food) => (
                  <option key={food._id} value={food._id}>
                    {food.name} ({food.caloriesPer100g} cal/100g)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cantidad (gramos)
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                min="1"
              />
            </div>

            <button
              onClick={addMeal}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              ➕ Agregar Comida
            </button>
          </div>
        </div>

        {/* Registro del Día */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Registro de Hoy</h2>

          {meals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">🍽️</div>
              <p>Agrega comidas para ver tu registro diario</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Resumen de Calorías */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 dark:text-green-200">
                  Total del Día: {getTotalCalories().toFixed(0)} calorías
                </h3>
              </div>

              {/* Comidas por tipo */}
              {['desayuno', 'almuerzo', 'merienda', 'cena', 'snack'].map((mealType) => {
                const mealsByType = getMealsByType(mealType);
                if (mealsByType.length === 0) return null;

                const typeEmojis = {
                  desayuno: '🌅',
                  almuerzo: '☀️',
                  merienda: '🍪',
                  cena: '🌙',
                  snack: '🥜'
                };

                return (
                  <div key={mealType} className="border rounded-lg p-4">
                    <h4 className="font-medium capitalize mb-3">
                      {typeEmojis[mealType as keyof typeof typeEmojis]} {mealType}
                    </h4>
                    <div className="space-y-2">
                      {mealsByType.map((meal, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span>
                            {getFoodName(meal.foodId)} - {meal.quantity}g
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">
                              {meal.calories?.toFixed(0)} cal
                            </span>
                            <button
                              onClick={() => removeMeal(meals.findIndex(m => m === meal))}
                              className="text-red-600 hover:text-red-800"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              <div className="pt-4 border-t">
                <button
                  onClick={saveDayNutrition}
                  disabled={saving}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {saving ? '💾 Guardando...' : '💾 Guardar Registro Diario'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}