/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Outfit', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        primary: {
          50:  '#EEF3FF',
          100: '#D4E1FF',
          200: '#A9C3FF',
          300: '#7EA5FF',
          400: '#5387FF',
          500: '#2E6BFF',
          600: '#1E50CC',
          700: '#1E3A8A',
          800: '#162D6E',
          900: '#0F1F4D',
        },
        accent: {
          violet: '#7C3AED',
          indigo: '#4F46E5',
          cyan:   '#06B6D4',
          emerald:'#10B981',
        },
        pass: {
          bg:   '#F0FDF4',
          text: '#166534',
          border: '#BBF7D0',
          dot:  '#10B981',
        },
        fail: {
          bg:   '#FFF1F2',
          text: '#991B1B',
          border: '#FECDD3',
          dot:  '#F43F5E',
        },
        unclear: {
          bg:   '#FFFBEB',
          text: '#92400E',
          border: '#FDE68A',
          dot:  '#F59E0B',
        },
        surface: {
          page:   '#F8FAFF',
          card:   '#FFFFFF',
          border: '#E8EEFF',
          muted:  '#F1F5FF',
          glass:  'rgba(255,255,255,0.7)',
        },
        ink: {
          primary:   '#0F172A',
          secondary: '#334155',
          muted:     '#64748B',
          faint:     '#94A3B8',
        }
      },
      boxShadow: {
        card:       '0 1px 3px 0 rgba(30,58,138,0.06), 0 1px 2px -1px rgba(30,58,138,0.04)',
        'card-hover':'0 8px 25px -4px rgba(30,58,138,0.12), 0 4px 10px -4px rgba(30,58,138,0.08)',
        'card-lg':  '0 12px 40px -8px rgba(30,58,138,0.15)',
        glow:       '0 0 30px rgba(46,107,255,0.25)',
        'glow-sm':  '0 0 15px rgba(46,107,255,0.18)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #0F1F4D 0%, #1E3A8A 50%, #1e50cc 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(241,245,255,0.8) 100%)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '1.5rem',
      },
      animation: {
        'fade-in':    'fadeIn 0.5s ease-out both',
        'slide-up':   'slideUp 0.5s ease-out both',
        'float':      'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'shimmer':    'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(20px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        float:   { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-10px)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
}
