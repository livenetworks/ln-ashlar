import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
	build: {
		outDir: 'dist',
		emptyOutDir: true,
		lib: {
			entry: resolve(__dirname, 'js/index.js'),
			name: 'LnAcme',
			formats: ['es', 'iife'],
			fileName: (format) => format === 'es' ? 'ln-acme.js' : 'ln-acme.iife.js'
		},
		rollupOptions: {
			output: {
				assetFileNames: (assetInfo) => {
					if (assetInfo.name && assetInfo.name.endsWith('.css')) {
						return 'ln-acme.css';
					}
					return 'assets/[name][extname]';
				}
			}
		}
	},
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern-compiler'
			}
		}
	}
});
