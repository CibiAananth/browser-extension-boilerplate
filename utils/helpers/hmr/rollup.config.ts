import typescript from '@rollup/plugin-typescript';

const config = {
  plugins: [typescript()],
  input: 'utils/helpers/hmr/server.ts',
  output: {
    file: 'utils/helpers/hmr/server.js',
  },
  external: ['ws', 'chokidar'],
};

export default config;
