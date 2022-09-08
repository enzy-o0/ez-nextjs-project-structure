module.exports = {
  reactStrictMode: true,
  webpack: function (config, options) {
    config.experiments = { topLevelAwait: true, asyncWebAssembly: true, layers: true };
    return config;
  },
  experimental: {
    esmExternals: false,
  },
};
