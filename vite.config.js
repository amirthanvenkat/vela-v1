import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base so the build works on GitHub Pages (/vela-v1/) and from any other folder or host.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: { port: 5777 },
  preview: { port: 5777 },
  test: {
    environment: 'node',
    include: ['src/**/*.test.js'],
  },
});
