import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import pkg from './package.json';

export default {
  input: 'src/index.js',
  output: [{
    format: 'umd',
    name: 'BigTest.Interactor',
    file: pkg.main
  }, {
    format: 'es',
    file: pkg.module
  }],
  plugins: [
    resolve(),
    babel({
      babelrc: false,
      comments: false,
      presets: [
        ['@babel/preset-env', {
          modules: false
        }]
      ]
    })
  ]
};
