import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      react: fileURLToPath(new URL('./node_modules/react', import.meta.url)),
      'react/jsx-dev-runtime': fileURLToPath(new URL('./node_modules/react/jsx-dev-runtime.js', import.meta.url)),
      'react/jsx-runtime': fileURLToPath(new URL('./node_modules/react/jsx-runtime.js', import.meta.url)),
      'react-dom/client': fileURLToPath(new URL('./node_modules/react-dom/client.js', import.meta.url)),
      'react-dom': fileURLToPath(new URL('./node_modules/react-dom', import.meta.url)),
    },
    dedupe: ['react', 'react-dom'],
  },
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/__tests__/setupTests.js',
    server: {
      deps: {
        inline: true,
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['lcov', 'text', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{js,jsx}'],
      exclude: [
        'src/__tests__/**',
        'src/**/*.test.jsx',
        'src/main.jsx',
        'node_modules/**',
      ],
    },
  },
})