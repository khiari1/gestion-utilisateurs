// next.config.mjs
export default {
  async redirects() {
    return [
      {
        source: '/auth/google',
        destination: '/api/auth/google', // Exemples de redirection
        permanent: false,
      },
      // Ajoutez d'autres redirections si nécessaire
    ];
  },
};
