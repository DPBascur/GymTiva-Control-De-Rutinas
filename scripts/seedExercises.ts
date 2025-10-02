import dbConnect from '../src/lib/mongodb';
import { Exercise } from '../src/models';

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
    name: 'Extensiones de tríceps',
    muscleGroup: 'brazos',
    caloriesPerMinute: 5,
    description: 'Ejercicio para la parte posterior del brazo',
    instructions: [
      'Mancuerna por encima de la cabeza con ambas manos',
      'Baja la mancuerna detrás de la cabeza flexionando los codos',
      'Extiende los brazos para volver a la posición inicial'
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

async function seedExercises() {
  try {
    await dbConnect();
    
    // Limpiar ejercicios existentes
    await Exercise.deleteMany({});
    
    // Insertar nuevos ejercicios
    const insertedExercises = await Exercise.insertMany(exercises);
    
    console.log(`✅ Se insertaron ${insertedExercises.length} ejercicios correctamente`);
    
    // Mostrar resumen por grupo muscular
    const groups = [...new Set(exercises.map(ex => ex.muscleGroup))];
    for (const group of groups) {
      const count = exercises.filter(ex => ex.muscleGroup === group).length;
      console.log(`   • ${group}: ${count} ejercicios`);
    }
    
  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error);
  }
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
  seedExercises();
}

export default seedExercises;