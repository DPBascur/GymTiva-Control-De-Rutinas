import Link from "next/link";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold gym-text-gradient mb-6">
          🏋️‍♂️ GymTiva
        </h1>
        <p className="text-xl text-gym-gray-light max-w-2xl mx-auto">
          Control completo de tus rutinas de gimnasio y nutrición con tecnología moderna
        </p>
        {/* Decoración con gradiente */}
        <div className="mt-6 w-24 h-1 gym-gradient-primary mx-auto rounded-full"></div>
      </header>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {/* Rutinas */}
        <div className="bg-gym-gray-card rounded-2xl shadow-lg p-6 hover:shadow-gym-purple transition-all duration-300 border border-gym-purple/20 hover:border-gym-purple/50 group">
          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">💪</div>
          <h3 className="text-xl font-semibold mb-3 text-gym-white">Rutinas de Gym</h3>
          <p className="text-gym-gray-light mb-4">
            Registra tus ejercicios diarios con 3 ciclos y 12 repeticiones
          </p>
          <Link
            href="/rutinas"
            className="inline-block gym-gradient-primary text-gym-white px-6 py-3 rounded-xl hover:shadow-gym-purple transition-all duration-300 font-semibold"
          >
            Ver Rutinas
          </Link>
        </div>

        {/* Nutrición */}
        <div className="bg-gym-gray-card rounded-2xl shadow-lg p-6 hover:shadow-gym-cyan transition-all duration-300 border border-gym-cyan/20 hover:border-gym-cyan/50 group">
          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🍎</div>
          <h3 className="text-xl font-semibold mb-3 text-gym-white">Nutrición</h3>
          <p className="text-gym-gray-light mb-4">
            Registra tus comidas y controla las calorías consumidas
          </p>
          <Link
            href="/nutricion"
            className="inline-block bg-gym-cyan text-gym-black px-6 py-3 rounded-xl hover:shadow-gym-cyan transition-all duration-300 font-semibold"
          >
            Registrar Comida
          </Link>
        </div>

        {/* Calorías */}
        <div className="bg-gym-gray-card rounded-2xl shadow-lg p-6 hover:shadow-gym-pink transition-all duration-300 border border-gym-pink/20 hover:border-gym-pink/50 group">
          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🔥</div>
          <h3 className="text-xl font-semibold mb-3 text-gym-white">Calorías Quemadas</h3>
          <p className="text-gym-gray-light mb-4">
            Calcula las calorías que quemas en cada entrenamiento
          </p>
          <Link
            href="/calorias"
            className="inline-block bg-gym-pink text-gym-white px-6 py-3 rounded-xl hover:shadow-gym-pink transition-all duration-300 font-semibold"
          >
            Ver Calorías
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="gym-gradient-card rounded-2xl shadow-gym-glow p-8 border border-gym-purple/30">
        <h2 className="text-2xl font-bold mb-6 text-gym-white flex items-center gap-3">
          <span className="text-gym-cyan">📊</span> 
          Resumen de Hoy
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-gym-black/50 rounded-xl border border-gym-purple/20">
            <div className="text-4xl font-bold text-gym-purple mb-2">0</div>
            <div className="text-gym-gray-light">Ejercicios</div>
          </div>
          <div className="text-center p-4 bg-gym-black/50 rounded-xl border border-gym-cyan/20">
            <div className="text-4xl font-bold text-gym-cyan mb-2">0</div>
            <div className="text-gym-gray-light">Calorías Consumidas</div>
          </div>
          <div className="text-center p-4 bg-gym-black/50 rounded-xl border border-gym-pink/20">
            <div className="text-4xl font-bold text-gym-pink mb-2">0</div>
            <div className="text-gym-gray-light">Calorías Quemadas</div>
          </div>
          <div className="text-center p-4 bg-gym-black/50 rounded-xl border border-gym-lime/20">
            <div className="text-4xl font-bold text-gym-lime mb-2">0</div>
            <div className="text-gym-gray-light">Días Activos</div>
          </div>
        </div>
      </div>

      {/* Getting Started */}
      <div className="mt-12 text-center">
        <h2 className="text-3xl font-bold mb-4 text-gym-white">
          🚀 ¿Listo para empezar?
        </h2>
        <p className="text-gym-gray-light mb-8 max-w-md mx-auto">
          Comienza registrando tu primera rutina o comida del día y transforma tu estilo de vida
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/rutinas"
            className="gym-gradient-primary text-gym-white px-8 py-4 rounded-xl hover:shadow-gym-purple transition-all duration-300 font-semibold text-lg min-w-48"
          >
            💪 Nueva Rutina
          </Link>
          <Link
            href="/nutricion"
            className="bg-gym-cyan text-gym-black px-8 py-4 rounded-xl hover:shadow-gym-cyan transition-all duration-300 font-semibold text-lg min-w-48"
          >
            🍎 Registrar Comida
          </Link>
        </div>
        
        {/* Elementos decorativos */}
        <div className="mt-12 flex justify-center space-x-8">
          <div className="w-2 h-2 bg-gym-purple rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-gym-cyan rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
          <div className="w-2 h-2 bg-gym-pink rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
      </div>
    </main>
  );
}