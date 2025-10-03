// ExoticoTramax routine generator

export interface ExoticoTraMaxRoutine {
  week1: WeekData;
  week2: WeekData;
}

export interface WeekData {
  lunes: DayData;
  martes: DayData;
  miercoles: DayData;
  jueves: DayData;
  viernes: DayData;
}

export interface DayData {
  muscleGroups: string[];
  exercises: ExerciseData[];
}

export interface ExerciseData {
  name: string;
  sets: number;
  reps: string;
  muscleGroup: string;
}

export const EXOTICO_TRAMAX_ROUTINE: ExoticoTraMaxRoutine = {
  week1: {
    lunes: {
      muscleGroups: ["PECHO", "ESPALDA"],
      exercises: [
        { name: "Press inclinado con mancuernas", sets: 3, reps: "12", muscleGroup: "pecho" },
        { name: "Jalón al pecho", sets: 3, reps: "12", muscleGroup: "espalda" },
        { name: "Press plano", sets: 3, reps: "12", muscleGroup: "pecho" },
        { name: "Remo en T o remo con barra", sets: 3, reps: "12", muscleGroup: "espalda" },
        { name: "Aperturas en peck deck", sets: 3, reps: "12", muscleGroup: "pecho" },
        { name: "Pull over", sets: 3, reps: "12", muscleGroup: "espalda" }
      ]
    },
    martes: {
      muscleGroups: ["PIERNAS"],
      exercises: [
        { name: "Hack o prensa", sets: 3, reps: "12", muscleGroup: "piernas" },
        { name: "Extensión de cuádriceps", sets: 3, reps: "al fallo", muscleGroup: "piernas" },
        { name: "Curl femoral acostado o sentado", sets: 3, reps: "al fallo", muscleGroup: "piernas" },
        { name: "Abductores", sets: 3, reps: "12", muscleGroup: "piernas" },
        { name: "Aductores", sets: 3, reps: "12", muscleGroup: "piernas" },
        { name: "Gemelos", sets: 3, reps: "12", muscleGroup: "piernas" }
      ]
    },
    miercoles: {
      muscleGroups: ["BRAZOS", "HOMBROS"],
      exercises: [
        { name: "Press militar", sets: 3, reps: "12", muscleGroup: "hombros" },
        { name: "Laterales unilateral", sets: 3, reps: "al fallo", muscleGroup: "hombros" },
        { name: "Posterior en peck deck o en polea", sets: 3, reps: "al fallo", muscleGroup: "hombros" },
        { name: "Press francés", sets: 3, reps: "12", muscleGroup: "brazos" },
        { name: "Extensión de tríceps con agarre en V", sets: 3, reps: "12", muscleGroup: "brazos" },
        { name: "Curl predicador", sets: 3, reps: "12", muscleGroup: "brazos" },
        { name: "Martillo", sets: 3, reps: "12", muscleGroup: "brazos" }
      ]
    },
    jueves: {
      muscleGroups: ["ABDOMEN"],
      exercises: [
        { name: "Elevación de piernas", sets: 3, reps: "12", muscleGroup: "core" },
        { name: "Crunch en polea", sets: 3, reps: "12", muscleGroup: "core" },
        { name: "Rueda abdominal", sets: 3, reps: "12", muscleGroup: "core" },
        { name: "Abdominales laterales (oblicuos)", sets: 3, reps: "12", muscleGroup: "core" }
      ]
    },
    viernes: {
      muscleGroups: ["PECHO", "ESPALDA"],
      exercises: [
        { name: "Press inclinado con mancuernas", sets: 3, reps: "12", muscleGroup: "pecho" },
        { name: "Jalón al pecho", sets: 3, reps: "12", muscleGroup: "espalda" },
        { name: "Press plano", sets: 3, reps: "12", muscleGroup: "pecho" },
        { name: "Remo en T o remo con barra", sets: 3, reps: "12", muscleGroup: "espalda" },
        { name: "Aperturas en peck deck", sets: 3, reps: "12", muscleGroup: "pecho" },
        { name: "Pull over", sets: 3, reps: "12", muscleGroup: "espalda" }
      ]
    }
  },
  week2: {
    lunes: {
      muscleGroups: ["BRAZOS", "HOMBROS"],
      exercises: [
        { name: "Press militar", sets: 3, reps: "12", muscleGroup: "hombros" },
        { name: "Laterales unilateral", sets: 3, reps: "al fallo", muscleGroup: "hombros" },
        { name: "Posterior en peck deck o en polea", sets: 3, reps: "al fallo", muscleGroup: "hombros" },
        { name: "Press francés", sets: 3, reps: "12", muscleGroup: "brazos" },
        { name: "Extensión de tríceps con agarre en V", sets: 3, reps: "12", muscleGroup: "brazos" },
        { name: "Curl predicador", sets: 3, reps: "12", muscleGroup: "brazos" },
        { name: "Martillo", sets: 3, reps: "12", muscleGroup: "brazos" }
      ]
    },
    martes: {
      muscleGroups: ["PIERNAS"],
      exercises: [
        { name: "Hack o prensa", sets: 3, reps: "12", muscleGroup: "piernas" },
        { name: "Extensión de cuádriceps", sets: 3, reps: "al fallo", muscleGroup: "piernas" },
        { name: "Curl femoral acostado o sentado", sets: 3, reps: "al fallo", muscleGroup: "piernas" },
        { name: "Abductores", sets: 3, reps: "12", muscleGroup: "piernas" },
        { name: "Aductores", sets: 3, reps: "12", muscleGroup: "piernas" },
        { name: "Gemelos", sets: 3, reps: "12", muscleGroup: "piernas" }
      ]
    },
    miercoles: {
      muscleGroups: ["PECHO", "ESPALDA"],
      exercises: [
        { name: "Press inclinado con mancuernas", sets: 3, reps: "12", muscleGroup: "pecho" },
        { name: "Jalón al pecho", sets: 3, reps: "12", muscleGroup: "espalda" },
        { name: "Press plano", sets: 3, reps: "12", muscleGroup: "pecho" },
        { name: "Remo en T o remo con barra", sets: 3, reps: "12", muscleGroup: "espalda" },
        { name: "Aperturas en peck deck", sets: 3, reps: "12", muscleGroup: "pecho" },
        { name: "Pull over", sets: 3, reps: "12", muscleGroup: "espalda" }
      ]
    },
    jueves: {
      muscleGroups: ["ABDOMEN"],
      exercises: [
        { name: "Elevación de piernas", sets: 3, reps: "12", muscleGroup: "core" },
        { name: "Crunch en polea", sets: 3, reps: "12", muscleGroup: "core" },
        { name: "Rueda abdominal", sets: 3, reps: "12", muscleGroup: "core" },
        { name: "Abdominales laterales (oblicuos)", sets: 3, reps: "12", muscleGroup: "core" }
      ]
    },
    viernes: {
      muscleGroups: ["BRAZOS", "HOMBROS"],
      exercises: [
        { name: "Press militar", sets: 3, reps: "12", muscleGroup: "hombros" },
        { name: "Laterales unilateral", sets: 3, reps: "al fallo", muscleGroup: "hombros" },
        { name: "Posterior en peck deck o en polea", sets: 3, reps: "al fallo", muscleGroup: "hombros" },
        { name: "Press francés", sets: 3, reps: "12", muscleGroup: "brazos" },
        { name: "Extensión de tríceps con agarre en V", sets: 3, reps: "12", muscleGroup: "brazos" },
        { name: "Curl predicador", sets: 3, reps: "12", muscleGroup: "brazos" },
        { name: "Martillo", sets: 3, reps: "12", muscleGroup: "brazos" }
      ]
    }
  }
};

export function createExoticoTraMaxWorkout(userId: string, userName: string = 'Usuario') {
  const dayNames = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];
  
  const weeks = [];
  
  for (let weekNum = 1; weekNum <= 4; weekNum++) {
    const weekPattern = weekNum % 2 === 1 ? EXOTICO_TRAMAX_ROUTINE.week1 : EXOTICO_TRAMAX_ROUTINE.week2;
    
    const days = dayNames.map((dayName, index) => {
      const dayData = weekPattern[dayName as keyof WeekData];
      
      return {
        dayName: dayName.charAt(0).toUpperCase() + dayName.slice(1),
        dayNumber: index + 1,
        muscleGroups: dayData.muscleGroups,
        exercises: dayData.exercises.map(exercise => ({
          exerciseName: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          restTime: 60,
          completed: false,
          muscleGroup: exercise.muscleGroup
        })),
        cardio: {
          duration: "15-30 min",
          type: "Libre",
          completed: false
        },
        completed: false
      };
    });
    
    weeks.push({
      weekNumber: weekNum,
      days: days,
      completed: false
    });
  }
  
  return {
    userId: userId,
    name: `Rutina ExoticoTramax - ${userName}`,
    type: 'ExoticoTramax',
    description: 'Rutina profesional de 4 semanas con alternancia de grupos musculares. Incluye cardio diario de 15-30 minutos.',
    difficulty: 'Intermedio',
    duration: '45-60 min',
    frequency: '5 días/semana',
    currentWeek: 1,
    currentDay: 1,
    totalWeeks: 4,
    weeks: weeks,
    totalWorkouts: 20, // 5 días x 4 semanas
    completedWorkouts: 0,
    startDate: new Date(),
    isActive: true,
    isPaused: false
  };
}