import mongoose from 'mongoose';

const ExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  muscleGroup: { type: String, required: true },
  instructions: [String],
  caloriesPerMinute: { type: Number, default: 5 },
  equipment: String,
  difficulty: { type: String, enum: ['Principiante', 'Intermedio', 'Avanzado'], default: 'Intermedio' }
}, {
  timestamps: true
});

const WorkoutExerciseSchema = new mongoose.Schema({
  exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
  exerciseName: String,
  sets: { type: Number, required: true },
  reps: { type: String, required: true }, // String para permitir "al fallo"
  restTime: { type: Number, default: 60 }, // segundos
  notes: String,
  completed: { type: Boolean, default: false },
  weight: Number // peso usado (opcional)
});

const DayWorkoutSchema = new mongoose.Schema({
  dayName: { type: String, required: true }, // "lunes", "martes", etc.
  dayNumber: { type: Number, required: true }, // 1, 2, 3, 4, 5
  muscleGroups: [String], // ["PECHO", "ESPALDA"]
  exercises: [WorkoutExerciseSchema],
  cardio: {
    duration: { type: String, default: "15-30 min" },
    type: { type: String, default: "Libre" },
    completed: { type: Boolean, default: false }
  },
  completed: { type: Boolean, default: false },
  completedAt: Date
});

const WeekSchema = new mongoose.Schema({
  weekNumber: { type: Number, required: true }, // 1, 2, 3, 4
  days: [DayWorkoutSchema],
  completed: { type: Boolean, default: false }
});

const WorkoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['ExoticoTramax', 'Personalizada'], required: true },
  description: String,
  difficulty: { type: String, enum: ['Principiante', 'Intermedio', 'Avanzado'], default: 'Intermedio' },
  duration: String, // "45-60 min"
  frequency: String, // "5 días/semana"
  
  // Progreso de la rutina
  currentWeek: { type: Number, default: 1 },
  currentDay: { type: Number, default: 1 },
  totalWeeks: { type: Number, default: 4 },
  
  weeks: [WeekSchema],
  
  // Estadísticas
  totalWorkouts: { type: Number, default: 0 },
  completedWorkouts: { type: Number, default: 0 },
  startDate: { type: Date, default: Date.now },
  lastWorkoutDate: Date,
  
  // Estado
  isActive: { type: Boolean, default: true },
  isPaused: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Métodos virtuales
WorkoutSchema.virtual('progressPercentage').get(function() {
  if (this.totalWorkouts === 0) return 0;
  return Math.round((this.completedWorkouts / this.totalWorkouts) * 100);
});

WorkoutSchema.virtual('currentWeekData').get(function() {
  return this.weeks.find(week => week.weekNumber === this.currentWeek);
});

WorkoutSchema.virtual('currentDayData').get(function() {
  const currentWeek = this.currentWeekData;
  if (!currentWeek) return null;
  return currentWeek.days.find(day => day.dayNumber === this.currentDay);
});

// Middleware para calcular totalWorkouts
WorkoutSchema.pre('save', function(next) {
  if (this.weeks && this.weeks.length > 0) {
    let total = 0;
    this.weeks.forEach(week => {
      total += week.days.length;
    });
    this.totalWorkouts = total;
    
    // Calcular workouts completados
    let completed = 0;
    this.weeks.forEach(week => {
      week.days.forEach(day => {
        if (day.completed) completed++;
      });
    });
    this.completedWorkouts = completed;
  }
  next();
});

export const Exercise = mongoose.models.Exercise || mongoose.model('Exercise', ExerciseSchema);
export const Workout = mongoose.models.Workout || mongoose.model('Workout', WorkoutSchema);