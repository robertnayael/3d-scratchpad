import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import gltf from 'vite-plugin-gltf';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), gltf()],
});
