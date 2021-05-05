$(document).ready(() => {
	const sidebarToggle = $("#sidebar-toggle");
	const modeButton = $("#mode-switcher");

	const body = $(document.body);

	sidebarToggle.on("click", (e) => {
		e.preventDefault();

		if (body.hasClass("collapsed")) {
			body.removeClass("collapsed");
		} else {
			body.addClass("collapsed");
		}
	});

	const buttonLogout = $("#button-logout");

	buttonLogout.on("click", async (e) => {
		e.preventDefault();

		const confirm = await swal({
			text: "Are you sure you want to logout?",
			icon: "warning",
			buttons: ["Cancel", "Confirm"],
			dangerMode: true,
		});

		if (!confirm) {
			return;
		}

		localStorage.removeItem("user");

		await axios.post("/api/auth/logout");
		window.location.href = "/login";
	});

	const navbarLinks = $(".simplebar-content")
		.find(".navbar-nav")
		.find(".nav-item");

	navbarLinks.each(function () {
		const link = $(this);

		const anchor = link.find("a");

		if (window.location.pathname === anchor[0].pathname) {
			link.addClass("active");
		}
	});

	modeButton.on("click", (e) => {
		e.preventDefault();

		const mode = modeButton.attr("data-mode");

		if (mode === "dark") {
			$("#darkTheme").attr("disabled", true);
			$("#lightTheme").attr("disabled", false);
			modeButton.attr("data-mode", "light");
			localStorage.setItem("mode", "light");
		} else {
			$("#lightTheme").attr("disabled", true);
			$("#darkTheme").attr("disabled", false);
			modeButton.attr("data-mode", "dark");
			localStorage.setItem("mode", "dark");
		}
	});

	const uppercaseInputs = $("[data-uppercase]");

	uppercaseInputs.on("input", function () {
		const input = $(this);

		input.val(ucwords(input.val()));
	});

	const phoneNumberInputs = $("[data-phone-number]");

	phoneNumberInputs.on("input", function () {
		const input = $(this);

		const value = input.val();

		if (value.length > 11) {
			input.val(limit(value, 11));
		}
	});

	const dateInputs = $("[data-flatpickr]");

	dateInputs.each(function () {
		const input = $(this);

		let options = {};

		if (input.attr("data-flatpickr-time") !== undefined) {
			options = {
				mode: "time",
				altInput: true,
				altFormat: "G:i K",
				onChange: (dates) => {
					if (dates.length > 0) {
						setTimeout(() => {
							input.val(dates[0].toJSON());
						}, 1000);
					}
				},
			};
		}

		if (input.attr("name") === "birthday") {
			options.maxDate = dayjs(new Date()).subtract(15, "years").toDate();
		}

		const value = input.val();

		if (isValidDate(value)) {
			options.defaultDate = dayjs(value).toDate();
		}

		input.flatpickr(options);
	});

	const tables = $("table");

	tables.each(function () {
		$(this).on("click", "[data-toggle=modal]", function () {
			const id = $(this).attr("data-target");
			$(id).modal("toggle");
		});
	});

	const incrementAdmissionBtn = $("#increment-admission-btn");

	incrementAdmissionBtn.on("click", async (e) => {
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
			await axios.post("/dashboard/admissions/increment");
			localStorage.clear();
			window.location.href = "/login";
		} catch (error) {
			console.log(error.toJSON());
			toastr.error("Unable to increment.");
		}
	});
});
