$(document).ready(() => {
	const form = $("#increment-form");

	form.on("submit", async (e) => {
		e.preventDefault();

		const confirm = await swal({
			text:
				"Are you sure you want to increment? Your account will be deactivated to be confirmed by the registrar.",
			icon: "warning",
			buttons: ["Cancel", "Confirm"],
		});

		if (!confirm) {
			return;
		}

		try {
			await axios.post(form.attr("action"), new FormData(form[0]));
			localStorage.clear();
			window.location.href = "/login";
		} catch (error) {
			console.log(error.toJSON());
			toastr.error("Unable to increment.");
		}
	});
});
