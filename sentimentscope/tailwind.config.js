/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'primary': '#2563EB', // Deep blue (primary) - blue-600
        'primary-50': '#EFF6FF', // Light blue (50-level shade) - blue-50
        'primary-100': '#DBEAFE', // Light blue (100-level shade) - blue-100
        'primary-500': '#3B82F6', // Medium blue (500-level shade) - blue-500
        'primary-700': '#1D4ED8', // Dark blue (700-level shade) - blue-700
        
        // Secondary Colors
        'secondary': '#64748B', // Sophisticated slate gray (secondary) - slate-500
        'secondary-100': '#F1F5F9', // Light slate (100-level shade) - slate-100
        'secondary-200': '#E2E8F0', // Light slate (200-level shade) - slate-200
        'secondary-300': '#CBD5E1', // Light slate (300-level shade) - slate-300
        'secondary-600': '#475569', // Medium slate (600-level shade) - slate-600
        
        // Accent Colors
        'accent': '#10B981', // Vibrant emerald (accent) - emerald-500
        'accent-50': '#ECFDF5', // Light emerald (50-level shade) - emerald-50
        'accent-100': '#D1FAE5', // Light emerald (100-level shade) - emerald-100
        'accent-600': '#059669', // Dark emerald (600-level shade) - emerald-600
        
        // Background Colors
        'background': '#FAFBFC', // Subtle off-white (background) - gray-50
        'surface': '#FFFFFF', // Pure white (surface) - white
        
        // Text Colors
        'text-primary': '#1E293B', // Rich charcoal (text primary) - slate-800
        'text-secondary': '#64748B', // Medium gray (text secondary) - slate-500
        
        // Status Colors
        'success': '#059669', // Deeper green (success) - emerald-600
        'success-50': '#ECFDF5', // Light green (success 50) - emerald-50
        'success-100': '#D1FAE5', // Light green (success 100) - emerald-100
        
        'warning': '#D97706', // Warm amber (warning) - amber-600
        'warning-50': '#FFFBEB', // Light amber (warning 50) - amber-50
        'warning-100': '#FEF3C7', // Light amber (warning 100) - amber-100
        
        'error': '#DC2626', // Clear red (error) - red-600
        'error-50': '#FEF2F2', // Light red (error 50) - red-50
        'error-100': '#FEE2E2', // Light red (error 100) - red-100
        
        // Border Colors
        'border': '#E2E8F0', // Minimal border color - slate-200
        'border-light': '#F1F5F9', // Light border color - slate-100
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      fontWeight: {
        'normal': '400',
        'medium': '500',
        'semibold': '600',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'soft-lg': '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
      },
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
      },
      zIndex: {
        '50': '50',
        '100': '100',
        '200': '200',
      },
    },
  },
  plugins: [],
}