import { build } from 'vite';
import { resolve, join } from 'path';
import fs from 'fs';

const __dirname = resolve();
const jsDir = resolve(__dirname, 'js');
const components = fs.readdirSync(jsDir).filter(file => {
	const stat = fs.statSync(join(jsDir, file));
	return stat.isDirectory() && file !== 'ln-core';
});

// Command line arguments
const isWatch = process.argv.includes('--watch');

const masterConfig = {
	configFile: false,
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
		},
		watch: isWatch ? {} : null
	},
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern-compiler'
			}
		}
	}
};

// Generates config for a single standalone component
function getComponentConfig(entryName, srcPath) {
	return {
		configFile: false,
		build: {
			outDir: 'js',
			emptyOutDir: false,
			lib: {
				entry: { [entryName]: srcPath },
				formats: ['iife'],
				name: 'LnAshlarComponent',
				fileName: (format, name) => `${name}.js`
			},
			rollupOptions: {
				output: {
					assetFileNames: 'assets/[name][extname]'
				}
			},
			watch: isWatch ? {} : null
		}
	};
}

async function run() {
	console.log('Building Master Bundle...');
	await build(masterConfig);

	console.log('Building Standalone Components (sequentially to prevent resource issues)...');
	
	// Collect all entries to build
	const entriesToBuild = [];
	for (const comp of components) {
		const srcPath = join(jsDir, comp, 'src', `${comp}.js`);
		if (fs.existsSync(srcPath)) {
			entriesToBuild.push({ entryName: `${comp}/${comp}`, srcPath });
		}
		if (comp === 'ln-table') {
			const sortSrc = join(jsDir, comp, 'src', 'ln-table-sort.js');
			if (fs.existsSync(sortSrc)) {
				entriesToBuild.push({ entryName: `${comp}/ln-table-sort`, srcPath: sortSrc });
			}
		}
	}

	console.log(`Found ${entriesToBuild.length} components to compile.`);

	// Build them one by one
	for (let i = 0; i < entriesToBuild.length; i++) {
		const { entryName, srcPath } = entriesToBuild[i];
		console.log(`[${i + 1}/${entriesToBuild.length}] Compiling ${entryName}...`);
		const config = getComponentConfig(entryName, srcPath);
		await build(config);
	}

	console.log('All builds completed successfully!');
}

run().catch(err => {
	console.error('Build failed:', err);
	process.exit(1);
});
