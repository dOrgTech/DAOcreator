module.exports = function override(config, env) {
  // TODO: this is a hack to get around the issue in
  // src/lib/dependencies/arc/migrate.ts
  // implement a real fix later
  config.plugins.forEach(plugin => {
    if (plugin.ignoreLintWarnings !== undefined) {
      plugin.ignoreLintWarnings = true;
    }
  });
  return config;
};
