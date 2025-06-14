/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker'

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    esbuildOptions: {
      supported: {
        'top-level-await': true,
      },
    },
  },
  esbuild: {
    supported: {
      'top-level-await': true,
    },
  },
  plugins: [
    react(),
    checker({
      typescript: {
        tsconfigPath: './tsconfig.app.json'
      },
      overlay: true,
      terminal: true
    })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    css: true,
  },
})

