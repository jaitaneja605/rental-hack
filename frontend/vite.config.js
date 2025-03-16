import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0',  // Allow binding to all network interfaces
    port: 5173,        // Ensure the correct port is being used
    allowedHosts: [
      'safe-rent-app.onrender.com',  // Add this as an allowed host
      'localhost',  // You can also allow localhost for local testing
    ],
  },
})
