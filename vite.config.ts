import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
    base: "./",
    publicDir: resolve(__dirname, 'public'),
    build: {
        sourcemap: false,
        rollupOptions: {
            output: {
                entryFileNames: `assets/[name].js`,
                chunkFileNames: `assets/[name].js`,
                assetFileNames: `assets/[name].[ext]`,
                manualChunks: {
                    base: ['./src/base.ts'],
                    ui: ['./src/ui.ts'],
                    buttons: ['./src/buttons.ts'],
                    functions: ['./src/functions.ts'],
                    keyEvents: ['./src/keyEvents.ts'],
                    secrets: ['./src/secrets.ts'],
                },
            },
        },
    },
    server: {
        port: 5501,
        host: '0.0.0.0',
        hmr: {
            port: 5501,
            protocol: 'wss',
            host: 'vscode.nomercy.tv',
            clientPort: 443,
            path: '/vite/',
        },
    },
    preview: {
        port: 5501,
        host: '0.0.0.0',
    },
    clearScreen: true,
});
