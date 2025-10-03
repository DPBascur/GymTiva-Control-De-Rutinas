import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
    maxlength: [50, 'El nombre no puede exceder 50 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingresa un email válido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
  },
  profile: {
    age: {
      type: Number,
      required: [true, 'La edad es requerida'],
      min: [13, 'La edad mínima es 13 años'],
      max: [100, 'La edad máxima es 100 años']
    },
    weight: {
      type: Number,
      required: [true, 'El peso es requerido'],
      min: [30, 'El peso mínimo es 30 kg'],
      max: [300, 'El peso máximo es 300 kg']
    },
    height: {
      type: Number,
      required: [true, 'La altura es requerida'],
      min: [120, 'La altura mínima es 120 cm'],
      max: [250, 'La altura máxima es 250 cm']
    },
    bmi: {
      type: Number,
      default: function() {
        return Number((this.weight / Math.pow(this.height / 100, 2)).toFixed(1));
      }
    }
  },
  preferences: {
    units: {
      type: String,
      enum: ['metric', 'imperial'],
      default: 'metric'
    },
    goals: [{
      type: String,
      enum: ['lose_weight', 'gain_muscle', 'maintain_fitness', 'increase_strength', 'improve_endurance']
    }]
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      return ret;
    }
  }
});

// Índices para optimizar consultas
// Nota: El índice de email se crea automáticamente por unique: true
UserSchema.index({ createdAt: -1 });

// Middleware para calcular IMC antes de guardar
UserSchema.pre('save', function(next) {
  if (this.profile && this.profile.weight && this.profile.height) {
    this.profile.bmi = Number((this.profile.weight / Math.pow(this.profile.height / 100, 2)).toFixed(1));
  }
  next();
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);