import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite handles the development server and production build.
// The React plugin teaches Vite how to process JSX/TSX files.
export default defineConfig({
  plugins: [react()],
})
