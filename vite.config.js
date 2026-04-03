import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readdirSync, copyFileSync, mkdirSync } from 'fs';

// Copies js/ln-icons/icons/*.svg → dist/icons/ for self-hosting custom icons
function copyCustomIconsPlugin() {
    return {
        name: 'copy-custom-icons',
        closeBundle() {
            var src  = resolve(__dirname, 'js/ln-icons/icons');
            var dest = resolve(__dirname, 'dist/icons');
            mkdirSync(dest, { recursive: true });
            readdirSync(src).forEach(function (file) {
                copyFileSync(resolve(src, file), resolve(dest, file));
            });
        }
    };
}

export default defineConfig({
	plugins: [copyCustomIconsPlugin()],
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
