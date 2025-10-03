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
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [formData, setFormData] = useState({
    age: 0,
    weight: 0,
    height: 0
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Cargar desde localStorage primero (rápido)
    const userData = localStorage.getItem('user-data');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      if (parsedUser.profile) {
        setFormData({
          age: parsedUser.profile.age || 0,
          weight: parsedUser.profile.weight || 0,
          height: parsedUser.profile.height || 0
        });
      }
    }
  }, []);

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsEditingProfile(false);
        
        // Actualizar localStorage
        localStorage.setItem('user-data', JSON.stringify(data.user));
        
        alert('✅ Perfil actualizado exitosamente');
      } else {
        alert('❌ Error al actualizar perfil');
      }
    } catch (error) {
      console.error('Error guardando perfil:', error);
      alert('❌ Error al actualizar perfil');
    } finally {
      setIsSaving(false);
    }
  };

  const handleComingSoon = () => {
    alert('🚧 Próximamente\n\nEsta funcionalidad estará disponible en futuras actualizaciones.');
  };

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
              
              {isEditingProfile ? (
                <div className="space-y-4 pt-6 border-t border-gray-700/50">
                  <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-2">Edad (años)</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Ej: 25"
                      min="1"
                      max="120"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-2">Peso (kg)</label>
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Ej: 70"
                      min="1"
                      max="300"
                      step="0.1"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-2">Altura (cm)</label>
                    <input
                      type="number"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Ej: 175"
                      min="50"
                      max="250"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
                    >
                      {isSaving ? 'Guardando...' : '✓ Guardar Cambios'}
                    </button>
                    <button
                      onClick={() => setIsEditingProfile(false)}
                      disabled={isSaving}
                      className="flex-1 bg-gray-700/50 text-white font-bold py-3 rounded-xl hover:bg-gray-600/50 transition-all disabled:opacity-50"
                    >
                      ✕ Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                user.profile && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-700/50">
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
                      <div className="text-2xl font-bold text-white">{user.profile.bmi.toFixed(1)}</div>
                      <div className="text-gray-400 text-sm">IMC</div>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Configuraciones */}
            <div className="space-y-4 mb-6">
              <h3 className="text-xl font-bold text-white mb-4">Configuración</h3>
              
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700/50">
                <button 
                  onClick={() => setIsEditingProfile(true)}
                  className="w-full p-4 text-left text-white hover:bg-gray-700/30 transition-all rounded-2xl"
                >
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
                <button 
                  onClick={handleComingSoon}
                  className="w-full p-4 text-left text-white hover:bg-gray-700/30 transition-all rounded-2xl"
                >
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