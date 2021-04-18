$(document).ready(() => {
	const form = $("#login-form");

	form.on("submit", async (event) => {
		event.preventDefault();

		const url = form.attr("action");
		const button = form.find(`button[type=submit]`);

		button.attr("disabled", true);

		try {
			const {
				data: { user },
			} = await axios.post(url, form.serialize());
			toastr.success(
				`Welcome back, ${user.first_name} ${user.last_name}!`
			);
			window.location.href = "/dashboard";
		} catch (error) {
			handleError(error);
		} finally {
			button.attr("disabled", false);
		}
	});
});
