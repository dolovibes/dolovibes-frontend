/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Brand Colors - Dolovibes
                'grafito': '#1C1C1C',     // Primary Dark (Negro Grafito)
                'pizarra': '#374257',     // Secondary Blue (Azul Pizarra)
                'alpino': '#66806C',      // Accent Green Dark (Verde Alpino)
                'bruma': '#A9BFA7',       // Accent Green Light (Verde Bruma)
                'niebla': '#A3B5B6',      // Accent Blue Light (Azul Niebla)
                'nieve': '#EFEFE6',       // Background Light (Nieve Suave)
            },
            fontFamily: {
                'heading': ['Poppins Bold', 'sans-serif'],      // Títulos (h1, h2, h3)
                'body': ['Poppins', 'sans-serif'],         // Cuerpo (p, a, button)
                'mono': ['IBM Plex Mono', 'monospace'],    // Editorial (quotes, meta)
            },
        },
    },
    plugins: [],
}
