import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#FFF1F1',
          100: '#FFE0E0',
          200: '#FFC5C5',
          300: '#FF9898',
          400: '#F87171',
          500: '#F04A4A',
          600: '#E02828',
          700: '#BC1C1C',
          800: '#9B1717',
          900: '#7F1D1D',
          950: '#450A0A',
        },
        sidebar: '#131722',
        'page-bg': '#F5F5F5',
        'form-field': '#F5F7FA',
        neutral: {
          0:   '#FFFFFF',
          50:  '#F8F9FA',
          100: '#F1F3F5',
          200: '#E9ECEF',
          300: '#DEE2E6',
          400: '#ADB5BD',
          500: '#868E96',
          600: '#495057',
          700: '#343A40',
          800: '#212529',
          900: '#131722',
          950: '#07090E',
        },
        status: {
          critical:      '#EF4444',
          high:          '#F97316',
          medium:        '#F59E0B',
          low:           '#22C55E',
          info:          '#3B82F6',
          success:       '#10B981',
          pending:       '#94A3B8',
          'critical-bg': '#FEF2F2',
          'high-bg':     '#FFF7ED',
          'medium-bg':   '#FFFBEB',
          'low-bg':      '#F0FDF4',
          'info-bg':     '#EFF6FF',
          'success-bg':  '#ECFDF5',
          'pending-bg':  '#F1F5F9',
        },
        stage: {
          warehouse: '#3B82F6',
          dispatch:  '#8B5CF6',
          qaqc:      '#F59E0B',
          final:     '#10B981',
          pending:   '#94A3B8',
        },
        border: {
          subtle:  '#EBEBEB',
          default: '#E2E8F0',
          strong:  '#CBD5E1',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': '0.625rem',
      },
      spacing: {
        sidebar: '200px',
        topbar:  '64px',
        panel:   '480px',
      },
      borderRadius: {
        button: '6px',
        card:   '8px',
        modal:  '12px',
        badge:  '9999px',
      },
      boxShadow: {
        card:    '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.08)',
        raised:  '0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.06)',
        overlay: '0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.04)',
        focus:   '0 0 0 3px rgb(240 74 74 / 0.20)',
        'sla-breach': '0 0 0 2px rgb(239 68 68 / 0.45)',
        'auth-card':  '0 8px 32px rgb(0 0 0 / 0.12)',
      },
      transitionDuration: {
        hover: '150ms',
        panel: '250ms',
      },
      keyframes: {
        'slide-in': {
          from: { transform: 'translateX(100%)' },
          to:   { transform: 'translateX(0)' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'slide-in': 'slide-in 250ms ease forwards',
        'fade-in':  'fade-in 200ms ease forwards',
        'fade-up':  'fade-up 0.5s ease forwards',
      },
    },
  },
  plugins: [],
}

export default config
