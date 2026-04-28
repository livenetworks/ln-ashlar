import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
	plugins: [],
	build: {
		outDir: 'demo/dist',
		emptyOutDir: true,
		lib: {
			entry: resolve(__dirname, 'js/index.js'),
			name: 'LnAshlar',
			formats: ['es', 'iife'],
			fileName: (format) => format === 'es' ? 'ln-ashlar.js' : 'ln-ashlar.iife.js'
		},
		rollupOptions: {
			output: {
				assetFileNames: (assetInfo) => {
					if (assetInfo.name && assetInfo.name.endsWith('.css')) {
						return 'ln-ashlar.css';
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
