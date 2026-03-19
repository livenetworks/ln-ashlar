// Auto-populate code blocks from live demo HTML
document.querySelectorAll('.demo-split').forEach(function(split) {
	var src = split.querySelector('article');
	var code = split.querySelector('figure code');
	if (src && code) code.textContent = src.innerHTML.trim();
});
