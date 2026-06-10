import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/discord.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  target: 'es2022',
  shims: true, // import.meta.url shim for the CJS build (font path resolution)
  noExternal: ['gifenc'], // CJS-only package without named ESM exports — bundle it
  publicDir: 'src/assets/fonts', // ship the bundled font next to the built files
});
