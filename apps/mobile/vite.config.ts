import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        'react-native': path.resolve(__dirname, './src/web-mocks/react-native.tsx'),
        'expo-image': path.resolve(__dirname, './src/web-mocks/expo-image.tsx'),
        'react-native-gesture-handler': path.resolve(__dirname, './src/web-mocks/react-native-gesture-handler.tsx'),
        'react-native-reanimated': path.resolve(__dirname, './src/web-mocks/react-native-reanimated.tsx'),
        'react-native-skeleton-content': path.resolve(__dirname, './src/web-mocks/react-native-skeleton-content.tsx'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
