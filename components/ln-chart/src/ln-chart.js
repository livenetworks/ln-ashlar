import { cloneTemplateScoped, dispatch, fillTemplate, formatNumber, getLocale, registerComponent, defineAttrs, attrSpec, attrStr } from '../../ln-core';
import { buildChartModel, parseChartSort, parseChartViewBox } from './chart-model.js';

(function () {
	const DOM_SELECTOR = 'data-ln-chart';
	const DOM_ATTRIBUTE = 'lnChart';
	const DEFAULT_VIEW_BOX = { x: 0, y: 0, width: 1000, height: 320 };
	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Attribute Contract (SSOT) ──────────────────────────
	function _requestData(el) {
		const instance = el[DOM_ATTRIBUTE];
		if (!instance) return;
		instance.requestData();
	}

	function _renderChart(el) {
		const instance = el[DOM_ATTRIBUTE];
		if (!instance) return;
		instance._render();
	}

	const ATTRIBUTES = {
		'data-ln-chart':         { prop: 'name', type: 'string', read: attrStr, fallback: '', effect: _renderChart, description: 'Chart instance name or identifier' },
		'data-ln-chart-source':  { type: 'string', effect: _requestData, description: 'Source store or coordinator identifier' },
		'data-ln-chart-sort':    { type: 'string', effect: _requestData, description: 'Field name to sort chart series data by' },
		'data-ln-chart-type':    { type: 'enum', values: ['line', 'bar', 'area', 'scatter'], fallback: 'line', effect: _renderChart, description: 'Visual chart render type' },
		'data-ln-chart-x':       { type: 'string', effect: _renderChart, description: 'Field name mapping to X axis' },
		'data-ln-chart-y':       { type: 'string', effect: _renderChart, description: 'Field name mapping to Y axis' },
		'data-ln-chart-padding': { type: 'integer', fallback: 20, min: 0, effect: _renderChart, description: 'Internal plot padding in pixels' },
		'data-ln-chart-zero':    { type: 'boolean', effect: _renderChart, description: 'Forces Y axis scale to start at zero' }
	};
	const ATTR_SPEC = attrSpec(ATTRIBUTES);

	function setText(element, value) {
		if (element) element.textContent = value;
	}

	function _component(dom) {
		this.dom = dom;
		defineAttrs(this, dom, ATTR_SPEC);
		this.source = dom.getAttribute('data-ln-chart-source') || this.name;
		this.plot = dom.querySelector('[data-ln-chart-plot]');
		this.line = dom.querySelector('[data-ln-chart-line]');
		this.area = dom.querySelector('[data-ln-chart-area]');
		this.labels = dom.querySelector('[data-ln-chart-labels]');
		this.empty = dom.querySelector('[data-ln-chart-empty]');
		this.minimum = dom.querySelector('[data-ln-chart-min]');
		this.maximum = dom.querySelector('[data-ln-chart-max]');
		this.count = dom.querySelector('[data-ln-chart-count]');
		this._data = [];
		this.model = null;
		this.isLoaded = false;

		const self = this;
		this._onSetData = function (event) {
			const detail = event.detail || {};
			self._data = Array.isArray(detail.data) ? detail.data : [];
			self.isLoaded = true;
			self._setLoading(false);
			self._render();
		};
		this._onSetLoading = function (event) {
			self._setLoading(!!(event.detail && event.detail.loading));
		};
		this._onRefresh = function () {
			self.requestData();
		};

		dom.addEventListener('ln-chart:set-data', this._onSetData);
		dom.addEventListener('ln-chart:set-loading', this._onSetLoading);
		dom.addEventListener('ln-chart:request-refresh', this._onRefresh);

		this.requestData();
		return this;
	}

	_component.prototype._readOptions = function () {
		const rawPadding = this.dom.getAttribute('data-ln-chart-padding');
		const parsedPadding = rawPadding === null ? NaN : Number(rawPadding);
		const type = (this.dom.getAttribute('data-ln-chart-type') || 'line').toLowerCase();
		return {
			xField: this.dom.getAttribute('data-ln-chart-x') || 'label',
			yField: this.dom.getAttribute('data-ln-chart-y') || 'value',
			includeZero: this.dom.getAttribute('data-ln-chart-zero') !== 'false',
			padding: Number.isFinite(parsedPadding) && parsedPadding >= 0 ? parsedPadding : 16,
			type: type === 'area' || type === 'polygon' ? 'area' : 'line',
			viewBox: this.plot ? (parseChartViewBox(this.plot.getAttribute('viewBox')) || DEFAULT_VIEW_BOX) : DEFAULT_VIEW_BOX
		};
	};

	_component.prototype._setLoading = function (loading) {
		this.dom.classList.toggle('ln-chart--loading', loading);
		this.dom.setAttribute('aria-busy', loading ? 'true' : 'false');
	};

	_component.prototype._renderLabels = function (model) {
		if (!this.labels) return;
		this.labels.replaceChildren();
		if (model.count === 0) return;

		const templateName = this.name + '-label';
		const selector = '[data-ln-template="' + templateName + '"]';
		if (!this.dom.querySelector(selector) && !document.querySelector(selector)) return;

		const prototype = cloneTemplateScoped(this.dom, templateName, 'ln-chart');
		if (!prototype) return;

		const locale = getLocale(this.dom);
		for (const point of model.points) {
			const clone = prototype.cloneNode(true);
			fillTemplate(clone, {
				label: point.label,
				value: formatNumber(point.value, locale)
			});
			this.labels.appendChild(clone);
		}
	};

	_component.prototype._render = function () {
		const options = this._readOptions();
		const model = buildChartModel(this._data, options);
		this.model = model;

		if (this.line) {
			this.line.setAttribute('points', model.linePoints);
			this.line.toggleAttribute('hidden', model.count === 0);
		}
		if (this.area) {
			this.area.setAttribute('points', model.areaPoints);
			this.area.toggleAttribute('hidden', model.count === 0 || options.type !== 'area');
		}

		const isEmpty = model.count === 0;
		this.dom.classList.toggle('ln-chart--empty', isEmpty);
		if (this.empty) this.empty.toggleAttribute('hidden', !isEmpty);

		const locale = getLocale(this.dom);
		setText(this.minimum, formatNumber(model.min, locale));
		setText(this.maximum, formatNumber(model.max, locale));
		setText(this.count, formatNumber(model.count, locale));
		this._renderLabels(model);

		dispatch(this.dom, 'ln-chart:rendered', {
			chart: this.name,
			count: model.count,
			min: model.min,
			max: model.max
		});
	};

	_component.prototype.requestData = function () {
		this.source = this.dom.getAttribute('data-ln-chart-source') || this.name;
		dispatch(this.dom, 'ln-chart:request-data', {
			chart: this.name,
			source: this.source,
			sort: parseChartSort(this.dom.getAttribute('data-ln-chart-sort')),
			filters: {},
			search: ''
		});
	};

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		this.dom.removeEventListener('ln-chart:set-data', this._onSetData);
		this.dom.removeEventListener('ln-chart:set-loading', this._onSetLoading);
		this.dom.removeEventListener('ln-chart:request-refresh', this._onRefresh);
		this._data = [];
		this.model = null;
		delete this.dom[DOM_ATTRIBUTE];
	};

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-chart', {
		attributes: ATTRIBUTES
	});
})();
