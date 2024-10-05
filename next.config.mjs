// next.config.mjs
export default {
  async redirects() {
    return [
      {
        source: '/auth/google',
        destination: '/auth/google', // Exemple de redirection
        permanent: false, // Utilisez 'true' si vous voulez que ce soit une redirection permanente
      },
      // Ajoutez d'autres redirections si nécessaire
    ];
  },
};
