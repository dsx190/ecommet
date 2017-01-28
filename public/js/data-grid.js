jQuery(document).ready(() => {
	var url = baseUrl,
		sorted, sortBy, sortDir,
		appendSorts = (by, dir) => { // Shortcut
			url += `&sortBy=${by}&sortDir=${dir}`;
		},
		/**
		 * Retrieve page, filter and sort data and redirect the user.
		 */
		search = () => {
			// Page number
			page = parseInt(page) || 1;
			url += `?p=${page}`;
			
			// Search filters
			jQuery('table thead th input, table thead th select').each((index, el) => {
				el = jQuery(el);
				if (el.val()) {
					url += `&${el.data('filter')}=${el.val()}`;
				}
			});

			// Sort data
			if (sorted && sortDir) {
				appendSorts(sortBy, sortDir);
			} else if (!sorted) {
				jQuery('table thead th').each((index, el) => {
					el = jQuery(el);
					if (el.data('sort-dir')) {
						appendSorts(el.data('sort-by'), el.data('sort-dir'));
					}
				});
			}
			window.location.href = url;
		};
	/**
	 * Update sort data and call search when clicking on a table header.
	 */
	jQuery('table thead th').on('click', e => {
		// Exit when clicking on input or select.
		if (e.target.tagName === 'LABEL') {
			let el = jQuery(e.currentTarget),
				prevDir = el.data('sort-dir');
			sortBy = el.data('sort-by');
			if (prevDir && prevDir == 1) {
				sortDir = -1;
			} else if (!prevDir) {
				sortDir = 1;
			} // If prevDir was -1, sortDir will remain undefined.
			sorted = true;
			search();
		}
	});
	/**
	 * Execute search when changing select values,
	 * clicking the search button or pressing enter on input fields.
	 */
	jQuery('table thead th select').on('change', search);
	jQuery('button[data-action="search"]').on('click',search);
	jQuery('table thead th input').on('keypress', e => {
		if (e.keyCode == 13) search();
	});
	/**
	 * Reset filters when clicking on the reset button.
	 */
	jQuery('button[data-action="reset"]').on('click', () => {
		window.location.href = url;
	});
	/**
	 * Change the page number when clicking on the page controls or 
	 * pressing enter on the text input.
	 */
	jQuery('button[data-action="page"').on('click', e => {
		page = jQuery(e.currentTarget).data('next')? page + 1 : page - 1;
		search();
	});
	jQuery('input[data-action="page"]').on('keypress', e => {
		if (e.keyCode === 13) {
			page = jQuery(e.currentTarget).val();
			search();
		}
	});
	/**
	 * Go to the edit URL when clicking on a row on the grid.
	 */
	jQuery('table tbody tr[data-action="edit"]').on('click', e => {
		url = jQuery(e.currentTarget).data('url');
		window.location.href = url;
	});
});