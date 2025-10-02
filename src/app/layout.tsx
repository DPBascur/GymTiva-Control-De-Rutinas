import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GymTiva - Control de Rutinas",
  description: "Aplicación para el seguimiento de rutinas de gimnasio y nutrición",
  manifest: "/manifest.json",
  themeColor: "#2563eb",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="min-h-screen bg-gym-black dark:bg-gym-black">
          {/* Fondo con gradiente sutil */}
          <div className="absolute inset-0 bg-gradient-to-br from-gym-purple/5 via-gym-black to-gym-pink/5"></div>
          {/* Contenido */}
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}