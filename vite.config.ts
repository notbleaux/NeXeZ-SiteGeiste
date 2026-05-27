import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/NeXeZ-SiteGeiste/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@njz-os': path.resolve(__dirname, './vendor/satorXrotas/packages/@njz-os'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    host: true,
  },
})