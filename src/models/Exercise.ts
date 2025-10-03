import mongoose, { Schema, Document } from 'mongoose';

export interface IExercise extends Document {
  name: string;
  description?: string;
  muscleGroup: string;
  equipment?: string;
  difficulty?: 'Principiante' | 'Intermedio' | 'Avanzado';
  instructions?: string[];
  videoUrl?: string;
  imageUrl?: string;
  caloriesPerMinute: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ExerciseSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  muscleGroup: {
    type: String,
    required: true,
    enum: ['pecho', 'espalda', 'hombros', 'brazos', 'piernas', 'abdomen', 'cardio', 'full-body']
  },
  equipment: {
    type: String,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['Principiante', 'Intermedio', 'Avanzado'],
    default: 'Intermedio'
  },
  instructions: [{
    type: String
  }],
  videoUrl: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true
  },
  caloriesPerMinute: {
    type: Number,
    default: 5
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índices para búsqueda rápida
ExerciseSchema.index({ name: 1 });
ExerciseSchema.index({ muscleGroup: 1 });
ExerciseSchema.index({ difficulty: 1 });

export const Exercise = mongoose.models.Exercise || mongoose.model<IExercise>('Exercise', ExerciseSchema);
