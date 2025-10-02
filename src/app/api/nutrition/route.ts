import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { NutritionLog, Food } from '@/models';

// GET - Obtener registros de nutrición
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const date = searchParams.get('date');

    if (!userId) {
      return NextResponse.json({ error: 'Usuario requerido' }, { status: 400 });
    }

    const query: { userId: string; date?: object } = { userId };
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    const nutritionLogs = await NutritionLog.find(query)
      .populate('meals.foodId')
      .sort({ date: -1 })
      .limit(20);

    return NextResponse.json({ nutritionLogs });
  } catch (error) {
    console.error('Error al obtener registros de nutrición:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST - Crear registro de nutrición
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { userId, meals } = body;

    if (!userId || !meals || meals.length === 0) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    // Calcular totales de calorías y macros
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    const processedMeals = [];

    for (const meal of meals) {
      const food = await Food.findById(meal.foodId);
      if (food) {
        const multiplier = meal.quantity / 100; // cantidad en gramos / 100g
        const mealCalories = food.caloriesPer100g * multiplier;
        
        totalCalories += mealCalories;
        totalProtein += (food.protein || 0) * multiplier;
        totalCarbs += (food.carbs || 0) * multiplier;
        totalFat += (food.fat || 0) * multiplier;

        processedMeals.push({
          ...meal,
          calories: mealCalories,
        });
      }
    }

    const nutritionLog = new NutritionLog({
      userId,
      meals: processedMeals,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
    });

    await nutritionLog.save();
    await nutritionLog.populate('meals.foodId');

    return NextResponse.json({ nutritionLog }, { status: 201 });
  } catch (error) {
    console.error('Error al crear registro de nutrición:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}