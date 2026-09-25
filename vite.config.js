import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.js',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.jsx'],
      exclude: ['src/**/*.test.jsx', 'src/**/__tests__/**'],
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80,
    },
  },
})
