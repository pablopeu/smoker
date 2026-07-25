import { defineConfig } from 'vite';

// App 100% client-side. base './' para que el build sirva desde cualquier path.
export default defineConfig({
  base: './',
  server: {
    host: true, // accesible desde el celular en la misma red del taller
    port: 5173,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
