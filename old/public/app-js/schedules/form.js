$(document).ready(() => {
	const form = $("#schedule-form");

	form.on("submit", async (e) => {
		e.preventDefault();

		await save();
	});

	const save = async () => {
		const url = form.attr("action");
		const method = form.attr("method");
		const button = form.find(`button[type=submit]`);

		button.attr("disabled", true);

		try {
			const data = new FormData(form[0]);
			data.append("_method", method);
			await axios.post(url, data);
			toastr.info("Schedule has been saved successfully.");
			form[0].reset();
		} catch (error) {
			if (error.response?.status === 409) {
				if (
					await swal({
						text:
							"There is duplicate data. Do you want to continue?",
						icon: "warning",
						buttons: ["Cancel", "Confirm"],
						dangerMode: true,
					})
				) {
					await save();
				}
			} else {
				handleError(error);
			}
		} finally {
			button.attr("disabled", false);
		}
	};

	const table = $("#schedules-table");

	$("#schedule-add-row").on("click", (e) => {
		e.preventDefault();

		const index = table.find("tbody").find("tr").length;
		table.find("tbody").append(
			$(`
			<tr>
				<td>
					<input type='text' name='payload[${index}][time]' class='form-control' />
				</td>
				<td>
					<input type='text' name='payload[${index}][monday]' class='form-control' />
				</td>
				<td>
					<input type='text' name='payload[${index}][tuesday]' class='form-control' />
				</td>
				<td>
					<input type='text' name='payload[${index}][wednesday]' class='form-control' />
				</td>
				<td>
					<input type='text' name='payload[${index}][thursday]' class='form-control' />
				</td>
				<td>
					<button class='btn btn-danger btn-sm btn-row-remove'>Remove</button>
				</td>
			</tr>
		`)
		);
	});

	table.on("click", ".btn-row-remove", function (e) {
		e.preventDefault();

		$(this).parent().parent().remove();
	});
});
