import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { WorkoutProvider } from "@/contexts/WorkoutContext";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "GymTiva - Control de Rutinas",
    template: "%s | GymTiva"
  },
  description: "Controla tus rutinas de gimnasio, registra tu nutrición y monitorea tu progreso fitness con GymTiva. La app definitiva para tu entrenamiento.",
  keywords: ["gym", "fitness", "rutinas", "ejercicio", "nutrición", "entrenamiento", "salud"],
  authors: [{ name: "GymTiva Team" }],
  creator: "GymTiva",
  publisher: "GymTiva",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://gymtiva.vercel.app"),
  openGraph: {
    title: "GymTiva - Control de Rutinas",
    description: "Controla tus rutinas de gimnasio, registra tu nutrición y monitorea tu progreso fitness.",
    url: "https://gymtiva.vercel.app",
    siteName: "GymTiva",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "GymTiva - Control de Rutinas de Gym",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GymTiva - Control de Rutinas",
    description: "Controla tus rutinas de gimnasio, registra tu nutrición y monitorea tu progreso fitness.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: '/favicon.svg?v=1',
    apple: '/favicon.svg?v=1',
    shortcut: '/favicon.svg?v=1',
  },
  manifest: "/manifest.json",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#9333EA" },
    { media: "(prefers-color-scheme: dark)", color: "#9333EA" }
  ],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.svg?v=1" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg?v=1" />
        <meta name="msapplication-TileColor" content="#9333EA" />
        <meta name="theme-color" content="#9333EA" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <WorkoutProvider>
            <div className="min-h-screen bg-gym-black dark:bg-gym-black">
              {/* Fondo con gradiente sutil */}
              <div className="absolute inset-0 bg-gradient-to-br from-gym-purple/5 via-gym-black to-gym-pink/5"></div>
              {/* Contenido */}
              <div className="relative z-10">
                {children}
              </div>
            </div>
          </WorkoutProvider>
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}