// More info on Webpack's Node API here: https://webpack.github.io/docs/node.js-api.html
/* eslint-disable no-console */
/* eslint-disable no-process-env */
import webpack from 'webpack';
import config from '../webpack.config.prod';

process.env.NODE_ENV = 'production'; // this assures React is built in prod mode and that the Babel dev config doesn't apply.

console.log('Generating minified bundle. This will take a moment...');
webpack(config).run((error, stats) => {
  if(error) {
    console.log(error);
    return 1;
  }
  const jsonStats = stats.toJson();
  if(jsonStats.hasErrors) {
    return jsonStats.errors.map(err => console.log(err));
  }
  if(jsonStats.hasWarnings) {
    console.log('Webpack generated the following warnings: ');
    jsonStats.warnings.map(warning => console.log(warning));
  }
  console.log(`Webpack stats: ${stats}`);
  console.log('Compilation was successful!');
  return 0;
});
