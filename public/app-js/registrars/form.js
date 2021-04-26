$(document).ready(() => {
	const form = $("#registrar-form");

	form.on("submit", async (e) => {
		e.preventDefault();

		const url = form.attr("action");
		const method = form.attr("method").toLowerCase();
		const button = form.find(`button[type=submit]`);

		button.attr("disabled", true);

		try {
			await axios[method](url, form.serialize());
			toastr.info("Registrar has been saved successfully.");
			form[0].reset();
		} catch (error) {
			handleError(error);
		} finally {
			button.attr("disabled", false);
		}
	});
});
