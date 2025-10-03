'use client';

import Link from 'next/link';
import WelcomeHeader from '@/components/WelcomeHeader';
import BottomNavbar from '@/components/BottomNavbar';

export default function RegistroEntrenamientosPage() {
  return (
    <div className="min-h-screen bg-exotico pb-20">
      <main className="container mx-auto px-4 py-8">
        <WelcomeHeader />
        
        {/* Título de sección */}
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-3xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                📊 Registro de Entrenamientos
              </h1>
              <p className="text-gray-400">
                Seguimiento y análisis de tus sesiones de entrenamiento
              </p>
            </div>
            <Link
              href="/rutinas"
              className="bg-gray-700/50 hover:bg-gray-600/50 text-white px-6 py-3 rounded-full font-medium transition-all backdrop-blur-sm border border-gray-600/50"
            >
              ← Volver a Rutinas
            </Link>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-12 text-center border border-gray-700/50">
          <div className="text-6xl mb-6">�</div>
          <h2 className="text-white text-2xl font-bold mb-4">Registro de Entrenamientos</h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Crea tu primera rutina para comenzar a registrar tus entrenamientos y hacer seguimiento de tu progreso.
          </p>
          
          <Link
            href="/rutinas/nueva"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-xl"
          >
            ➕ Crear Mi Primera Rutina
          </Link>
        </div>
      </main>

      <BottomNavbar />
    </div>
  );
}