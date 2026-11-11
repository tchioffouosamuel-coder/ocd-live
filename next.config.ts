import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Les pages lisent un fichier de données à chaque requête : on garde le rendu dynamique.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
