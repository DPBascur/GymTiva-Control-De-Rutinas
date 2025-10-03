// Script para poblar la base de datos con ejercicios iniciales
import { config } from 'dotenv';
import mongoose from 'mongoose';

// Cargar variables de entorno
config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Por favor define la variable MONGODB_URI en .env.local');
}

// Conectar a MongoDB
async function dbConnect() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  return mongoose.connect(MONGODB_URI);
}

// Modelo de Exercise
const ExerciseSchema = new mongoose.Schema({
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
    default: 5,
  },
  description: String,
  instructions: [String],
});

const Exercise = mongoose.models.Exercise || mongoose.model('Exercise', ExerciseSchema);

const exercises = [
  // Pecho
  {
    name: 'Press de banca',
    muscleGroup: 'pecho',
    caloriesPerMinute: 6,
    description: 'Ejercicio fundamental para el desarrollo del pecho',
    instructions: [
      'Acuéstate en el banco con los pies firmes en el suelo',
      'Agarra la barra con las manos separadas al ancho de los hombros',
      'Baja la barra controladamente hasta el pecho',
      'Empuja la barra hacia arriba de forma explosiva'
    ]
  },
  {
    name: 'Flexiones',
    muscleGroup: 'pecho',
    caloriesPerMinute: 8,
    description: 'Ejercicio de peso corporal para pecho y brazos',
    instructions: [
      'Posición de plancha con brazos extendidos',
      'Baja el cuerpo hasta casi tocar el suelo',
      'Empuja hacia arriba hasta la posición inicial'
    ]
  },
  // Espalda
  {
    name: 'Dominadas',
    muscleGroup: 'espalda',
    caloriesPerMinute: 10,
    description: 'Ejercicio de tracción para la espalda superior',
    instructions: [
      'Cuelga de la barra con agarre pronado',
      'Tira del cuerpo hacia arriba hasta que el mentón pase la barra',
      'Baja controladamente a la posición inicial'
    ]
  },
  {
    name: 'Remo con barra',
    muscleGroup: 'espalda',
    caloriesPerMinute: 7,
    description: 'Ejercicio para el grosor de la espalda',
    instructions: [
      'Inclina el torso hacia adelante con la barra en las manos',
      'Tira de la barra hacia el abdomen',
      'Baja controladamente'
    ]
  },
  // Piernas
  {
    name: 'Sentadillas',
    muscleGroup: 'piernas',
    caloriesPerMinute: 9,
    description: 'Ejercicio fundamental para las piernas',
    instructions: [
      'Pies separados al ancho de los hombros',
      'Baja como si te fueras a sentar en una silla',
      'Baja hasta que los muslos estén paralelos al suelo',
      'Sube empujando con los talones'
    ]
  },
  {
    name: 'Peso muerto',
    muscleGroup: 'piernas',
    caloriesPerMinute: 8,
    description: 'Ejercicio compuesto para piernas y espalda baja',
    instructions: [
      'Barra en el suelo frente a ti',
      'Agarra la barra con las manos separadas',
      'Levanta la barra manteniendo la espalda recta',
      'Extiende caderas y rodillas simultáneamente'
    ]
  },
  // Brazos
  {
    name: 'Curl de bíceps',
    muscleGroup: 'brazos',
    caloriesPerMinute: 4,
    description: 'Ejercicio de aislamiento para bíceps',
    instructions: [
      'De pie con mancuernas en las manos',
      'Mantén los codos pegados al cuerpo',
      'Flexiona los brazos llevando las mancuernas al pecho',
      'Baja controladamente'
    ]
  },
  {
    name: 'Fondos en paralelas',
    muscleGroup: 'brazos',
    caloriesPerMinute: 7,
    description: 'Ejercicio para tríceps y pecho inferior',
    instructions: [
      'Apóyate en las barras paralelas con brazos extendidos',
      'Baja el cuerpo flexionando los brazos',
      'Empuja hacia arriba hasta la posición inicial'
    ]
  },
  // Hombros
  {
    name: 'Press militar',
    muscleGroup: 'hombros',
    caloriesPerMinute: 6,
    description: 'Ejercicio principal para el desarrollo de hombros',
    instructions: [
      'De pie con la barra a la altura de los hombros',
      'Empuja la barra verticalmente por encima de la cabeza',
      'Baja controladamente a la posición inicial'
    ]
  },
  {
    name: 'Elevaciones laterales',
    muscleGroup: 'hombros',
    caloriesPerMinute: 4,
    description: 'Ejercicio de aislamiento para hombro medio',
    instructions: [
      'De pie con mancuernas a los lados',
      'Eleva los brazos lateralmente hasta la altura de los hombros',
      'Baja controladamente'
    ]
  },
  // Core
  {
    name: 'Plancha',
    muscleGroup: 'core',
    caloriesPerMinute: 7,
    description: 'Ejercicio isométrico para el core',
    instructions: [
      'Posición de flexión apoyado en antebrazos',
      'Mantén el cuerpo recto como una tabla',
      'Contrae el abdomen y mantén la posición'
    ]
  },
  {
    name: 'Abdominales',
    muscleGroup: 'core',
    caloriesPerMinute: 6,
    description: 'Ejercicio básico para abdominales',
    instructions: [
      'Acostado boca arriba con rodillas flexionadas',
      'Eleva el torso contrayendo los abdominales',
      'Baja controladamente'
    ]
  },
  // Cardio
  {
    name: 'Burpees',
    muscleGroup: 'cardio',
    caloriesPerMinute: 15,
    description: 'Ejercicio de alta intensidad',
    instructions: [
      'De pie, baja a posición de cuclillas',
      'Salta hacia atrás a posición de plancha',
      'Haz una flexión',
      'Salta hacia adelante y luego salta verticalmente'
    ]
  },
  {
    name: 'Mountain Climbers',
    muscleGroup: 'cardio',
    caloriesPerMinute: 12,
    description: 'Ejercicio cardiovascular intenso',
    instructions: [
      'Posición de plancha',
      'Lleva alternadamente las rodillas al pecho',
      'Mantén un ritmo rápido'
    ]
  }
];

async function seedDatabase() {
  try {
    console.log('🔄 Conectando a MongoDB Atlas...');
    await dbConnect();
    
    console.log('🗑️ Limpiando ejercicios existentes...');
    await Exercise.deleteMany({});
    
    console.log('📝 Insertando ejercicios nuevos...');
    const insertedExercises = await Exercise.insertMany(exercises);
    
    console.log(`✅ Se insertaron ${insertedExercises.length} ejercicios correctamente`);
    
    // Mostrar resumen por grupo muscular
    const groups = ['pecho', 'espalda', 'piernas', 'brazos', 'hombros', 'core', 'cardio'];
    console.log('\n📊 Resumen por grupo muscular:');
    
    for (const group of groups) {
      const count = exercises.filter(ex => ex.muscleGroup === group).length;
      console.log(`   💪 ${group}: ${count} ejercicios`);
    }
    
    console.log('\n🎉 ¡Base de datos poblada exitosamente!');
    console.log('🔗 Ahora puedes usar la app para registrar rutinas');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error);
    process.exit(1);
  }
}

// Ejecutar el script
seedDatabase();