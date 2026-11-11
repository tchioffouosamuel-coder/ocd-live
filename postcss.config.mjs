// Tailwind CSS v4 passe par PostCSS : c'est le chemin supporté par Next 16,
// aussi bien avec Turbopack qu'avec webpack, et sur toutes les plateformes.
const config = {
  plugins: ["@tailwindcss/postcss"],
};

export default config;
