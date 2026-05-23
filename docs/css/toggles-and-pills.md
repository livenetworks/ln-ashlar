# Pills & Switches

File: `scss/config/mixins/_form.scss` + `scss/components/_form.scss`

`ln-ashlar` offers three distinct visual treatments for native checkboxes (`<input type="checkbox">`) and radio buttons (`<input type="radio">`):
1. **Filled Pills**: Gray-background, horizontal joined button segmented control.
2. **Outline Pills**: Transparent-background, horizontal joined outline control showing checkboxes/radio buttons inside a clean border.
3. **Switch Pills**: iOS-style sliding switches for immediate on/off preferences.

All three variants share the **exact same** clean, symmetric HTML markup structure. The visual presentation is driven entirely by the class applied to the outer `<ul>` element.

---

## The Symmetric HTML Structure

To keep the markup extremely clean and maintainable, there are no nested `id` / `for` attributes inside the list, no wrapper `div`s, and no classes on the inputs or labels:

```html
<ul class="[pills|pills-outline|pills-switch]">
	<li>
		<label>
			<input type="[checkbox|radio]" name="..." value="..." [checked]>
			Label Text
		</label>
	</li>
</ul>
```

---

## 1. Filled Pills (Joined Group)

Used for grouped checkbox/radio selection blocks (like horizontal tabs or filters). Corner radiuses are automatically adjusted for a cohesive, joined horizontal block.

### HTML Structure
```html
<ul class="pills">
	<li>
		<label>
			<input type="radio" name="role" value="admin" checked>
			Admin
		</label>
	</li>
	<li>
		<label>
			<input type="radio" name="role" value="employee">
			Employee
		</label>
	</li>
</ul>
```

### SCSS Mixin
```scss
.my-pills {
	@include pills;
}
```

---

## 2. Outline Pills

Used for grouped horizontal outline segmented controls or as standalone option choices. Keeps the default browser checkbox/radio indicator visible inside the bordered label pill.

### Grouped HTML Structure (Joined Control)
```html
<ul class="pills-outline">
	<li>
		<label>
			<input type="checkbox" name="options[]" value="notify" checked>
			Notifications
		</label>
	</li>
	<li>
		<label>
			<input type="checkbox" name="options[]" value="2fa">
			Two-factor Auth
		</label>
	</li>
</ul>
```

### Standalone Option HTML Structure
```html
<label class="pill-outline">
	<input type="checkbox" name="advanced" checked>
	Advanced Options
</label>
```

### SCSS Mixins
```scss
// For joined group
.my-outline-group {
	@include pills-outline;
}

// For standalone option
.my-standalone {
	@include pill-outline;
}
```

---

## 3. Switch Pills (iOS Toggle Switches)

Used for immediate on/off preferences. When grouped within a `<ul>` stack, it automatically lays out as a vertical stack of sliding switches.

### Grouped HTML Structure (Settings Stack)
```html
<ul class="pills-switch">
	<li>
		<label>
			<input type="checkbox" name="settings-email" checked>
			Email notifications
		</label>
	</li>
	<li>
		<label>
			<input type="checkbox" name="settings-sms">
			SMS alerts
		</label>
	</li>
</ul>
```

### Standalone Switch HTML Structure
```html
<label class="pill-switch">
	<input type="checkbox" name="advanced-mode">
	Enable advanced options
</label>
```

### SCSS Mixins
```scss
// For vertical settings stack
.my-settings-stack {
	@include pills-switch;
}

// For standalone toggle switch
.my-standalone-switch {
	@include pill-switch;
}
```

---

## Separation of Concerns & Class-Based Styling

> [!WARNING]
> Do NOT use custom `data-` attributes (e.g., `data-demo-settings-form`) for layouts or styles. Custom data attributes are reserved **exclusively** for JavaScript component bindings. All layout, spacing, and styling should be implemented using semantic classes and applied via SCSS mixins at the stylesheet layer.
> 
> Furthermore, styling is driven entirely via the class names (`.pills`, `.pills-outline`, `.pills-switch`) on the container `<ul>` element. Do not use `<fieldset>` dependency selectors to style lists as pills.
