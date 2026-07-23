---
name: forms
classification: skill
status: draft
domain: frontend
summary: Form composition — field anatomy, the selection-control ladder (pills vs popover vs search), validation/fill wiring, submit behavior, and multi-step rules.
tags: [skill, form, selection-controls, validation, ln-specific]
---

# Forms

A form is a form — no scoped/unscoped variants, no per-method conditionals. Division of labor: `ln-validate` owns ALL validation (gate + `novalidate`, every method); `ln-form` owns fill and action; the write pipeline (coordinator claim) owns transport. The form's `action` URL is the single truth for the mutation target. Contracts: `../../components/ln-validate.md`, `../../components/ln-form.md`, `../../guides/write-workflow.md`.

---

## Field anatomy

- `.form-element` structural wrapper around explicit `<label for>` + `<input id>` — never the wrapping-label pattern (except option labels in selection lists).
- Reserved error space below each field (`<ul class="validation-errors">`); layout must not jump when errors appear.
- `required` attribute only — the `*` indicator is CSS-driven.
- `.form-actions` wraps submit/cancel; cancel is `type="button"` and navigates back without confirmation.
- Column spans communicate expected input width, defined in project SCSS grid (`../../doctrine/scss-architecture.md`) — never width classes.

## Selection controls — enumerated choice

No custom select component exists, by design. Enum fields compose native inputs + `ln-popover` + `ln-search`; the value travels natively via `name`.

### The ladder — domain option count picks the control

| Options | Control |
|---|---|
| ≤ 5 | inline pill group |
| 6 – 10 | popover select, no search |
| ≥ 11 | popover select + `ln-search` |

Count the **domain enum**, never the rows currently in the data.

### Semantics

- Single-value → `type="radio"`, shared `name`; multi-value → `type="checkbox"`, `name="field[]"`.
- Option icons authored inline in the option `<label>`.
- Options come from the domain source (enum), never derived from displayed data.

### Closed-state display

- **Single**: placeholder until a value exists, then the selected option's label (+ its icon).
- **Multi**: selected values render as pills on the control surface, each with a ✕ remove button; the surface wraps as selection grows. Remove buttons and the popover trigger are separate interactive elements — never nested inside one `<button>`.

### Composition skeleton (popover tier)

```html
<fieldset>
	<legend>Department</legend>
	<button type="button" data-ln-popover-for="dept-select">Choose department…</button>
	<div data-ln-popover id="dept-select">
		<!-- ≥11 options: label.search + input data-ln-search="dept-list" data-ln-search-items="li" -->
		<ul id="dept-list">
			<li><label><input type="radio" name="department" value="engineering"> Engineering</label></li>
		</ul>
	</div>
</fieldset>
```

Pill styling via `check-list` mixins; inline-tier markup is the same `fieldset > ul/li` without the popover.

### Scope boundaries

- **Record-backed** pickers (foreign keys from a data store) → native `<select>` + `ln-options`.
- **Filter context** (list/table filtering) shares the popover anatomy but belongs to `ln-filter`: `data-ln-filter-key/value` instead of `name`, an "All" reset sentinel, selection announced via events. See `./data-views.md`.

## Validation behavior

- Validate on keyup from the first keystroke; errors clear instantly when fixed.
- Submit button stays ACTIVE — never disabled-until-valid; clicking it surfaces inline errors.
- Server validation errors map back to fields inline; form data survives errors — never clear on failure.
- Loading state on submit (button-scoped); re-submit is always possible after a server error.

## Multi-step

Only for 3+ distinct phases, dependent steps, or commit-preview needs. Under 10 fields → single form with sections. Rules: visible step progress, back without data loss, per-step validation, review step, single final submit.

## Anti-patterns

Disabled submit buttons; validation only on blur; manual `*`; width classes; wrapping labels for regular fields; clearing data on error; multi-step for simple forms; success message left sitting on the form page (navigate or toast — see `./ux-flows.md`).
</content>
