'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface User {
  id: string;
  name: string;
  email: string;
  profile?: {
    age: number;
    weight: number;
    height: number;
    bmi: number;
  };
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    // Obtener datos del usuario desde localStorage
    const userData = localStorage.getItem('user-data');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });

      // Limpiar localStorage independientemente de la respuesta
      localStorage.removeItem('auth-token');
      localStorage.removeItem('user-data');
      
      // Limpiar cookie
      document.cookie = 'auth-token=; path=/; max-age=0';
      
      // Redirigir al login
      window.location.href = '/auth/login';
      
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      
      // Aún así limpiar datos locales y redirigir
      localStorage.removeItem('auth-token');
      localStorage.removeItem('user-data');
      document.cookie = 'auth-token=; path=/; max-age=0';
      window.location.href = '/auth/login';
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo y Título */}
          <Link href="/rutinas" className="flex items-center space-x-3">
            <Image 
              src="/images/GymTiva.png" 
              alt="GymTiva Logo" 
              width={40}
              height={40}
            />
            <span className="text-xl font-bold gym-text-gradient">
              GymTiva
            </span>
          </Link>

          {/* Navegación */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/rutinas" 
              className="text-white/80 hover:text-white transition-colors"
            >
              Rutinas
            </Link>
            <Link 
              href="/rutinas/ejercicios" 
              className="text-white/80 hover:text-white transition-colors"
            >
              Ejercicios
            </Link>
            <Link 
              href="/nutricion" 
              className="text-white/80 hover:text-white transition-colors"
            >
              Nutrición
            </Link>
          </nav>

          {/* Información del usuario y logout */}
          <div className="flex items-center space-x-4">
            {user && (
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-white text-sm font-medium">
                  {user.name}
                </span>
                <span className="text-white/60 text-xs">
                  IMC: {user.profile?.bmi || 'N/A'}
                </span>
              </div>
            )}
            
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center space-x-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 px-4 py-2 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-300"></div>
                  <span className="hidden sm:inline">Cerrando...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="hidden sm:inline">Cerrar Sesión</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}