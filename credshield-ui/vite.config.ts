import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import path from 'node:path';

export default defineConfig({
  cacheDir: './.vite',
  define: {
    'process.env': {},
    'process.version': JSON.stringify('v24.11.1'),
    global: 'globalThis',
  },
  resolve: {
    alias: {
      '@CredShield-ntwrk/credshield-api': path.resolve(__dirname, '../api/src/index.ts'),
      '@CredShield-ntwrk/credshield-contract': path.resolve(__dirname, '../contract/src/index.ts'),
      '@CredShield-ntwrk/bboard-api': path.resolve(__dirname, '../api/src/index.ts'),
      '@CredShield-ntwrk/bboard-contract': path.resolve(__dirname, '../contract/src/index.ts'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.wasm'],
    mainFields: ['browser', 'module', 'main'],
  },
  build: {
    target: 'esnext',
    minify: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('onchain-runtime-v3')) return 'wasm';
        },
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true,
      extensions: ['.js', '.cjs'],
      ignoreDynamicRequires: true,
    },
  },
  plugins: [
    react(),
    wasm(),
    topLevelAwait({
      promiseExportName: '__tla',
      promiseImportName: (i) => `__tla_${i}`,
    }),
    {
      name: 'wasm-module-resolver',
      resolveId(source, importer) {
        if (
          source === '@CredShield-ntwrk/onchain-runtime-v3' &&
          importer &&
          importer.includes('@CredShield-ntwrk/compact-runtime')
        ) {
          return {
            id: source,
            external: false,
            moduleSideEffects: true,
          };
        }
        return null;
      },
    },
  ],
  optimizeDeps: {
    rolldownOptions: {
      target: 'esnext',
      supported: { 'top-level-await': true },
      platform: 'browser',
      format: 'esm',
      loader: {
        '.wasm': 'binary',
      },
    },
    include: ['@CredShield-ntwrk/compact-runtime'],
    exclude: [
      '@CredShield-ntwrk/onchain-runtime-v3',
      '@CredShield-ntwrk/onchain-runtime-v3/CredShield_onchain_runtime_wasm_bg.wasm',
      '@CredShield-ntwrk/onchain-runtime-v3/CredShield_onchain_runtime_wasm.js',
      '@CredShield-ntwrk/credshield-api',
      '@CredShield-ntwrk/credshield-contract',
      '@CredShield-ntwrk/bboard-api',
      '@CredShield-ntwrk/bboard-contract',
    ],
  },
  checks: {
    importIsUndefined: false,
    pluginTimings: false,
  },
});
