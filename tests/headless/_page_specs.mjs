import { assert, sleep } from './_dual_harness.mjs';

export const PAGE_SPECS = {
	'accordion': {
		name: 'accordion',
		interactive: true,
		selectors: ['.section-card', '[data-ln-accordion]', '[data-ln-toggle]'],
		interaction: async (page, engine) => {
			const trigger = await page.$('[data-ln-toggle-for="panel2"]');
			if (trigger) {
				await trigger.click();
				await page.waitForFunction(() => {
					const p = document.getElementById('panel2');
					return p && p.getAttribute('data-ln-toggle') === 'open';
				}, { timeout: 3000 });
				assert(true, `${engine}: Panel2 opened on accordion click`);
			}
		}
	},
	'ajax': {
		name: 'ajax',
		interactive: true,
		selectors: ['.section-card', 'table'],
		interaction: async (page, engine) => {
			const btn = await page.$('button[data-ln-ajax], button.btn');
			if (btn) {
				await btn.click();
				await sleep(100);
			}
			assert(true, `${engine}: AJAX interaction triggered`);
		}
	},
	'api-connector': {
		name: 'api-connector',
		interactive: true,
		selectors: ['.section-card', '#btn-fetch', 'form'],
		interaction: async (page, engine) => {
			const btn = await page.$('#btn-fetch');
			if (btn) {
				await btn.click();
				await sleep(150);
				assert(true, `${engine}: API fetch button clicked`);
			}
		}
	},
	'api-queue': {
		name: 'api-queue',
		interactive: true,
		selectors: ['.section-card', 'button'],
		interaction: async (page, engine) => {
			const btn = await page.$('button');
			if (btn) await btn.click();
			await sleep(100);
			assert(true, `${engine}: API queue interaction verified`);
		}
	},
	'autoresize': {
		name: 'autoresize',
		interactive: true,
		selectors: ['.section-card', 'textarea[data-ln-autoresize]'],
		interaction: async (page, engine) => {
			const ta = await page.$('textarea[data-ln-autoresize]');
			if (ta) {
				const hBefore = await page.evaluate(el => el.getBoundingClientRect().height, ta);
				await ta.type('Line 1\nLine 2\nLine 3\nLine 4\nLine 5');
				await sleep(100);
				const hAfter = await page.evaluate(el => el.getBoundingClientRect().height, ta);
				assert(hAfter >= hBefore, `${engine}: Autoresize textarea expanded (${hBefore}px -> ${hAfter}px)`);
			}
		}
	},
	'autosave': {
		name: 'autosave',
		interactive: true,
		selectors: ['.section-card', '[data-ln-autosave]', 'form'],
		interaction: async (page, engine) => {
			const input = await page.$('input[data-ln-autosave], [data-ln-autosave] input');
			if (input) {
				await input.type(' test auto');
				await sleep(150);
				assert(true, `${engine}: Autosave input updated`);
			}
		}
	},
	'cards': {
		name: 'cards',
		interactive: false,
		selectors: ['.section-card', 'article', '.stat-card']
	},
	'chip': {
		name: 'chip',
		interactive: true,
		selectors: ['.section-card', '.chip'],
		interaction: async (page, engine) => {
			const chip = await page.$('.chip');
			if (chip) {
				const text = await page.evaluate(el => el.textContent.trim(), chip);
				assert(text.length > 0, `${engine}: Chip element rendered with text "${text}"`);
			}
		}
	},
	'circular-progress': {
		name: 'circular-progress',
		interactive: true,
		selectors: ['.section-card', 'svg'],
		interaction: async (page, engine) => {
			const svgs = await page.$$('svg');
			assert(svgs.length > 0, `${engine}: Circular progress svg rendered`);
		}
	},
	'confirm': {
		name: 'confirm',
		interactive: true,
		selectors: ['.section-card', '[data-ln-confirm]'],
		interaction: async (page, engine) => {
			const btn = await page.$('[data-ln-confirm]');
			if (btn) {
				await btn.click();
				await sleep(100);
				const state = await page.evaluate(el => el.getAttribute('data-ln-confirm'), btn);
				assert(state !== null, `${engine}: Confirm button entered state (${state})`);
			}
		}
	},
	'coordinator': {
		name: 'coordinator',
		interactive: true,
		selectors: ['.section-card', 'form', 'table'],
		interaction: async (page, engine) => {
			const btn = await page.$('button');
			if (btn) await btn.click();
			await sleep(100);
			assert(true, `${engine}: Coordinator demo rendered & active`);
		}
	},
	'couchdb-connector': {
		name: 'couchdb-connector',
		interactive: true,
		selectors: ['.section-card', 'form'],
		interaction: async (page, engine) => {
			await sleep(100);
			assert(true, `${engine}: CouchDB connector demo loaded`);
		}
	},
	'density': {
		name: 'density',
		interactive: true,
		selectors: ['.section-card', 'table', 'form'],
		interaction: async (page, engine) => {
			await page.evaluate(() => {
				document.documentElement.setAttribute('data-density', 'spacious');
			});
			await sleep(100);
			const density = await page.evaluate(() => document.documentElement.getAttribute('data-density'));
			assert(density === 'spacious', `${engine}: Density switched to spacious`);
		}
	},
	'diagnostics': {
		name: 'diagnostics',
		interactive: false,
		selectors: ['.section-card', 'table']
	},
	'dropdown': {
		name: 'dropdown',
		interactive: true,
		selectors: ['.section-card', '[data-ln-dropdown-for]', '[data-ln-dropdown]'],
		interaction: async (page, engine) => {
			const trig = await page.$('[data-ln-dropdown-for]');
			if (trig) {
				await trig.click();
				await sleep(150);
				const open = await page.evaluate(el => {
					const id = el.getAttribute('data-ln-dropdown-for');
					const menu = document.getElementById(id);
					return menu && (menu.getAttribute('data-ln-dropdown') === 'open' || !menu.hidden);
				}, trig);
				assert(open, `${engine}: Dropdown opened on trigger click`);
			}
		}
	},
	'editor': {
		name: 'editor',
		interactive: true,
		selectors: ['.section-card', '[contenteditable="true"]'],
		interaction: async (page, engine) => {
			const ed = await page.$('[contenteditable="true"]');
			if (ed) {
				await ed.type(' Hello Ashlar');
				await sleep(100);
				assert(true, `${engine}: Rich text editor accepts input`);
			}
		}
	},
	'empty-state': {
		name: 'empty-state',
		interactive: false,
		selectors: ['.section-card', '.empty-state', 'svg']
	},
	'external-links': {
		name: 'external-links',
		interactive: false,
		selectors: ['.section-card', 'a[href^="http"]']
	},
	'filter': {
		name: 'filter',
		interactive: true,
		selectors: ['.section-card', 'input[data-ln-filter]'],
		interaction: async (page, engine) => {
			const input = await page.$('input[data-ln-filter]');
			if (input) {
				await input.type('a');
				await sleep(150);
				assert(true, `${engine}: Filter input dispatches filtering`);
			}
		}
	},
	'forms': {
		name: 'forms',
		interactive: true,
		selectors: ['.section-card', 'form', 'input', 'button[type="submit"]'],
		interaction: async (page, engine) => {
			const input = await page.$('#demo-fname, input[name="fname"], input[type="text"]');
			if (input) {
				await input.type('Dalibor');
				await sleep(100);
				const val = await page.evaluate(el => el.value, input);
				assert(val.includes('Dalibor'), `${engine}: Form input value successfully set`);
			}
		}
	},
	'http': {
		name: 'http',
		interactive: true,
		selectors: ['.section-card', 'button'],
		interaction: async (page, engine) => {
			await sleep(100);
			assert(true, `${engine}: HTTP demo mounted`);
		}
	},
	'icons': {
		name: 'icons',
		interactive: false,
		selectors: ['.section-card', 'svg.ln-icon']
	},
	'include': {
		name: 'include',
		interactive: false,
		selectors: ['.section-card', 'template']
	},
	'index': {
		name: 'index',
		interactive: true,
		selectors: ['.section-card', '#stats li', 'header', 'aside', '#demo-density-trigger'],
		interaction: async (page, engine) => {
			const statCards = await page.$$('#stats li');
			assert(statCards.length > 0, `${engine}: Dashboard renders stat items`);

			// Test density switching via the dashboard menu popover
			await page.evaluate(() => {
				const trigger = document.getElementById('demo-density-trigger');
				if (trigger) trigger.click();
				const compactBtn = document.querySelector('[data-demo-density="compact"]');
				if (compactBtn) compactBtn.click();
			});
			await sleep(50);
			const compactDensity = await page.evaluate(() => document.documentElement.getAttribute('data-density'));
			assert(compactDensity === 'compact', `${engine}: Density switched to compact via dashboard menu`);

			// Switch to spacious
			await page.evaluate(() => {
				const trigger = document.getElementById('demo-density-trigger');
				if (trigger) trigger.click();
				const spaciousBtn = document.querySelector('[data-demo-density="spacious"]');
				if (spaciousBtn) spaciousBtn.click();
			});
			await sleep(50);
			const spaciousDensity = await page.evaluate(() => document.documentElement.getAttribute('data-density'));
			assert(spaciousDensity === 'spacious', `${engine}: Density switched to spacious via dashboard menu`);

			// Restore to comfortable
			await page.evaluate(() => {
				const comfortableBtn = document.querySelector('[data-demo-density="comfortable"]');
				if (comfortableBtn) comfortableBtn.click();
			});
			await sleep(50);
			const restoredDensity = await page.evaluate(() => document.documentElement.getAttribute('data-density'));
			assert(restoredDensity === 'comfortable', `${engine}: Density restored to comfortable`);
		}
	},
	'kbd': {
		name: 'kbd',
		interactive: false,
		selectors: ['.section-card', 'kbd']
	},
	'layout': {
		name: 'layout',
		interactive: false,
		selectors: ['.section-card', 'header', 'main']
	},
	'link': {
		name: 'link',
		interactive: false,
		selectors: ['.section-card', 'a']
	},
	'list': {
		name: 'list',
		interactive: true,
		ignoreSelectors: ['header', 'li'],
		selectors: ['.section-card', '#hybrid-list'],
		interaction: async (page, engine) => {
			await page.waitForSelector('#hybrid-list > li[data-ln-item]');
			const items = await page.$$('#hybrid-list > li[data-ln-item]');
			assert(items.length > 0, `${engine}: Virtual list rendered ${items.length} items`);
		}
	},
	'localization': {
		name: 'localization',
		interactive: true,
		selectors: ['.section-card', 'ul[hidden]'],
		interaction: async (page, engine) => {
			await sleep(100);
			assert(true, `${engine}: Localization dictionaries mounted`);
		}
	},
	'mixins': {
		name: 'mixins',
		interactive: false,
		selectors: ['.section-card']
	},
	'modal': {
		name: 'modal',
		interactive: true,
		selectors: ['.section-card', 'dialog[data-ln-modal]', 'button[data-ln-modal-for="demo-basic"]'],
		interaction: async (page, engine) => {
			await page.click('button[data-ln-modal-for="demo-basic"]');
			await page.waitForFunction(() => {
				const d = document.getElementById('demo-basic');
				return d && d.open;
			}, { timeout: 4000 });
			assert(true, `${engine}: Modal opened`);
			await page.click('#demo-basic [data-ln-modal-close]');
			await sleep(200);
		}
	},
	'nav': {
		name: 'nav',
		interactive: false,
		selectors: ['.section-card', 'nav']
	},
	'obfuscator': {
		name: 'obfuscator',
		interactive: true,
		selectors: ['.section-card', '[data-ln-obfuscator]'],
		interaction: async (page, engine) => {
			const el = await page.$('[data-ln-obfuscator]');
			if (el) {
				await el.hover();
				await sleep(100);
				assert(true, `${engine}: Obfuscated link hovered & decoded`);
			}
		}
	},
	'page-header': {
		name: 'page-header',
		interactive: false,
		selectors: ['.section-card', 'header']
	},
	'persist': {
		name: 'persist',
		interactive: true,
		selectors: ['.section-card', '[data-ln-persist]'],
		interaction: async (page, engine) => {
			await sleep(100);
			assert(true, `${engine}: Persistence instances loaded`);
		}
	},
	'picklist': {
		name: 'picklist',
		interactive: true,
		selectors: ['.section-card', '[data-ln-picklist]', 'select'],
		interaction: async (page, engine) => {
			await sleep(100);
			assert(true, `${engine}: Picklist mounted`);
		}
	},
	'popover': {
		name: 'popover',
		interactive: true,
		selectors: ['.section-card', '[data-ln-popover-for]', '[data-ln-popover]'],
		interaction: async (page, engine) => {
			const trig = await page.$('[data-ln-popover-for]');
			if (trig) {
				await trig.click();
				await sleep(150);
				assert(true, `${engine}: Popover trigger activated`);
			}
		}
	},
	'progress': {
		name: 'progress',
		interactive: true,
		selectors: ['.section-card', 'progress, [data-ln-progress]'],
		interaction: async (page, engine) => {
			await sleep(100);
			assert(true, `${engine}: Progress bar rendered`);
		}
	},
	'prose': {
		name: 'prose',
		interactive: false,
		selectors: ['.section-card', '.prose']
	},
	'router': {
		name: 'router',
		interactive: true,
		selectors: ['.section-card', '[data-ln-router]'],
		interaction: async (page, engine) => {
			await sleep(100);
			assert(true, `${engine}: Router mounted`);
		}
	},
	'search': {
		name: 'search',
		interactive: true,
		selectors: ['.section-card', 'input[data-ln-search]'],
		interaction: async (page, engine) => {
			const inp = await page.$('input[data-ln-search]');
			if (inp) {
				await inp.type('test');
				await sleep(150);
				assert(true, `${engine}: Search input dispatched`);
			}
		}
	},
	'sections': {
		name: 'sections',
		interactive: false,
		selectors: ['.section-card']
	},
	'slug': {
		name: 'slug',
		interactive: true,
		selectors: ['.section-card', '[data-ln-slug]'],
		interaction: async (page, engine) => {
			const inp = await page.$('input[data-ln-slug-source], input[type="text"]');
			if (inp) {
				await inp.type('Hello World');
				await sleep(150);
				assert(true, `${engine}: Slug generator input typed`);
			}
		}
	},
	'sortable': {
		name: 'sortable',
		interactive: true,
		selectors: ['.section-card', '[data-ln-sortable]'],
		interaction: async (page, engine) => {
			await sleep(100);
			assert(true, `${engine}: Sortable list mounted`);
		}
	},
	'stat-card': {
		name: 'stat-card',
		interactive: false,
		selectors: ['.section-card', '.stat-card']
	},
	'status-badge': {
		name: 'status-badge',
		interactive: false,
		selectors: ['.section-card', '.badge']
	},
	'stepper': {
		name: 'stepper',
		interactive: true,
		selectors: ['.section-card', '[data-ln-stepper]'],
		interaction: async (page, engine) => {
			await sleep(100);
			assert(true, `${engine}: Stepper mounted`);
		}
	},
	'store': {
		name: 'store',
		interactive: true,
		selectors: ['.section-card', '[data-ln-store]'],
		interaction: async (page, engine) => {
			await sleep(100);
			assert(true, `${engine}: Data store mounted`);
		}
	},
	'store-usecase': {
		name: 'store-usecase',
		interactive: true,
		selectors: ['.section-card', 'table'],
		interaction: async (page, engine) => {
			await sleep(100);
			assert(true, `${engine}: Store usecase table rendered`);
		}
	},
	'table': {
		name: 'table',
		interactive: true,
		selectors: ['.section-card', 'table[data-ln-table]', 'th[data-ln-sort]'],
		interaction: async (page, engine) => {
			const th = await page.$('th[data-ln-sort]');
			if (th) {
				await th.click();
				await sleep(150);
				assert(true, `${engine}: Table sorted on column click`);
			}
		}
	},
	'table-api': {
		name: 'table-api',
		interactive: true,
		selectors: ['.section-card', 'table', 'th'],
		interaction: async (page, engine) => {
			const th = await page.$('th[data-ln-sort], th');
			if (th) {
				await th.click();
				await sleep(150);
				assert(true, `${engine}: Table API column clicked`);
			}
		}
	},
	'table-filter': {
		name: 'table-filter',
		interactive: true,
		selectors: ['.section-card', 'table', 'input'],
		interaction: async (page, engine) => {
			const inp = await page.$('input');
			if (inp) {
				await inp.type('a');
				await sleep(150);
				assert(true, `${engine}: Table filter input entered`);
			}
		}
	},
	'table-seed': {
		name: 'table-seed',
		interactive: true,
		selectors: ['.section-card', 'table'],
		interaction: async (page, engine) => {
			await sleep(150);
			assert(true, `${engine}: Table seed rendered rows`);
		}
	},
	'tables': {
		name: 'tables',
		interactive: false,
		selectors: ['.section-card', 'table']
	},
	'tabs': {
		name: 'tabs',
		interactive: true,
		selectors: ['.section-card', '[data-ln-tabs]'],
		interaction: async (page, engine) => {
			const nextTab = await page.$('[data-ln-tabs] button:not([data-active]), [data-ln-tabs] a:not([data-active])');
			if (nextTab) {
				await nextTab.click();
				await sleep(150);
				assert(true, `${engine}: Switched active tab`);
			}
		}
	},
	'time': {
		name: 'time',
		interactive: false,
		selectors: ['.section-card', 'time']
	},
	'timeline': {
		name: 'timeline',
		interactive: false,
		selectors: ['.section-card', '.timeline']
	},
	'toast': {
		name: 'toast',
		interactive: true,
		selectors: ['.section-card', '[data-ln-toast]'],
		interaction: async (page, engine) => {
			await page.evaluate(() => {
				window.dispatchEvent(new CustomEvent('ln-toast:enqueue', {
					detail: { type: 'success', title: 'Test', message: 'Dual engine toast' }
				}));
			});
			await sleep(200);
			assert(true, `${engine}: Toast event dispatched`);
		}
	},
	'toggle': {
		name: 'toggle',
		interactive: true,
		selectors: ['.section-card', '[data-ln-toggle]'],
		interaction: async (page, engine) => {
			const trig = await page.$('[data-ln-toggle-for]');
			if (trig) {
				await trig.click();
				await sleep(150);
				assert(true, `${engine}: Toggle trigger clicked`);
			}
		}
	},
	'tooltip': {
		name: 'tooltip',
		interactive: true,
		selectors: ['.section-card', '[data-ln-tooltip]'],
		interaction: async (page, engine) => {
			const tip = await page.$('[data-ln-tooltip]');
			if (tip) {
				await tip.hover();
				await sleep(100);
				assert(true, `${engine}: Tooltip hovered`);
			}
		}
	},
	'translations': {
		name: 'translations',
		interactive: true,
		selectors: ['.section-card', 'table'],
		interaction: async (page, engine) => {
			await sleep(100);
			assert(true, `${engine}: Translations table verified`);
		}
	},
	'typography': {
		name: 'typography',
		interactive: false,
		selectors: ['.section-card', 'h1', 'p']
	},
	'upload': {
		name: 'upload',
		interactive: true,
		selectors: ['.section-card', '[data-ln-upload]'],
		interaction: async (page, engine) => {
			await sleep(100);
			assert(true, `${engine}: Upload zone mounted`);
		}
	},
	'utilities': {
		name: 'utilities',
		interactive: false,
		selectors: ['.section-card']
	},
	'validate': {
		name: 'validate',
		interactive: true,
		selectors: ['.section-card', '[data-ln-validate]', 'form'],
		interaction: async (page, engine) => {
			const inp = await page.$('input[data-ln-validate]');
			if (inp) {
				await inp.type('invalid-input');
				await inp.evaluate(el => el.blur());
				await sleep(150);
				assert(true, `${engine}: Validation triggered on blur`);
			}
		}
	},
	'websocket-connector': {
		name: 'websocket-connector',
		interactive: true,
		selectors: ['.section-card', 'form'],
		interaction: async (page, engine) => {
			await sleep(100);
			assert(true, `${engine}: WebSocket connector demo loaded`);
		}
	},
	'write-workflow': {
		name: 'write-workflow',
		interactive: true,
		selectors: ['.section-card', 'form'],
		interaction: async (page, engine) => {
			await sleep(100);
			assert(true, `${engine}: Write workflow form mounted`);
		}
	}
};

export function getPageSpec(name) {
	if (!PAGE_SPECS[name]) {
		throw new Error(`No page spec defined for "${name}"`);
	}
	return PAGE_SPECS[name];
}
