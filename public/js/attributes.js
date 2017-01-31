/**
 * Remove an option when clicking the delete button.
 */
function deleteOption(id) {
	jQuery(`[data-option="${id}"]`).remove();
};

jQuery(document).ready(($) => {
	/**
	 * Hide or show the options tab on input type change
	 * and enable/disable fields accordingly.
	 */
	$('#inputType').on('change', e => {
		let val = $('#inputType').val();
		if (val === 'select' || val === 'multiselect') {
			$('#options-tab').show();
			$('#isFilter, #isSuper').removeAttr('disabled');
		} else {
			$('#options-tab').hide();
			$('#isFilter, #isSuper').val('false').prop('disabled', 'disabled');
		}
	});

	/**
	 * Add an option when clicking on the new button.
	 */
	$('button[data-action="new-option"]').on('click', e => {
		var id = new Date().getTime(),
			html = `<div class="row" data-option="${id}">
			<div class="col-sm-8 col-sm-offset-2">
				<input type="text" name="options[]" class="form-control" required="required">
			</div>
			<div class="col-sm-2">
				<button type="button" class="btn btn-danger" onclick="deleteOption(${id})">
					<i class="fa fa-remove" />
				</button>
			</div>
		</div>`;
		$('#option-fields').append(html);
		return false;
	});

	/**
	 * Validate options on form submit.
	 */
	$('form').on('submit', e => {
		let type = $('#inputType').val();
		if ((type === 'select' || type === 'multiselect') &&
			!$('input[name="options[]"]').length) {
			alert('Please specify options for attributes of type select or multiselect.');
			return false;
		}
		return true;
	});
});