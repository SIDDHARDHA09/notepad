/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./*.{js,ts,jsx,tsx}",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#334155', // Deep Slate
                    600: '#1e293b',
                    700: '#0f172a',
                },
                accent: {
                    500: '#64748b', // Muted Slate Accent
                    600: '#475569',
                }
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui'],
                roboto: ['Roboto', 'sans-serif'],
                openSans: ['Open Sans', 'sans-serif'],
                montserrat: ['Montserrat', 'sans-serif'],
                playfair: ['Playfair Display', 'serif'],
                lora: ['Lora', 'serif'],
                jetbrains: ['JetBrains Mono', 'monospace'],
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(51, 65, 85, 0.04)',
                'premium': '0 20px 25px -5px rgba(0, 0, 0, 0.02), 0 10px 10px -5px rgba(0, 0, 0, 0.01)',
                'glow': '0 0 25px rgba(51, 65, 85, 0.15)',
                'accent-glow': '0 0 25px rgba(100, 116, 139, 0.15)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                    '100%': { transform: 'translateY(0px)' },
                }
            }
        },
    },
    plugins: [],
}
