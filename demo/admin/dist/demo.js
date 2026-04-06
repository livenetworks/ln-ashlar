// Auto-populate code blocks from live demo HTML
document.querySelectorAll('.demo-split').forEach(function(split) {
	const src = split.querySelector('article');
	const code = split.querySelector('figure code');
	if (src && code) code.textContent = src.innerHTML.trim();
});
