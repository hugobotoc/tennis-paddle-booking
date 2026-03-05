import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  compilerOptions: {
    dev: process.env.NODE_ENV === 'development'
  },
  kit: {
    adapter: adapter(),
  },
};

export default config;
