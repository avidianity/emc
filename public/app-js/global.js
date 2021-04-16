$(document).ready(() => {
	const sidebarToggle = $("#sidebar-toggle");

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

		await axios.post("/api/auth/logout");
		toastr.success("Logged out successfully.");
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
});
