import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores del sistema
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        card: {
          DEFAULT: "rgb(var(--card) / <alpha-value>)",
          foreground: "rgb(var(--card-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "rgb(var(--popover) / <alpha-value>)",
          foreground: "rgb(var(--popover-foreground) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          foreground: "rgb(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary) / <alpha-value>)",
          foreground: "rgb(var(--secondary-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "rgb(var(--muted) / <alpha-value>)",
          foreground: "rgb(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          foreground: "rgb(var(--accent-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "rgb(var(--destructive) / <alpha-value>)",
          foreground: "rgb(var(--destructive-foreground) / <alpha-value>)",
        },
        border: "rgb(var(--border) / <alpha-value>)",
        input: "rgb(var(--input) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",
        
        // Paleta de colores GymTiva
        gym: {
          purple: {
            DEFAULT: "rgb(var(--gym-purple) / <alpha-value>)",
            50: "rgb(147 51 234 / 0.1)",
            100: "rgb(147 51 234 / 0.2)",
            500: "rgb(var(--gym-purple) / <alpha-value>)",
            600: "rgb(124 43 199 / <alpha-value>)",
            700: "rgb(109 40 217 / <alpha-value>)",
          },
          pink: {
            DEFAULT: "rgb(var(--gym-pink) / <alpha-value>)",
            50: "rgb(236 72 153 / 0.1)",
            100: "rgb(236 72 153 / 0.2)",
            500: "rgb(var(--gym-pink) / <alpha-value>)",
            600: "rgb(219 39 119 / <alpha-value>)",
          },
          cyan: {
            DEFAULT: "rgb(var(--gym-cyan) / <alpha-value>)",
            50: "rgb(34 211 238 / 0.1)",
            100: "rgb(34 211 238 / 0.2)",
            500: "rgb(var(--gym-cyan) / <alpha-value>)",
            600: "rgb(8 145 178 / <alpha-value>)",
          },
          lime: {
            DEFAULT: "rgb(var(--gym-lime) / <alpha-value>)",
            50: "rgb(132 204 22 / 0.1)",
            100: "rgb(132 204 22 / 0.2)",
            500: "rgb(var(--gym-lime) / <alpha-value>)",
            600: "rgb(101 163 13 / <alpha-value>)",
          },
          black: "rgb(var(--gym-black) / <alpha-value>)",
          white: "rgb(var(--gym-white) / <alpha-value>)",
          gray: {
            dark: "rgb(var(--gym-gray-dark) / <alpha-value>)",
            card: "rgb(var(--gym-gray-card) / <alpha-value>)",
            light: "rgb(var(--gym-gray-light) / <alpha-value>)",
            medium: "rgb(var(--gym-gray-medium) / <alpha-value>)",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1rem",
        "2xl": "1.5rem",
      },
      backgroundImage: {
        'gym-gradient-primary': 'var(--gym-gradient-primary)',
        'gym-gradient-diagonal': 'var(--gym-gradient-diagonal)',
        'gym-gradient-card': 'var(--gym-gradient-card)',
      },
      boxShadow: {
        'gym-purple': 'var(--gym-shadow-purple)',
        'gym-cyan': 'var(--gym-shadow-cyan)',
        'gym-pink': 'var(--gym-shadow-pink)',
        'gym-glow': '0 0 30px rgba(147, 51, 234, 0.3)',
      },
      animation: {
        'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
    },
  },
  plugins: [],
};

export default config;