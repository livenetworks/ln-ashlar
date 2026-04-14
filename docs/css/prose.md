# Prose

File: `scss/config/mixins/_prose.scss` + `scss/components/_prose.scss`.

Semantic rich-text styling for content that comes from rich editors
(TipTap, CKEditor, Markdown renderers) or long-form article content.

## Structure

```html
<article data-ln-prose>
	<!-- arbitrary semantic HTML -->
	<h2>Introduction</h2>
	<p>Lorem ipsum...</p>
	<ul>
		<li>Point one</li>
	</ul>
</article>
```

## What it styles

- Headings (`h1`–`h4`) with role tokens + spacing
- Paragraphs (`body-md`)
- Links (primary colour, underline)
- Lists (`ul`, `ol`) with proper nesting
- Blockquotes (primary left border)
- Inline code + code blocks (mono, bg-secondary)
- Images (max-width 100%)
- Figures with captions
- Tables (unstyled wrapper — use `@include table-base` for full
  styling)
- Horizontal rules

## Max width

`max-width: 65ch` (via `--max-w-prose`). Optimized for reading.
Override per-consumer if needed.

## Project selectors

```scss
#document-viewer { @include prose; }
#help-article    { @include prose; }
```

## TipTap output

TipTap outputs this subset of semantic HTML by default. `@include
prose` is the recommended wrapper styling for any TipTap-rendered
content.
