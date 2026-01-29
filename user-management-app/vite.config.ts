import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Ensure environment variables are available in production
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify(
      process.env.NODE_ENV === 'production' 
        ? 'https://usermanagementapp-production.up.railway.app'
        : 'http://localhost:3001'
    )
  }
})
