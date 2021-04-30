$(document).ready(() => {
	const form = $("#change-password-form");

	form.on("submit", async (e) => {
		e.preventDefault();

		const url = form.attr("action");
		const method = form.attr("method").toLowerCase();
		const button = form.find(`button[type=submit]`);

		button.attr("disabled", true);

		try {
			await axios[method](url, form.serialize());
			toastr.info("Password has been changed successfully.");
		} catch (error) {
			handleError(error);
		} finally {
			button.attr("disabled", false);
		}
	});
});
