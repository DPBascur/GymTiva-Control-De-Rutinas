import ColorPalette from '@/components/ColorPalette';
import Link from 'next/link';

export default function ColoresPage() {
  return (
    <div>
      <div className="fixed top-4 left-4 z-50">
        <Link
          href="/"
          className="bg-gym-purple text-gym-white px-4 py-2 rounded-lg hover:shadow-gym-purple transition-all duration-300"
        >
          ← Volver al Inicio
        </Link>
      </div>
      <ColorPalette />
    </div>
  );
}