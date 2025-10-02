import { Schema, model, models } from 'mongoose';

// Modelo de Usuario
const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
  },
  weight: {
    type: Number,
    default: 70, // peso en kg
  },
  height: {
    type: Number,
    default: 175, // altura en cm
  },
  age: {
    type: Number,
    default: 25,
  },
  activityLevel: {
    type: String,
    enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'],
    default: 'moderate',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Modelo de Ejercicio
const ExerciseSchema = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre del ejercicio es obligatorio'],
  },
  muscleGroup: {
    type: String,
    required: [true, 'El grupo muscular es obligatorio'],
    enum: ['pecho', 'espalda', 'piernas', 'brazos', 'hombros', 'core', 'cardio'],
  },
  caloriesPerMinute: {
    type: Number,
    default: 5, // calorías quemadas por minuto
  },
  description: String,
  instructions: [String],
});

// Modelo de Rutina
const WorkoutSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  exercises: [{
    exerciseId: {
      type: Schema.Types.ObjectId,
      ref: 'Exercise',
      required: true,
    },
    sets: {
      type: Number,
      default: 3,
    },
    reps: {
      type: Number,
      default: 12,
    },
    weight: Number, // peso usado en kg
    duration: Number, // duración en minutos
    notes: String,
  }],
  totalDuration: Number, // duración total en minutos
  totalCaloriesBurned: Number,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Modelo de Comida
const FoodSchema = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre de la comida es obligatorio'],
  },
  caloriesPer100g: {
    type: Number,
    required: [true, 'Las calorías por 100g son obligatorias'],
  },
  protein: Number, // gramos por 100g
  carbs: Number, // gramos por 100g
  fat: Number, // gramos por 100g
  fiber: Number, // gramos por 100g
});

// Modelo de Registro de Nutrición
const NutritionLogSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  meals: [{
    foodId: {
      type: Schema.Types.ObjectId,
      ref: 'Food',
      required: true,
    },
    quantity: {
      type: Number,
      required: true, // en gramos
    },
    mealType: {
      type: String,
      enum: ['desayuno', 'almuerzo', 'merienda', 'cena', 'snack'],
      required: true,
    },
    calories: Number, // calculado automáticamente
  }],
  totalCalories: Number,
  totalProtein: Number,
  totalCarbs: Number,
  totalFat: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Exportar modelos
export const User = models.User || model('User', UserSchema);
export const Exercise = models.Exercise || model('Exercise', ExerciseSchema);
export const Workout = models.Workout || model('Workout', WorkoutSchema);
export const Food = models.Food || model('Food', FoodSchema);
export const NutritionLog = models.NutritionLog || model('NutritionLog', NutritionLogSchema);