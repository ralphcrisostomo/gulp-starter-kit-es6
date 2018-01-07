/*eslint global-require: "off"*/

const glob      = require('glob');
const path      = require('path');
const options   = {
  "ignore"    :   [
    './gulp/blueprints/*/templates/**/*'
  ]
};

glob.sync('./gulp/**/*.js', options).forEach( function( file ) {
  require( path.resolve( file ) );
});
