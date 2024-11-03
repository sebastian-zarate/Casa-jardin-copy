module.exports = {
    images: {
      domains: ['raw.githubusercontent.com'], // Agrega aquí el host correspondiente
    },
    eslint: {
      ignoreDuringBuilds: true, // Ignora errores de ESLint al hacer build
    },
  /*   webpack: (config) => {
      config.resolve.fallback = { fs: false };
      return config;
    }, */
  };