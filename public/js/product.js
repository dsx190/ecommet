function deleteChild(i) {
	jQuery(`.row.well[data-child="${i}"]`).remove();
}

jQuery(document).ready($ => {
	/**
	 * Add a child to a super product when clicking on the new child button.
	 */
	$('button[data-action="new-child"]').on('click', e => {
		var selectedSuperCode = $('#superAttribute').val(),
			html = `<div class="row well" data-child="${i}">
			<div class="col-sm-2">
				<button type="button" class="btn btn-danger" onclick="deleteChild(${i})">
					<i class="fa fa-times" />
				</button>
			</div>
			<div class="col-sm-5">
				<select class="form-control" name="children[${i}][super]" required>`;
		superAttributes[selectedSuperCode].options.forEach(opt => {
			html += `<option value="${opt}">${opt}</option>`;
		});
		html += `</select>
			</div>
			<div class="col-sm-5">
				<input type="text" class="form-control" name="children[${i}][stock]" required placeholder="Stock">
			</div></div>`;
		i++;
		$('.child-fields').append(html);
	});
});