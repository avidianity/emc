$(document).ready(() => {
	const form = $("#profile-form");

	form.on("submit", async (e) => {
		e.preventDefault();

		const data = form.serialize();
		const url = form.attr("action");
		const method = form.attr("method").toLowerCase();

		const button = form.find("button[type=submit]");

		button.attr("disabled", true);
		button.text("Saving");

		try {
			await axios[method](url, data);
			toastr.info("Profile updated successfully.");
		} catch (error) {
			handleError(error);
		} finally {
			button.attr("disabled", false);
			button.text("Save");
		}
	});
});
