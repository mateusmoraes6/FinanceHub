/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Cores de Fundo
        'bg-primary': '#121212',
        'bg-secondary': '#1E1E1E',
        'bg-tertiary': '#2D2D2D',
        
        // Cores Primárias
        'green-primary': '#00E676',
        'green-secondary': '#00B863',
        
        // Cores de Contraste e Destaque
        'purple-primary': '#7B61FF',
        'turquoise': '#00D9F5',
        
        // Cores de Alerta
        'red-alert': '#FF5252',
        'amber-alert': '#FFD740',
        
        // Cores Neutras
        'white-primary': '#FFFFFF',
        'gray-light': '#B0B0B0',
        'gray-medium': '#757575',
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
        'outfit': ['Outfit', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
        'dm-mono': ['DM Mono', 'monospace'],
        'jetbrains-mono': ['JetBrains Mono', 'monospace'],
        'roboto-mono': ['Roboto Mono', 'monospace'],
      },
      fontSize: {
        'h1': ['28px', '32px'],
        'h2': ['22px', '26px'],
        'h3': ['18px', '22px'],
        'text-highlight': ['16px', '20px'],
        'text-body': ['14px', '18px'],
        'text-secondary': ['13px', '16px'],
        'numeric-large': ['28px', '32px'],
        'numeric-table': ['14px', '18px'],
      }
    },
  },
  plugins: [],
};
