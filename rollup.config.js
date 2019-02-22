import pkg from './package.json';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default [
  {
    input: 'index.js',
    output: {
      file: pkg.browser,
      format: 'umd'
    },
    plugins: [resolve(), commonjs()]
  },
  {
    input: 'index-half.js',
    output: {
      file: pkg.browser_half,
      format: 'umd'
    },
    plugins: [resolve(), commonjs()]
  },
  {
    input: 'index-print.js',
    output: {
      file: pkg.browser_print,
      format: 'umd'
    },
    plugins: [resolve(), commonjs()]
  }
];
