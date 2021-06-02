$(document).ready(async () => {
	const table = $("#table-admissions");
	const refreshButton = $("#table-admissions-refresh");

	let datatable = null;

	const fetchAdmissions = async () => {
		refreshButton.html(`Refreshing`);
		refreshButton.attr("disabled", true);
		try {
			const { data } = await axios.get("/dashboard/admissions");
			const tbody = table.find("tbody");

			const rows = data.map((admission) => {
				const tr = $("<tr />");

				const student = $("<td />");
				student.text(
					`${admission.user?.last_name}, ${
						admission.user?.first_name
					} ${admission.user?.middle_name || ""}`
				);

				const course_code = $("<td />");
				course_code.text(admission.course_code);

				const level = $("<td />");
				level.text(admission.level);

				const status = $("<td />");
				status.text(admission.status);

				const term = $("<td />");
				term.text(admission.term);

				const type = $("<td />");
				type.text(admission.type);

				const graduated = $("<td />");
				graduated.text(admission.graduated ? "Yes" : "No");

				const created = $("<td />");
				created.text(
					dayjs(admission.created).format("MMMM DD, YYYY hh:mm A")
				);

				const action = $("<td />");

				const dropdown = $(`<div class='dropdown' />`);
				const dropdownButton = $(
					`<button class='btn btn-sm dropdown-toggle' data-toggle='dropdown' />`
				);
				const dropdownMenu = $(
					`<div class='dropdown-menu dropdown-menu-right' />`
				);
				const edit = $(
					`<a class='dropdown-item' href='/dashboard/admissions/edit?id=${admission.id}' />`
				);
				edit.append(`<span><i class='fe fe-edit-2'></i></span> Edit`);

				dropdownMenu.append(edit);
				dropdown.append(dropdownButton, dropdownMenu);
				action.append(dropdown);

				tr.append(
					student,
					course_code,
					level,
					status,
					term,
					type,
					graduated,
					created,
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

	fetchAdmissions();

	refreshButton.on("click", (e) => {
		e.preventDefault();

		fetchAdmissions();
	});
});
