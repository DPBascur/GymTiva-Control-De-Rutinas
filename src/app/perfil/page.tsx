'use client';

import { useState, useEffect } from 'react';
import WelcomeHeader from '@/components/WelcomeHeader';
import BottomNavbar from '@/components/BottomNavbar';

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

export default function PerfilPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user-data');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('auth-token');
      localStorage.removeItem('user-data');
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="min-h-screen bg-exotico pb-20">
      <main className="container mx-auto px-4 py-8">
        <WelcomeHeader />
        
        {user && (
          <>
            {/* Información del perfil */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-8 border border-gray-700/50 mb-6">
              <div className="flex items-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mr-6">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                  <p className="text-gray-400">{user.email}</p>
                </div>
              </div>
              
              {user.profile && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-700/30 rounded-2xl">
                    <div className="text-2xl font-bold text-white">{user.profile.age}</div>
                    <div className="text-gray-400 text-sm">Años</div>
                  </div>
                  <div className="text-center p-4 bg-gray-700/30 rounded-2xl">
                    <div className="text-2xl font-bold text-white">{user.profile.weight}</div>
                    <div className="text-gray-400 text-sm">kg</div>
                  </div>
                  <div className="text-center p-4 bg-gray-700/30 rounded-2xl">
                    <div className="text-2xl font-bold text-white">{user.profile.height}</div>
                    <div className="text-gray-400 text-sm">cm</div>
                  </div>
                  <div className="text-center p-4 bg-gray-700/30 rounded-2xl">
                    <div className="text-2xl font-bold text-white">{user.profile.bmi}</div>
                    <div className="text-gray-400 text-sm">IMC</div>
                  </div>
                </div>
              )}
            </div>

            {/* Configuraciones */}
            <div className="space-y-4 mb-6">
              <h3 className="text-xl font-bold text-white mb-4">Configuración</h3>
              
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700/50">
                <button className="w-full p-4 text-left text-white hover:bg-gray-700/30 transition-all rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Editar Perfil</span>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700/50">
                <button className="w-full p-4 text-left text-white hover:bg-gray-700/30 transition-all rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Configuración</span>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700/50">
                <button className="w-full p-4 text-left text-white hover:bg-gray-700/30 transition-all rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Ayuda y Soporte</span>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>

            {/* Botón de cerrar sesión */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-red-500/50">
              <button 
                onClick={handleLogout}
                className="w-full p-4 text-left text-red-400 hover:bg-red-500/10 transition-all rounded-2xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Cerrar Sesión</span>
                  </div>
                </div>
              </button>
            </div>
          </>
        )}
      </main>
      
      <BottomNavbar />
    </div>
  );
}