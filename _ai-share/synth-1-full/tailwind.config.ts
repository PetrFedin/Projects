
import type {Config} from 'tailwindcss';

// PostCSS/jiti в Next может падать на `import …json` (Node 22+ / ERR_IMPORT_ATTRIBUTE_MISSING) → 500 на `/_next/static/css/...` и «голый» HTML.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const tokens = require('./src/design/tokens.json');

export default {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        '2xl': '1680px',
      },
    },
    extend: {
      colors: {
        bg: {
          canvas: tokens.color.bg.canvas.value,
          surface: tokens.color.bg.surface.value,
          surface2: tokens.color.bg.surface2.value
        },
        text: {
          primary: tokens.color.text.primary.value,
          secondary: tokens.color.text.secondary.value,
          muted: tokens.color.text.muted.value,
          inverse: tokens.color.text.inverse.value
        },
        border: {
          DEFAULT: 'hsl(var(--border))',
          subtle: tokens.color.border.subtle.value,
          default: tokens.color.border.default.value,
          strong: tokens.color.border.strong.value
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
          primary: tokens.color.accent.primary.value,
          hover: tokens.color.accent.hover.value,
          soft: tokens.color.accent.soft.value
        },
        state: {
          success: tokens.color.state.success.value,
          warning: tokens.color.state.warning.value,
          error: tokens.color.state.error.value,
          info: tokens.color.state.info.value
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        // ... (preserving existing border etc. if needed, but the user's list is comprehensive)
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      fontFamily: {
        sans: ['var(--font-body)', tokens.font.family.sans.value, 'system-ui', 'sans-serif'],
        mono: ['var(--font-code)', tokens.font.family.mono.value, 'monospace'],
        body: ['var(--font-body)', 'sans-serif'],
        headline: ['var(--font-code)', tokens.font.family.sans.value, 'sans-serif'],
      },
      fontSize: {
        xs: `${tokens.font.size.xs.value}px`,
        sm: `${tokens.font.size.sm.value}px`,
        md: `${tokens.font.size.md.value}px`,
        lg: `${tokens.font.size.lg.value}px`,
        xl: `${tokens.font.size.xl.value}px`,
        "2xl": `${tokens.font.size["2xl"].value}px`,
        "3xl": `${tokens.font.size["3xl"].value}px`
      },
      borderRadius: {
        sm: `${tokens.radius.sm.value}px`,
        md: `${tokens.radius.md.value}px`,
        lg: `${tokens.radius.lg.value}px`,
        xl: `${tokens.radius.xl.value}px`,
        // Shadcn defaults
        // lg: 'var(--radius)',
        // md: 'calc(var(--radius) - 2px)',
        // sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        sm: tokens.shadow.sm.value,
        md: tokens.shadow.md.value,
        focus: tokens.shadow.focus.value,
        'xl': '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05)',
        '2xl': '0 25px 50px -12px rgba(0,0,0,0.15)',
      },
      spacing: Object.fromEntries(
        Object.entries(tokens.space).map(([k, v]) => [
          k,
          `${(v as { value: number }).value}px`,
        ])
      ),
      transitionDuration: {
        fast: `${tokens.motion.duration.fast.value}ms`,
        normal: `${tokens.motion.duration.normal.value}ms`
      },
      transitionTimingFunction: {
        standard: tokens.motion.easing.standard.value
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'pulse-live': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.1)', opacity: '.7' },
        },
        /** Рипплы от точки LIVE в шапке (сигнал), без заливки — только кольца */
        'live-signal': {
          '0%': { transform: 'scale(0.45)', opacity: '0.45' },
          '100%': { transform: 'scale(2.6)', opacity: '0' },
        },
        'float': {
            '0%': { transform: 'translateY(0px)', opacity: '1' },
            '100%': { transform: 'translateY(-200px)', opacity: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-live': 'pulse-live 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'live-signal': 'live-signal 2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'float': 'float 4s ease-out forwards',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/container-queries'),
    require('@tailwindcss/typography'),
  ],
} satisfies Config;

    