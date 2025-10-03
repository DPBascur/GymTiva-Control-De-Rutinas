'use client';

export default function AuthLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gym-purple via-gym-pink to-gym-cyan flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
        <h2 className="text-white text-xl font-bold mb-2">
          🏋️‍♂️ GymTiva
        </h2>
        <p className="text-white/80">
          Verificando tu sesión...
        </p>
      </div>
    </div>
  );
}