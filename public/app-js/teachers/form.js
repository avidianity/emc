$(document).ready(() => {
	const form = $("#teacher-form");

	form.on("submit", async (e) => {
		e.preventDefault();

		const url = form.attr("action");
		const method = form.attr("method").toLowerCase();
		const button = form.find(`button[type=submit]`);

		button.attr("disabled", true);

		try {
			await axios[method](url, form.serialize());
			toastr.info("Teacher has been saved successfully.");
		} catch (error) {
			handleError(error);
		} finally {
			button.attr("disabled", false);
		}
	});
});
