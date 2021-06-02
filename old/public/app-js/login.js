$(document).ready(() => {
	const form = $("#login-form");

	let attempts = 0;

	form.on("submit", async (event) => {
		event.preventDefault();

		const url = form.attr("action");
		const button = form.find(`button[type=submit]`);

		const blockFor = localStorage.getItem("block-for");

		if (blockFor) {
			const date = dayjs(blockFor);
			if (dayjs(new Date()).isAfter(date)) {
				attempts = 0;
				localStorage.removeItem("block-for");
			} else {
				return toastr.info(
					`Login attempts: ${attempts}. Please try again after 60 minutes.`
				);
			}
		}

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
			attempts++;

			if (attempts >= 4) {
				localStorage.setItem(
					"block-for",
					dayjs(new Date()).add(1, "hour").toDate().toJSON()
				);
			}
		} finally {
			button.attr("disabled", false);
		}
	});
});
