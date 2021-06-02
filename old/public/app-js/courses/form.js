$(document).ready(() => {
	const form = $("#course-form");

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
			toastr.info("Course has been saved successfully.");
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
});
