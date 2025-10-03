'use client';

import { useState, useEffect } from 'react';

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

export default function WelcomeHeader() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Obtener datos del usuario desde localStorage
    const userData = localStorage.getItem('user-data');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Obtener saludo basado en la hora
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  // Obtener primer nombre
  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0];
  };

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center">
        <div className="text-4xl mr-4">🏋️‍♂️</div>
        <div>
          <h1 className="text-2xl font-bold text-white">
            {getGreeting()}{user ? `, ${getFirstName(user.name)}` : ''}
          </h1>
          <p className="text-gray-400 text-sm">
            {user ? '¡Listo para entrenar hoy!' : 'Cargando...'}
          </p>
        </div>
      </div>
      
      {/* Opcional: Avatar o info adicional */}
      {user && (
        <div className="flex items-center bg-gray-800/50 rounded-full px-4 py-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {getFirstName(user.name).charAt(0).toUpperCase()}
          </div>
          <span className="ml-2 text-white text-sm font-medium hidden sm:block">
            {getFirstName(user.name)}
          </span>
        </div>
      )}
    </div>
  );
}