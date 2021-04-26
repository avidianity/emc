$(document).ready(async () => {
	const table = $("#table-teachers");
	const refreshButton = $("#table-teachers-refresh");

	let datatable = null;

	const fetchTeachers = async () => {
		refreshButton.html(`Refreshing`);
		refreshButton.attr("disabled", true);
		try {
			const { data } = await axios.get("/dashboard/teachers");
			const tbody = table.find("tbody");

			const rows = data.map((teacher) => {
				const tr = $("<tr />");

				const uuid = $("<td />");
				uuid.text(teacher.uuid);

				const fullname = $("<td />");
				fullname.text(
					`${teacher.last_name}, ${teacher.first_name} ${
						teacher.middle_name || ""
					}`
				);

				const phone = $("<td />");
				phone.text(teacher.number);

				const email = $("<td />");
				email.text(teacher.email);

				const address = $("<td />");
				address.text(teacher.address || "");

				const gender = $("<td />");
				gender.text(teacher.gender);

				const birthdayDate = dayjs(teacher.birthday || new Date());

				const birthday = $("<td />");
				birthday.text(birthdayDate.format("MMMM DD, YYYY"));

				const age = $("<td />");
				age.text(dayjs().year() - birthdayDate.year());

				const active = $("<td />");
				const badge = $(`<span class='badge badge-pill' />`);
				badge.addClass(
					`badge-${teacher.active ? "success" : "danger"}`
				);
				badge.text(teacher.active ? "Active" : "Inactive");
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
					`<a class='dropdown-item' href='/dashboard/teachers/edit?id=${teacher.id}' />`
				);
				edit.append(`<span><i class='fe fe-edit-2'></i></span> Edit`);

				const disable = $(
					`<button class='dropdown-item btn-action-disable ${
						teacher.active ? "" : "d-none"
					}' data-id='${teacher.id}' />`
				);
				disable.append(
					`<span><i class='fe fe-user-x'></i></span> Disable`
				);

				const enable = $(
					`<button class='dropdown-item btn-action-enable ${
						teacher.active ? "d-none" : ""
					}' data-id='${teacher.id}' />`
				);
				enable.append(
					`<span><i class='fe fe-user-check'></i></span> Enable`
				);

				dropdownMenu.append(edit, disable, enable);
				dropdown.append(dropdownButton, dropdownMenu);
				action.append(dropdown);

				tr.append(
					uuid,
					fullname,
					phone,
					email,
					address,
					gender,
					birthday,
					age,
					active,
					action
				);

				return tr;
			});

			if (datatable) {
				datatable.destroy();
			}

			tbody.html("");
			tbody.append(...rows);

			datatable = table.DataTable();
		} catch (error) {
			handleError(error);
		} finally {
			refreshButton.html("Refresh");
			refreshButton.attr("disabled", false);
		}
	};

	fetchTeachers();

	table.on("click", ".btn-action-disable", async function () {
		const button = $(this);
		const id = button.attr("data-id");

		try {
			await axios.put(`/dashboard/teachers?id=${id}`, {
				active: false,
			});
			toastr.info("Teacher has been disabled.", "Notice");
		} catch (error) {
			handleError(error);
		} finally {
			await fetchTeachers();
		}
	});

	table.on("click", ".btn-action-enable", async function () {
		const button = $(this);
		const id = button.attr("data-id");

		try {
			await axios.put(`/dashboard/teachers?id=${id}`, {
				active: true,
			});
			toastr.info("Teacher has been enabled.", "Notice");
		} catch (error) {
			handleError(error);
		} finally {
			await fetchTeachers();
		}
	});

	refreshButton.on("click", (e) => {
		e.preventDefault();

		fetchTeachers();
	});
});
