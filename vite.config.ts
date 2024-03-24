import preact from '@preact/preset-vite'
import { defineConfig } from 'vite'
import typedCssModulesPlugin from 'vite-plugin-typed-css-modules'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    tsconfigPaths(),
    typedCssModulesPlugin(),
  ],
  build: {
    target: 'es2020',
    outDir: 'dist',
    lib: {
      entry: 'src/lib/index.tsx',
      formats: ['es'],
      fileName: 'index',
    },
    sourcemap: true,
    rollupOptions: {
      external: ['preact', '@preact/signals', 'deepsignal', 'million', '@preact/signals-core', 'preact/hooks'],
    },
  },
  server: {
    port: 5174,
  },
  css: {
    modules: {
      generateScopedName: '[hash:base32:4]',
    },
  },
})
