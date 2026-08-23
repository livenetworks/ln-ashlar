# ln-search

A zero-dependency, decoupled **Two-Host Debounced Search Primitive** built on the Attribute Bridge pattern.

It splits search into a **Control** (`data-ln-search-for="targetId"`) that manages user inputs, debounce timers, and clear triggers, and a **State Host** (`data-ln-search="term"`) on the target element (table, list, container) that observes its own attribute, coordinates two-way control sync, and dispatches cancelable change events.

---

## ✅ Canonical Markup — Copy This (REQUIRED)

**Hard rule — non-negotiable.** Every search or filter text input MUST use the full `.search` chrome below: the leading magnifier icon **and** the clear ("x") button.

```html
<label class="search">
	<svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-search"></use></svg>
	<input type="search" placeholder="Search …" data-ln-search-for="<targetId>">
	<button type="button" data-ln-search-clear aria-label="Clear search">
		<svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-x"></use></svg>
	</button>
</label>

<ul id="<targetId>" data-ln-search="">
	<li>Item Alpha</li>
	<li>Item Beta</li>
	<li data-ln-search-exclude>Pinned Item (Always Visible)</li>
</ul>
```

For deep targeting (e.g. table rows or checkbox lists) add `data-ln-search-items="<selector>"` on the **target element**:

```html
<table id="<targetId>" data-ln-search="" data-ln-search-items="tbody tr">
	...
</table>
```

---

## 🧭 Philosophy & Architecture

1. **Two-Host Separation (Attribute Bridge):**
   - **Control (`data-ln-search-for="targetId"`):** Forwards user input and writes the raw value to `target.setAttribute('data-ln-search', rawValue)`.
   - **State Host (`data-ln-search="term"`):** Uses `MutationObserver` (`_syncAttribute`) to detect attribute changes, syncs all matching controls, and dispatches `ln-search:change`.
2. **Tokenized AND Matching:** By default, splits search queries on whitespace and tests tokens with substring checks (`indexOf`). An item matches only if every token is present in its text.
3. **Exemptions & Subtree Exclusion (`data-ln-search-exclude`):**
   - **On item root:** The item is exempt from filtering — always visible, never given `data-ln-search-hide`.
   - **On descendant:** The subtree text is excluded from search matching.
4. **Cancelable Change Event:** Consumers (`ln-table`, `ln-list`, `ln-data-store`) call `e.preventDefault()` on `ln-search:change` to handle their own records and skip default DOM show/hide.
5. **Boot Seeding:** Pre-filled or deep-linked `data-ln-search` attributes seed safely using `queueBoot`.

---

## 🛠️ Declarative API Contract

### HTML Attributes

| Attribute | Element | Description |
| :--- | :--- | :--- |
| `data-ln-search-for="targetId"` | `<input>` / wrapper | Pointer to the target element ID. |
| `data-ln-search="term"` | Target element | Search term state. Single source of truth. |
| `data-ln-search-items="selector"` | Target element | Deep CSS selector (e.g. `tbody tr`) to query items instead of direct children. |
| `data-ln-search-fields="a,b"` | Target element | Comma-separated list of field keys forwarded in event detail. |
| `data-ln-search-exclude` | Item root or descendant | Excludes item from filtering (on root) or excludes subtree text (on descendant). |
| `data-ln-search-clear` | `<button>` | Identifies a clear button (in search control or target empty state). Clears input and resets target state. |
| `data-ln-search-clear-for="targetId"` | `<button>` | Remote clear button targeting a specific element ID anywhere on the page. |
| `data-ln-search-hide="true"` | Items in target | State attribute automatically set on non-matching elements (`display: none !important`). |
| `data-ln-hash` | Target / Control | Opt-in. Synchronizes search query to URL hash fragment (e.g. `#users-search:john`). Value is custom namespace; if empty defaults to `[targetId]-search`. |

### JavaScript API

| Instance | Property / Method | Description |
| :--- | :--- | :--- |
| `el.lnSearchControl` (Control) | `targetId`, `input`, `destroy()` | Control instance managing input. |
| `el.lnSearch` (State Host) | `term`, `nsKey`, `hashEnabled`, `_apply()`, `destroy()` | State instance owning term, URL hash sync, and DOM filter logic. |


---

## ⚡ DOM Events

### `ln-search:change`
Dispatched on the **target** element whenever the search term updates.
- **Cancelable**: Yes (`e.preventDefault()` disables default DOM show/hide).
- **Payload (`detail`)**:
  ```js
  {
    term: string,         // Trimmed and lowercased string
    tokens: string[],     // Array of whitespace-separated tokens
    targetId: string,     // ID of the target
    fields: string[]|null // Forwarded field names
  }
  ```

---

## 🌐 Backend Search Contract (Whitespace & Wildcard Handling)

To keep remote search consistent with client-side DOM and table filtering, backend APIs (e.g. `api.php`, SQL endpoints) must mirror the tokenized search contract:

1. **Whitespace Tokenization (`AND` Logic):** Split the query string on whitespace (`\s+`). Every token must be present in the record.
2. **Wildcard `*` Conversion:** Convert asterisks (`*`) into SQL `%` or Regex `.*`.
3. **Multi-Field Matching (`OR` per token):** Each token can match anywhere across the allowed searchable columns/fields.

```php
// Reference PHP / SQLite PDO implementation
$search = isset($_GET['search']) ? trim($_GET['search']) : (isset($_GET['q']) ? trim($_GET['q']) : '');
if ($search !== '') {
	$tokens = preg_split('/\s+/', $search, -1, PREG_SPLIT_NO_EMPTY);
	$searchFields = ['title', 'department', 'owner', 'tags'];

	foreach ($tokens as $token) {
		$tokenPattern = '%' . str_replace('*', '%', $token) . '%';
		$tokenPattern = preg_replace('/%+/', '%', $tokenPattern);

		$fieldClauses = [];
		foreach ($searchFields as $field) {
			$fieldClauses[] = "$field LIKE ?";
			$params[] = $tokenPattern;
		}
		$where[] = '(' . implode(' OR ', $fieldClauses) . ')';
	}
}
```

---

## ⚠️ Common Pitfalls

- **Using `data-ln-search="tableId"` on inputs:** `data-ln-search` is the target state attribute. Inputs must use `data-ln-search-for="tableId"`.
- **Programmatic Value Mutations:** Assigning `input.value = "text"` programmatically does not trigger native `input` events. Either dispatch a native `input` event on the control or set the attribute directly on the target:
  ```js
  document.getElementById('my-table').setAttribute('data-ln-search', 'query');
  ```
