const { ModuleFederationPlugin } = require("webpack");
const mf = require("@angular-architects/module-federation/webpack");

module.exports = mf.withModuleFederationPlugin({

  name: "angularApp",

  exposes: {
    './Component': './src/bootstrap.ts',
  },

  shared: mf.share({
    "@angular/core": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    "@angular/common": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    "@angular/common/http": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    "@angular/router": { singleton: true, strictVersion: true, requiredVersion: 'auto' },

    ...mf.sharedMappings(['@angular/core', '@angular/common', '@angular/router'], 
      require('./tsconfig.json').compilerOptions.paths),
  })
});