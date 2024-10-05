/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/auth/google', // Le chemin d'origine que vous voulez réécrire
        destination: '/auth/google' // La destination, qui peut être la même ou différente
      },
      {
        source: '/:path*', // Cette règle va s'appliquer à tous les chemins
        destination: '/:path*' // Permet à Next.js de gérer toutes les routes
      }
    ];
  }
};

export default nextConfig;
