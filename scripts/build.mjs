import { build } from 'vite';
import { resolve, join } from 'path';
import fs from 'fs';
import * as sass from 'sass-embedded';

const __dirname = resolve();
const componentsDir = resolve(__dirname, 'components');
const themeDir = resolve(__dirname, 'theme');
const distDir = resolve(__dirname, 'dist');
const demoDistDir = resolve(__dirname, 'demo/dist');

// Ensure output directories exist
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
if (!fs.existsSync(demoDistDir)) fs.mkdirSync(demoDistDir, { recursive: true });

const components = fs.readdirSync(componentsDir).filter(file => {
	const stat = fs.statSync(join(componentsDir, file));
	return stat.isDirectory() && file !== 'ln-core';
});

// Command line arguments
const isWatch = process.argv.includes('--watch');

const masterConfig = {
	configFile: false,
	build: {
		outDir: 'demo/dist',
		emptyOutDir: false,
		lib: {
			entry: resolve(__dirname, 'components/index.js'),
			name: 'LnAshlar',
			formats: ['es', 'iife'],
			fileName: (format) => format === 'es' ? 'ln-ashlar.js' : 'ln-ashlar.iife.js'
		},
		watch: isWatch ? {} : null
	}
};

// Generates config for a single standalone component
function getComponentConfig(entryName, srcPath) {
	return {
		configFile: false,
		build: {
			outDir: 'components',
			emptyOutDir: false,
			lib: {
				entry: { [entryName]: srcPath },
				formats: ['iife'],
				name: 'LnAshlarComponent',
				fileName: (format, name) => `${name}.js`
			},
			watch: isWatch ? {} : null
		}
	};
}

function compileSassFiles() {
	console.log('Compiling Modular SCSS bundles (Core, Theme, Full, Dev)...');

	const stylesheets = [
		{ src: 'ln-ashlar-core.scss', out: 'ln-ashlar-core.css' },
		{ src: 'ln-ashlar-theme.scss', out: 'ln-ashlar-theme.css' },
		{ src: 'ln-ashlar.scss', out: 'ln-ashlar.css' },
		{ src: 'ln-ashlar-dev.scss', out: 'ln-ashlar-dev.css' }
	];

	for (const { src, out } of stylesheets) {
		const srcPath = join(themeDir, src);
		if (!fs.existsSync(srcPath)) continue;

		// Unminified / Expanded for demo/dist
		const result = sass.compile(srcPath, {
			style: 'expanded',
			sourceMap: false
		});

		// Minified / Compressed for dist
		const resultMin = sass.compile(srcPath, {
			style: 'compressed',
			sourceMap: false
		});

		fs.writeFileSync(join(demoDistDir, out), result.css);
		fs.writeFileSync(join(distDir, out), resultMin.css);
		console.log(`✓ Compiled ${out}`);
	}
}

async function run() {
	console.log('Building Master JS Bundle...');
	await build(masterConfig);

	// Also copy built JS to dist/
	if (fs.existsSync(join(demoDistDir, 'ln-ashlar.js'))) {
		fs.copyFileSync(join(demoDistDir, 'ln-ashlar.js'), join(distDir, 'ln-ashlar.js'));
	}
	if (fs.existsSync(join(demoDistDir, 'ln-ashlar.iife.js'))) {
		fs.copyFileSync(join(demoDistDir, 'ln-ashlar.iife.js'), join(distDir, 'ln-ashlar.iife.js'));
	}

	const devJsConfig = {
		configFile: false,
		build: {
			outDir: 'demo/dist',
			emptyOutDir: false,
			lib: {
				entry: resolve(__dirname, 'components/ln-debug/src/ln-debug.js'),
				name: 'LnAshlarDev',
				formats: ['es', 'iife'],
				fileName: (format) => format === 'es' ? 'ln-ashlar-dev.js' : 'ln-ashlar-dev.iife.js'
			},
			watch: isWatch ? {} : null
		}
	};

	console.log('Building Dev JS Bundle (ln-ashlar-dev)...');
	await build(devJsConfig);
	if (fs.existsSync(join(demoDistDir, 'ln-ashlar-dev.js'))) {
		fs.copyFileSync(join(demoDistDir, 'ln-ashlar-dev.js'), join(distDir, 'ln-ashlar-dev.js'));
	}
	if (fs.existsSync(join(demoDistDir, 'ln-ashlar-dev.iife.js'))) {
		fs.copyFileSync(join(demoDistDir, 'ln-ashlar-dev.iife.js'), join(distDir, 'ln-ashlar-dev.iife.js'));
	}

	compileSassFiles();

	console.log('Building Standalone Components (sequentially to prevent resource issues)...');
	
	// Collect all entries to build
	const entriesToBuild = [];
	for (const comp of components) {
		const srcPath = join(componentsDir, comp, 'src', `${comp}.js`);
		if (fs.existsSync(srcPath)) {
			entriesToBuild.push({ entryName: `${comp}/${comp}`, srcPath });
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
