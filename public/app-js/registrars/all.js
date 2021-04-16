$(document).ready(async () => {
	const table = $("#table-registrars");
	const refreshButton = $("#table-registrars-refresh");

	const fetchRegistrars = async () => {
		refreshButton.html(`Refreshing`);
		refreshButton.attr("disabled", true);
		try {
			const { data } = await axios.get("/dashboard/registrars");
			const tbody = table.find("tbody");

			const rows = data.map((registrar) => {
				const tr = $("<tr />");

				const uuid = $("<td />");
				uuid.text(registrar.uuid);

				const fullname = $("<td />");
				fullname.text(
					`${registrar.last_name}, ${registrar.first_name}`
				);

				const phone = $("<td />");
				phone.text(registrar.number);

				const email = $("<td />");
				email.text(registrar.email);

				const active = $("<td />");
				const badge = $(`<span class='badge badge-pill' />`);
				badge.addClass(
					`badge-${registrar.active ? "success" : "danger"}`
				);
				badge.text(registrar.active ? "Active" : "Inactive");
				active.append(badge);

				const action = $("<td />");

				const dropdown = $(`<div class='dropdown' />`);
				const dropdownButton = $(
					`<button class='btn btn-sm dropdown-toggle' data-toggle='dropdown' />`
				);
				const dropdownMenu = $(
					`<div class='dropdown-menu dropdown-menu-right' />`
				);
				const edit = $(
					`<a class='dropdown-item' href='/dashboard/registrars/edit?id=${registrar.id}' />`
				);
				edit.append(`<span><i class='fe fe-edit-2'></i></span> Edit`);

				const disable = $(
					`<button class='dropdown-item btn-action-disable ${
						registrar.active ? "" : "d-none"
					}' data-id='${registrar.id}' />`
				);
				disable.append(
					`<span><i class='fe fe-user-x'></i></span> Disable`
				);

				const enable = $(
					`<button class='dropdown-item btn-action-enable ${
						registrar.active ? "d-none" : ""
					}' data-id='${registrar.id}' />`
				);
				enable.append(
					`<span><i class='fe fe-user-check'></i></span> Enable`
				);

				dropdownMenu.append(edit, disable, enable);
				dropdown.append(dropdownButton, dropdownMenu);
				action.append(dropdown);

				tr.append(uuid, fullname, email, phone, active, action);

				return tr;
			});
			tbody.html("");
			tbody.append(...rows);
		} catch (error) {
			handleError(error);
		} finally {
			refreshButton.html("Refresh");
			refreshButton.attr("disabled", false);
		}
	};

	fetchRegistrars();

	table.on("click", ".btn-action-disable", async function () {
		const button = $(this);
		const id = button.attr("data-id");

		try {
			await axios.put(`/dashboard/registrars?id=${id}`, {
				active: false,
			});
			toastr.info("Registrar has been disabled.", "Notice");
		} catch (error) {
			handleError(error);
		} finally {
			await fetchRegistrars();
		}
	});

	table.on("click", ".btn-action-enable", async function () {
		const button = $(this);
		const id = button.attr("data-id");

		try {
			await axios.put(`/dashboard/registrars?id=${id}`, {
				active: true,
			});
			toastr.info("Registrar has been enabled.", "Notice");
		} catch (error) {
			handleError(error);
		} finally {
			await fetchRegistrars();
		}
	});

	refreshButton.on("click", (e) => {
		e.preventDefault();

		fetchRegistrars();
	});
});
