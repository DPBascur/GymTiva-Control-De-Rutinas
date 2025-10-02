'use client';

export default function ColorPalette() {
  const colors = [
    {
      name: 'Púrpura Principal',
      hex: '#9333EA',
      rgb: 'rgb(147, 51, 234)',
      css: '--gym-purple',
      tailwind: 'gym-purple',
      usage: 'Botones principales, iconos activos'
    },
    {
      name: 'Rosa Acento',
      hex: '#EC4899',
      rgb: 'rgb(236, 72, 153)',
      css: '--gym-pink',
      tailwind: 'gym-pink',
      usage: 'Gradientes, elementos destacados'
    },
    {
      name: 'Cian Brillante',
      hex: '#22D3EE',
      rgb: 'rgb(34, 211, 238)',
      css: '--gym-cyan',
      tailwind: 'gym-cyan',
      usage: 'Progreso, barras de estado'
    },
    {
      name: 'Lima Neón',
      hex: '#84CC16',
      rgb: 'rgb(132, 204, 22)',
      css: '--gym-lime',
      tailwind: 'gym-lime',
      usage: 'Éxito, completado'
    },
    {
      name: 'Negro Principal',
      hex: '#000000',
      rgb: 'rgb(0, 0, 0)',
      css: '--gym-black',
      tailwind: 'gym-black',
      usage: 'Fondo principal'
    },
    {
      name: 'Gris Oscuro',
      hex: '#1F2937',
      rgb: 'rgb(31, 41, 55)',
      css: '--gym-gray-dark',
      tailwind: 'gym-gray-dark',
      usage: 'Tarjetas, contenedores'
    },
    {
      name: 'Gris Claro',
      hex: '#9CA3AF',
      rgb: 'rgb(156, 163, 175)',
      css: '--gym-gray-light',
      tailwind: 'gym-gray-light',
      usage: 'Texto secundario'
    },
    {
      name: 'Blanco',
      hex: '#FFFFFF',
      rgb: 'rgb(255, 255, 255)',
      css: '--gym-white',
      tailwind: 'gym-white',
      usage: 'Texto principal, fondos claros'
    }
  ];

  const gradients = [
    {
      name: 'Gradiente Principal',
      css: 'var(--gym-gradient-primary)',
      tailwind: 'bg-gym-gradient-primary',
      class: 'gym-gradient-primary',
      usage: 'Botones principales, encabezados'
    },
    {
      name: 'Gradiente Diagonal',
      css: 'var(--gym-gradient-diagonal)',
      tailwind: 'bg-gym-gradient-diagonal',
      class: 'gym-gradient-diagonal',
      usage: 'Tarjetas destacadas'
    },
    {
      name: 'Gradiente de Tarjeta',
      css: 'var(--gym-gradient-card)',
      tailwind: 'bg-gym-gradient-card',
      class: 'gym-gradient-card',
      usage: 'Fondos sutiles'
    }
  ];

  const shadows = [
    {
      name: 'Sombra Púrpura',
      css: 'var(--gym-shadow-purple)',
      tailwind: 'shadow-gym-purple',
      usage: 'Hover en elementos púrpura'
    },
    {
      name: 'Sombra Cian',
      css: 'var(--gym-shadow-cyan)',
      tailwind: 'shadow-gym-cyan',
      usage: 'Hover en elementos cian'
    },
    {
      name: 'Sombra Rosa',
      css: 'var(--gym-shadow-pink)',
      tailwind: 'shadow-gym-pink',
      usage: 'Hover en elementos rosa'
    },
    {
      name: 'Resplandor',
      css: '0 0 30px rgba(147, 51, 234, 0.3)',
      tailwind: 'shadow-gym-glow',
      usage: 'Elementos principales'
    }
  ];

  return (
    <div className="p-8 bg-gym-black text-gym-white">
      <h1 className="text-4xl font-bold gym-text-gradient mb-8">
        🎨 Paleta de Colores GymTiva
      </h1>

      {/* Colores Base */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gym-cyan mb-6">Colores Base</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {colors.map((color, index) => (
            <div key={index} className="bg-gym-gray-dark p-4 rounded-xl border border-gym-purple/20">
              <div 
                className="w-full h-20 rounded-lg mb-4" 
                style={{ backgroundColor: color.hex }}
              ></div>
              <h3 className="font-semibold text-gym-white">{color.name}</h3>
              <p className="text-sm text-gym-gray-light mb-2">{color.usage}</p>
              <div className="space-y-1 text-xs font-mono">
                <div className="text-gym-cyan">HEX: {color.hex}</div>
                <div className="text-gym-lime">CSS: {color.css}</div>
                <div className="text-gym-pink">Tailwind: {color.tailwind}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gradientes */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gym-cyan mb-6">Gradientes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {gradients.map((gradient, index) => (
            <div key={index} className="bg-gym-gray-dark p-4 rounded-xl border border-gym-purple/20">
              <div className={`w-full h-20 rounded-lg mb-4 ${gradient.class}`}></div>
              <h3 className="font-semibold text-gym-white">{gradient.name}</h3>
              <p className="text-sm text-gym-gray-light mb-2">{gradient.usage}</p>
              <div className="space-y-1 text-xs font-mono">
                <div className="text-gym-lime">Clase: {gradient.class}</div>
                <div className="text-gym-pink">Tailwind: {gradient.tailwind}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sombras y Efectos */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gym-cyan mb-6">Sombras y Efectos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {shadows.map((shadow, index) => (
            <div key={index} className="bg-gym-gray-dark p-4 rounded-xl border border-gym-purple/20">
              <div 
                className={`w-full h-20 bg-gym-gray-card rounded-lg mb-4 ${shadow.tailwind}`}
              ></div>
              <h3 className="font-semibold text-gym-white">{shadow.name}</h3>
              <p className="text-sm text-gym-gray-light mb-2">{shadow.usage}</p>
              <div className="space-y-1 text-xs font-mono">
                <div className="text-gym-pink">Tailwind: {shadow.tailwind}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ejemplos de Uso */}
      <section>
        <h2 className="text-2xl font-semibold text-gym-cyan mb-6">Ejemplos de Uso</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Botones */}
          <div className="bg-gym-gray-dark p-6 rounded-xl border border-gym-purple/20">
            <h3 className="text-xl font-semibold text-gym-white mb-4">Botones</h3>
            <div className="space-y-4">
              <button className="gym-gradient-primary text-gym-white px-6 py-3 rounded-xl hover:shadow-gym-purple transition-all duration-300 font-semibold w-full">
                Botón Principal
              </button>
              <button className="bg-gym-cyan text-gym-black px-6 py-3 rounded-xl hover:shadow-gym-cyan transition-all duration-300 font-semibold w-full">
                Botón Secundario
              </button>
              <button className="bg-gym-lime text-gym-black px-6 py-3 rounded-xl hover:shadow-gym-cyan transition-all duration-300 font-semibold w-full">
                Botón Éxito
              </button>
            </div>
          </div>

          {/* Tarjetas */}
          <div className="bg-gym-gray-dark p-6 rounded-xl border border-gym-purple/20">
            <h3 className="text-xl font-semibold text-gym-white mb-4">Tarjetas</h3>
            <div className="space-y-4">
              <div className="gym-gradient-card p-4 rounded-xl border border-gym-purple/30">
                <h4 className="text-gym-white font-semibold">Tarjeta con Gradiente</h4>
                <p className="text-gym-gray-light text-sm">Contenido de la tarjeta</p>
              </div>
              <div className="bg-gym-black/50 p-4 rounded-xl border border-gym-cyan/20 hover:border-gym-cyan/50 transition-colors">
                <h4 className="text-gym-white font-semibold">Tarjeta Interactiva</h4>
                <p className="text-gym-gray-light text-sm">Con hover effect</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Código de Ejemplo */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-gym-cyan mb-6">Código de Ejemplo</h2>
        <div className="bg-gym-gray-dark p-6 rounded-xl border border-gym-purple/20">
          <pre className="text-sm text-gym-gray-light overflow-x-auto">
{`/* CSS Variables */
:root {
  --gym-purple: 147 51 234;
  --gym-pink: 236 72 153;
  --gym-cyan: 34 211 238;
  --gym-lime: 132 204 22;
}

/* Clases de Utilidad */
.gym-gradient-primary {
  background: linear-gradient(to right, rgb(147, 51, 234), rgb(236, 72, 153));
}

.gym-text-gradient {
  background: var(--gym-gradient-primary);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Tailwind Classes */
<div className="gym-gradient-primary text-gym-white">
<div className="bg-gym-purple hover:shadow-gym-purple">
<div className="text-gym-cyan border-gym-purple/20">`}
          </pre>
        </div>
      </section>
    </div>
  );
}