import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  compilerOptions: {
    dev: process.env.NODE_ENV === 'development'
  },
  kit: {
    adapter: adapter({
      runtime: 'nodejs18.x'
    }),
  },
};

export default config;
