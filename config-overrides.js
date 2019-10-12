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
}; /*
{ 
  plugins: 
   [ 
     ForkTsCheckerWebpackPlugin {
       ignoreLintWarnings: false,
       reportFiles: [Array],
       logger: [Object],
       silent: true,
       async: false,
       checkSyntacticErrors: true,
       resolveModuleNameModule: undefined,
       resolveTypeReferenceDirectiveModule: undefined,
       workersNumber: 1,
       memoryLimit: 2048,
       useColors: true,
       colors: [Object],
       formatter: [Function: formatter],
       emitCallback: [Function: noopEmitCallback],
       doneCallback: [Function: doneCallback],
       typescript: [Object],
       typescriptPath: '/home/jelli/Dev/Repos/dOrg/DAOcreator/node_modules/typescript/lib/typescript.js',
       typescriptVersion: '3.4.5',
       tsconfig: '/home/jelli/Dev/Repos/dOrg/DAOcreator/tsconfig.json',
       compilerOptions: {},
       tslintVersion: undefined,
       vue: false,
       useTypescriptIncrementalApi: true,
       measureTime: false } ],
  node: 
   { module: 'empty',
     dgram: 'empty',
     dns: 'mock',
     fs: 'empty',
     http2: 'empty',
     net: 'empty',
     tls: 'empty',
     child_process: 'empty' },
  performance: false }
*/
