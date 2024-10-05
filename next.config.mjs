/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/:path*',
          destination: '/:path*'  // Permet à Next.js de gérer toutes les routes
        }
      ];
    }
  };
  
  export default nextConfig;
  