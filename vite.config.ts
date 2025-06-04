import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        host: true,
        port: 3000,
        open: true
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: true
    },
    optimizeDeps: {
        exclude: ['zstd-streaming-reader']
    },
    resolve: {
        alias: {
            'zstd-streaming-reader': '/zstd-streaming-reader/pkg/zstd_streaming_reader.js'
        }
    }
}); 