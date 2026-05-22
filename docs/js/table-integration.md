# Table & Data-Table Integration Patterns

This document is a comprehensive, production-ready guide to implementing tables in `ln-ashlar`. It provides full copy-pasteable HTML templates and JavaScript coordinator patterns for both types of table components:
1. **`ln-table` (Client-Side / In-Memory)**: Best for small to medium datasets (up to ~200 rows) already present on the page or loaded at once.
2. **`ln-data-table` (Server-Side / AJAX / Virtual Scroll)**: Best for large datasets (hundreds to tens of thousands of rows) requiring server-side pagination, remote filtering/sorting, or virtual scrolling.

---

## 1. `ln-table` (Client-Side / In-Memory)

The `ln-table` component works with standard HTML tables. Filters, sorting, and global search are fully declarative and happen in-memory inside the client's browser.

### HTML Blueprint
```html
<!-- Table Wrapper -->
<div data-ln-table id="employee-table">
    <!-- Search Bar -->
    <header class="toolbar">
        <form role="search" onsubmit="return false;">
            <label data-ln-search="employee-table">
                <svg class="ln-icon ln-icon--sm" aria-hidden="true"><use href="#ln-search"></use></svg>
                <input type="search" placeholder="Search employees...">
                <button type="button" data-ln-search-clear aria-label="Clear search">
                    <svg class="ln-icon ln-icon--sm" aria-hidden="true"><use href="#ln-x"></use></svg>
                </button>
            </label>
        </form>
    </header>

    <table>
        <thead>
            <tr>
                <!-- Column Sortable -->
                <th data-ln-sort="string">
                    Name
                    <svg class="ln-icon" data-ln-sort-icon aria-hidden="true"><use href="#ln-arrows-sort"></use></svg>
                    <svg class="ln-icon hidden" data-ln-sort-icon="asc" aria-hidden="true"><use href="#ln-arrow-up"></use></svg>
                    <svg class="ln-icon hidden" data-ln-sort-icon="desc" aria-hidden="true"><use href="#ln-arrow-down"></use></svg>
                </th>
                <!-- Column Filterable (Popover Pattern) -->
                <th data-ln-sort="string" data-ln-filter-col="dept">
                    Department
                    <button class="filter-btn" type="button" data-ln-popover-for="filter-dept">
                        <svg class="ln-icon ln-icon--sm" aria-hidden="true"><use href="#ln-filter"></use></svg>
                    </button>
                    <!-- Sort Icons -->
                    <svg class="ln-icon" data-ln-sort-icon aria-hidden="true"><use href="#ln-arrows-sort"></use></svg>
                    <svg class="ln-icon hidden" data-ln-sort-icon="asc" aria-hidden="true"><use href="#ln-arrow-up"></use></svg>
                    <svg class="ln-icon hidden" data-ln-sort-icon="desc" aria-hidden="true"><use href="#ln-arrow-down"></use></svg>
                </th>
                <!-- Column Filterable (Dropdown Pattern) -->
                <th data-ln-sort="string" data-ln-filter-col="status">
                    Status
                    <div data-ln-dropdown>
                        <button class="filter-btn" type="button" data-ln-toggle-for="filter-status">
                            <svg class="ln-icon ln-icon--sm" aria-hidden="true"><use href="#ln-filter"></use></svg>
                        </button>
                        <ul id="filter-status" data-ln-toggle>
                            <li>
                                <nav data-ln-filter="employee-table">
                                    <label><input type="checkbox" data-ln-filter-key="status" data-ln-filter-reset checked> All</label>
                                    <label><input type="checkbox" data-ln-filter-key="status" data-ln-filter-value="Active"> Active</label>
                                    <label><input type="checkbox" data-ln-filter-key="status" data-ln-filter-value="Inactive"> Inactive</label>
                                </nav>
                            </li>
                        </ul>
                    </div>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td data-label="Name">Ana Petrova</td>
                <td data-label="Department">Engineering</td>
                <td data-label="Status"><span class="badge badge-success">Active</span></td>
            </tr>
            <tr>
                <td data-label="Name">Marko Nikolov</td>
                <td data-label="Department">Design</td>
                <td data-label="Status"><span class="badge badge-error">Inactive</span></td>
            </tr>
        </tbody>
    </table>

    <!-- Empty State Template -->
    <template data-ln-table-empty>
        <article class="ln-table__empty-state">
            <svg class="ln-icon ln-icon--xl" aria-hidden="true"><use href="#ln-filter"></use></svg>
            <h3>No results found</h3>
            <p>Try a different search term or adjust your filters.</p>
            <button type="button" data-ln-table-clear>Clear all</button>
        </article>
    </template>
</div>

<!-- Department Popover (Teleported on open) -->
<div data-ln-popover id="filter-dept">
    <nav data-ln-filter="employee-table">
        <label><input type="checkbox" data-ln-filter-key="dept" data-ln-filter-reset checked> All</label>
        <label><input type="checkbox" data-ln-filter-key="dept" data-ln-filter-value="Design"> Design</label>
        <label><input type="checkbox" data-ln-filter-key="dept" data-ln-filter-value="Engineering"> Engineering</label>
    </nav>
</div>
```

---

## 2. `ln-data-table` (Server-Side / AJAX / Virtual Scroll)

`ln-data-table` is a rendering engine that operates entirely via custom events. It clones row and filter templates and leverages your small, dedicated page coordinator to fetch, sort, filter, and search.

### HTML Blueprint
```html
<section data-ln-data-table="products" data-ln-data-table-selectable id="products-table">
    <header class="toolbar">
        <h3>Products</h3>
        <form role="search" onsubmit="return false;">
            <label>
                <svg class="ln-icon ln-icon--sm" aria-hidden="true"><use href="#ln-search"></use></svg>
                <input type="search" placeholder="Search..." data-ln-data-table-search>
            </label>
        </form>
    </header>

    <table>
        <thead>
            <tr>
                <th data-ln-col-select></th>
                <th data-ln-col="name">
                    Product Name
                    <button data-ln-col-sort aria-label="Sort">
                        <svg class="ln-icon" aria-hidden="true" data-ln-sort-icon="none"><use href="#ln-arrows-sort"></use></svg>
                        <svg class="ln-icon" aria-hidden="true" data-ln-sort-icon="asc"><use href="#ln-arrow-up"></use></svg>
                        <svg class="ln-icon" aria-hidden="true" data-ln-sort-icon="desc"><use href="#ln-arrow-down"></use></svg>
                    </button>
                </th>
                <th data-ln-col="category">
                    Category
                    <button data-ln-col-filter aria-label="Filter">
                        <svg class="ln-icon" aria-hidden="true"><use href="#ln-filter"></use></svg>
                    </button>
                </th>
            </tr>
        </thead>
        <tbody data-ln-data-table-body></tbody>
    </table>

    <footer>
        <span data-ln-data-table-total></span> products
        <span data-ln-data-table-filtered-wrap> · <span data-ln-data-table-filtered></span> filtered</span>
        <span data-ln-data-table-selected-wrap> · <span data-ln-data-table-selected></span> selected</span>
    </footer>

    <!-- 1. Row Template -->
    <template data-ln-template="products-row">
        <tr data-ln-row>
            <td><input type="checkbox" data-ln-row-select></td>
            <td>{{ name }}</td>
            <td>{{ category }}</td>
        </tr>
    </template>

    <!-- 2. Empty States -->
    <template data-ln-template="products-empty">
        <tr><td colspan="99"><article class="ln-table__empty-state">No products found.</article></td></tr>
    </template>
    <template data-ln-template="products-empty-filtered">
        <tr>
            <td colspan="99">
                <article class="ln-table__empty-state">
                    <h3>No matches for selected filters</h3>
                    <button data-ln-data-table-clear-all class="btn">Clear all filters</button>
                </article>
            </td>
        </tr>
    </template>

    <!-- 3. Dynamic Column Filter Template (using nested templates) -->
    <template data-ln-template="column-filter">
        <div class="column-filter-dropdown">
            <input type="search" data-ln-filter-search placeholder="Search categories...">
            <ul data-ln-filter-options>
                <li>
                    <label>
                        <input type="checkbox" data-ln-filter-reset>
                        All Categories
                    </label>
                </li>
                <template data-ln-template="column-filter-item">
                    <li>
                        <label>
                            <input type="checkbox" data-ln-attr="value:value">
                            <span data-ln-field="value"></span>
                        </label>
                    </li>
                </template>
            </ul>
            <button data-ln-filter-clear>Clear Filter</button>
        </div>
    </template>
</section>
```

### JS Coordinator Pattern: AJAX Server-Side (REST API)
Use this coordinator template to connect the table component directly to your database backends (Laravel, Node, Go, PHP etc.) via REST endpoints.
```javascript
(function () {
    const tableEl = document.getElementById('products-table');
    if (!tableEl) return;

    tableEl.addEventListener('ln-data-table:request-data', function (e) {
        if (e.detail.table !== 'products') return;

        // 1. Show dynamic loader overlay
        tableEl.dispatchEvent(new CustomEvent('ln-data-table:set-loading', {
            detail: { loading: true }
        }));

        // 2. Map event query states to URLSearchParams
        const params = new URLSearchParams();
        
        // Search query
        if (e.detail.search) {
            params.append('search', e.detail.search);
        }
        
        // Sort direction and column field
        if (e.detail.sort) {
            params.append('sort_field', e.detail.sort.field);
            params.append('sort_dir', e.detail.sort.direction); // 'asc' or 'desc'
        }

        // Active filters map: { category: ['Electronics', 'Home'] }
        if (e.detail.filters) {
            Object.keys(e.detail.filters).forEach(field => {
                const values = e.detail.filters[field];
                values.forEach(val => params.append(`filter_${field}[]`, val));
            });
        }

        // 3. Make the REST fetch call
        fetch('/api/products?' + params.toString(), {
            headers: { 'Accept': 'application/json' }
        })
        .then(response => response.json())
        .then(res => {
            // 4. Return the data payload and automatically clear loading overlay
            tableEl.dispatchEvent(new CustomEvent('ln-data-table:set-data', {
                detail: {
                    data: res.data,           // Array of data records
                    total: res.total,         // Unfiltered database records count
                    filtered: res.filtered,   // Filtered database records count
                    filterOptions: res.options  // Optional: dynamic filter list values
                }
            }));
        })
        .catch(err => {
            console.error('Failed to load table records:', err);
            // In case of error, dismiss loader
            tableEl.dispatchEvent(new CustomEvent('ln-data-table:set-loading', {
                detail: { loading: false }
            }));
        });
    });
})();
```

### JS Coordinator Pattern: In-Memory Client-Side
Use this coordinator template to manage client-side array sorting, filtering, and searching seamlessly when data is already fully loaded in memory.
```javascript
(function () {
    const tableEl = document.getElementById('products-table');
    const ALL_ITEMS = window.__INITIAL_DATA__ || []; // Static preloaded list
    if (!tableEl) return;

    tableEl.addEventListener('ln-data-table:request-data', function (e) {
        if (e.detail.table !== 'products') return;

        let result = ALL_ITEMS.slice();

        // 1. Process Global Text Search
        if (e.detail.search) {
            const query = e.detail.search.toLowerCase();
            result = result.filter(item => 
                (item.name || '').toLowerCase().includes(query) || 
                (item.category || '').toLowerCase().includes(query)
            );
        }

        // 2. Process Multi-Column Filters (AND across columns, OR within same column values)
        if (e.detail.filters && Object.keys(e.detail.filters).length > 0) {
            const activeFilterFields = Object.keys(e.detail.filters);
            result = result.filter(item => {
                return activeFilterFields.every(field => {
                    const values = e.detail.filters[field];
                    if (values.length === 0) return true;
                    const itemVal = (item[field] || '').toString().toLowerCase();
                    return values.some(v => v.toLowerCase() === itemVal);
                });
            });
        }

        // 3. Process Dynamic Sorting
        if (e.detail.sort) {
            const field = e.detail.sort.field;
            const multiplier = e.detail.sort.direction === 'desc' ? -1 : 1;
            result.sort((a, b) => {
                const valA = a[field] || '';
                const valB = b[field] || '';
                if (typeof valA === 'number' && typeof valB === 'number') {
                    return (valA - valB) * multiplier;
                }
                return valA.toString().localeCompare(valB.toString()) * multiplier;
            });
        }

        // 4. Return data back to component to trigger rendering
        tableEl.dispatchEvent(new CustomEvent('ln-data-table:set-data', {
            detail: {
                data: result,
                total: ALL_ITEMS.length,
                filtered: result.length
            }
        }));
    });
})();
```

---

## 3. Mutual Exclusion Design Doctrine (Filter Sentinel Pattern)

Both client-side `ln-table` and server-side `ln-data-table` strictly share the unified **Filter Sentinel Pattern** for checkbox selection. 

### How Sentinel Checkboxes Behave
1. **"All" Sentinel Checkbox**: Handled statically by designating an input element with the `data-ln-filter-reset` attribute.
2. **Mutual Exclusion Lifecycle**:
   - Checking the "All" sentinel automatically deselects all specific value checkboxes.
   - Checking any individual specific value checkbox automatically deselects the "All" sentinel.
   - Deselecting a specific value checkbox automatically re-checks the "All" sentinel if no other checkboxes are selected.
   - Restoring a default reset state completely clears active filters, making data requests simple and clean.
