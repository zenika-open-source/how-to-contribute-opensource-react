import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { UserConfig } from 'vite';
import { resolve } from 'path';

const config: UserConfig = {
  plugins: [react()],

  resolve: {
    alias: {
        '@': resolve(__dirname, 'src'), // Define the alias for @
    }
  },
  
  server: {
    open: true,
  },

  build: {
    sourcemap: true,
  },

};

export default defineConfig(config);
