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

		toastr.success("Logged out successfully.");
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
});
