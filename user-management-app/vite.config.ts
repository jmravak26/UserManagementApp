import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Force production API URL for Firebase builds
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify('https://usermanagementapp-production.up.railway.app')
  }
})
