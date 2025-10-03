'use client';

import { useState } from 'react';
import Link from 'next/link';
import WelcomeHeader from '@/components/WelcomeHeader';
import BottomNavbar from '@/components/BottomNavbar';

export default function NuevaRutinaPage() {
  const [selectedOption, setSelectedOption] = useState<string>('');

  const rutinaOptions = [
    {
      id: 'exotico-tramax',
      title: 'Rutina ExoticoTramax',
      subtitle: 'Rutina profesional diseñada por expertos',
      description: 'Una rutina completa y balanceada que incluye ejercicios para todos los grupos musculares. Perfecta para principiantes y experimentados.',
      icon: '🔥',
      gradient: 'from-gym-purple via-gym-pink to-gym-cyan',
      benefits: [
        'Rutina pre-diseñada y probada',
        'Ejercicios balanceados',
        'Progresión automática',
        'Instrucciones detalladas'
      ],
      difficulty: 'Intermedio',
      duration: '45-60 min',
      frequency: '3-4 veces/semana'
    },
    {
      id: 'personalizada',
      title: 'Rutina Personalizada',
      subtitle: 'Crea tu propia rutina desde cero',
      description: 'Diseña una rutina completamente personalizada seleccionando tus ejercicios favoritos y estableciendo tus propios objetivos.',
      icon: '⚡',
      gradient: 'from-gym-lime via-gym-cyan to-gym-purple',
      benefits: [
        'Totalmente personalizable',
        'Selección libre de ejercicios',
        'Objetivos específicos',
        'Control total sobre la rutina'
      ],
      difficulty: 'Avanzado',
      duration: 'Variable',
      frequency: 'A tu ritmo'
    }
  ];

  const [isCreating, setIsCreating] = useState(false);

  const handleCreateRutina = async () => {
    if (!selectedOption || isCreating) return;
    
    setIsCreating(true);
    
    try {
      const response = await fetch('/api/workouts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          type: selectedOption
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la rutina');
      }

      console.log('✅ Rutina creada exitosamente:', data);
      
      // Redirigir a la página de rutinas
      window.location.href = '/rutinas';
      
    } catch (error) {
      console.error('❌ Error creando rutina:', error);
      alert(error instanceof Error ? error.message : 'Error al crear la rutina');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-exotico pb-20">
      <main className="container mx-auto px-4 py-8">
        <WelcomeHeader />
        
        {/* Header */}
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-3xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                ➕ Nueva Rutina
              </h1>
              <p className="text-gray-400">
                Elige cómo quieres crear tu rutina de entrenamiento
              </p>
            </div>
            <Link
              href="/rutinas"
              className="bg-gray-700/50 hover:bg-gray-600/50 text-white px-6 py-3 rounded-full font-medium transition-all backdrop-blur-sm border border-gray-600/50"
            >
              ← Volver
            </Link>
          </div>
        </div>

        {/* Opciones de rutina */}
        <div className="space-y-6 mb-8">
          {rutinaOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => setSelectedOption(option.id)}
              className={`cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                selectedOption === option.id
                  ? 'ring-2 ring-purple-500 shadow-2xl shadow-purple-500/20'
                  : 'hover:shadow-xl'
              }`}
            >
              <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-3xl p-6">
                <div className="flex items-start gap-6">
                  {/* Icono y gradiente */}
                  <div className={`bg-gradient-to-r ${option.gradient} p-4 rounded-2xl shadow-lg flex-shrink-0`}>
                    <div className="text-3xl text-white">{option.icon}</div>
                  </div>
                  
                  {/* Contenido principal */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-white">{option.title}</h3>
                      <div className={`w-6 h-6 rounded-full border-2 transition-all ${
                        selectedOption === option.id
                          ? 'border-purple-500 bg-purple-500'
                          : 'border-gray-600'
                      }`}>
                        {selectedOption === option.id && (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-purple-400 font-medium mb-3">{option.subtitle}</p>
                    <p className="text-gray-400 mb-4 leading-relaxed">{option.description}</p>
                    
                    {/* Detalles de la rutina */}
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-gray-900/50 rounded-xl p-3 text-center">
                        <div className="text-purple-400 text-sm font-medium">Dificultad</div>
                        <div className="text-white font-bold">{option.difficulty}</div>
                      </div>
                      <div className="bg-gray-900/50 rounded-xl p-3 text-center">
                        <div className="text-purple-400 text-sm font-medium">Duración</div>
                        <div className="text-white font-bold">{option.duration}</div>
                      </div>
                      <div className="bg-gray-900/50 rounded-xl p-3 text-center">
                        <div className="text-purple-400 text-sm font-medium">Frecuencia</div>
                        <div className="text-white font-bold">{option.frequency}</div>
                      </div>
                    </div>
                    
                    {/* Beneficios */}
                    <div>
                      <h4 className="text-white font-semibold mb-2">✨ Beneficios:</h4>
                      <div className="grid md:grid-cols-2 gap-2">
                        {option.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center gap-2 text-gray-300">
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full flex-shrink-0"></div>
                            <span className="text-sm">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Botón de crear rutina */}
        {selectedOption && (
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-3xl p-6">
            <div className="text-center">
              <div className="mb-4">
                <div className="text-2xl mb-2">🎯</div>
                <h3 className="text-white text-xl font-bold mb-2">
                  ¿Listo para comenzar?
                </h3>
                <p className="text-gray-400">
                  {selectedOption === 'exotico-tramax' 
                    ? 'Configuraremos tu rutina ExoticoTramax con ejercicios profesionales'
                    : 'Te ayudaremos a crear tu rutina personalizada paso a paso'
                  }
                </p>
              </div>
              
              <button
                onClick={handleCreateRutina}
                disabled={isCreating}
                className={`${
                  isCreating
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transform hover:scale-105'
                } text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl`}
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Creando...
                  </>
                ) : (
                  '🚀 Crear Mi Rutina'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Información adicional */}
        {!selectedOption && (
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-3xl p-8 text-center">
            <div className="text-4xl mb-4">💡</div>
            <h3 className="text-white text-xl font-bold mb-3">Elige tu tipo de rutina</h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Selecciona una de las opciones arriba para comenzar a crear tu rutina de entrenamiento. 
              Cada opción está diseñada para adaptarse a diferentes niveles y objetivos fitness.
            </p>
          </div>
        )}
      </main>

      <BottomNavbar />
    </div>
  );
}