$newNav = @"
				<nav class="nav" data-ln-nav="active">
					<ul>
						<li><a href="index.html"><span class="nav-icon ln-icon-home"></span><span class="nav-label">Dashboard</span></a></li>
					</ul>

					<h6 class="nav-section">CSS Components</h6>
					<ul>
						<li><a href="typography.html"><span class="nav-label">Typography</span></a></li>
						<li><a href="cards.html"><span class="nav-label">Cards</span></a></li>
						<li><a href="tables.html"><span class="nav-label">Tables</span></a></li>
						<li><a href="forms.html"><span class="nav-label">Forms &amp; Buttons</span></a></li>
						<li><a href="layout.html"><span class="nav-label">Layout &amp; Grid</span></a></li>
						<li><a href="sections.html"><span class="nav-label">Sections</span></a></li>
						<li><a href="icons.html"><span class="nav-label">Icons</span></a></li>
						<li><a href="utilities.html"><span class="nav-label">Utilities</span></a></li>
					</ul>

					<h6 class="nav-section">JS Components</h6>
					<ul>
						<li><a href="accordion.html"><span class="nav-label">Accordion</span></a></li>
						<li><a href="ajax.html"><span class="nav-label">AJAX</span></a></li>
						<li><a href="confirm.html"><span class="nav-label">Confirm</span></a></li>
						<li><a href="datatable.html"><span class="nav-label">Data Table</span></a></li>
						<li><a href="dropdown.html"><span class="nav-label">Dropdown</span></a></li>
						<li><a href="external-links.html"><span class="nav-label">External Links</span></a></li>
						<li><a href="filter.html"><span class="nav-label">Filter</span></a></li>
						<li><a href="link.html"><span class="nav-label">Link</span></a></li>
						<li><a href="nav.html"><span class="nav-label">Nav</span></a></li>
						<li><a href="progress.html"><span class="nav-label">Progress</span></a></li>
						<li><a href="circular-progress.html"><span class="nav-label">Circular Progress</span></a></li>
						<li><a href="select.html"><span class="nav-label">Select</span></a></li>
						<li><a href="sortable.html"><span class="nav-label">Sortable</span></a></li>
						<li><a href="toggle.html"><span class="nav-label">Toggle</span></a></li>
						<li><a href="translations.html"><span class="nav-label">Translations</span></a></li>
						<li><a href="modal.html"><span class="nav-label">Modal</span></a></li>
						<li><a href="toast.html"><span class="nav-label">Toast</span></a></li>
						<li><a href="tabs.html"><span class="nav-label">Tabs</span></a></li>
						<li><a href="upload.html"><span class="nav-label">Upload</span></a></li>
					</ul>
				</nav>
"@

$files = Get-ChildItem "c:\laragon\www\ln-acme\demo\admin\*.html"
foreach ($file in $files) {
    if ($file.Name -eq "confirm.html") { continue }
    $content = [System.IO.File]::ReadAllText($file.FullName)
    $newContent = $content -replace '(?s)<nav class="nav" data-ln-nav="active">.*?</nav>', $newNav
    [System.IO.File]::WriteAllText($file.FullName, $newContent)
}
