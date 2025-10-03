import Link from "next/link";
import Image from "next/image";

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-exotico flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block mb-6">
            <div className="flex items-center justify-center">
              <Image 
                src="/images/GymTiva.png" 
                alt="GymTiva Logo" 
                width={120}
                height={120}
              />
              <h1 className="text-5xl font-bold text-white">
                <span className="gym-text-gradient">GymTiva</span>
              </h1>
            </div>
          </Link>
          <h2 className="text-2xl font-bold text-white mb-4">
            ¡Bienvenido de vuelta!
          </h2>
          <p className="text-white/80 text-lg">
            Accede a tu cuenta para gestionar tus rutinas y nutrición
          </p>
        </div>

        {/* Opciones de Autenticación */}
        <div className="space-y-6">
          {/* Login */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-white text-xl font-bold mb-2">
              ¿Ya tienes una cuenta?
            </h3>
            <p className="text-white/80 mb-6">
              Inicia sesión para continuar con tus entrenamientos
            </p>
            <Link
              href="/auth/login"
              className="bg-white hover:gym-gradient-primary text-gray-900 hover:text-white px-8 py-3 rounded-full font-bold transition-all inline-block w-full"
            >
              Iniciar Sesión
            </Link>
          </div>

          {/* Register */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-white text-xl font-bold mb-2">
              ¿Nuevo en GymTiva?
            </h3>
            <p className="text-white/80 mb-6">
              Crea tu cuenta gratuita y comienza tu journey fitness
            </p>
            <Link
              href="/auth/register"
              className="bg-white hover:gym-gradient-primary text-gray-900 hover:text-white px-8 py-3 rounded-full font-bold transition-all inline-block w-full"
            >
              Crear Cuenta Nueva
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}