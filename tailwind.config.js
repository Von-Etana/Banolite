/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./views/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Inter"', 'sans-serif'],
                display: ['"Inter"', 'sans-serif'],
            },
            colors: {
                cream: '#FAF7F2',
                brand: {
                    dark: '#000000',
                    light: '#FFFFFF',
                    muted: 'rgba(0, 0, 0, 0.6)',
                    primary: '#FF3E14',
                    accent1: '#FF98B0',
                    accent2: '#8F0182',
                    accent3: '#EBF47E',
                    accent4: '#A1DBE3',
                    accent5: '#BDB2FF',
                    bgDark: '#282525',
                },
                selar: {
                    border: '#E4E4E7',
                },
            },
            boxShadow: {
                'subtle': '0 2px 8px rgba(0,0,0,0.04)',
                'elevated': '0 12px 32px rgba(0,0,0,0.08)',
                'card': '0 4px 12px rgba(0,0,0,0.05)',
                'card-hover': '0 16px 40px rgba(0,0,0,0.1)',
            },
            borderRadius: {
                '4xl': '2rem',
                'full': '320px',
            },
            animation: {
                'fade-in': 'fadeIn 0.4s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
}
