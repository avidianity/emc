$(document).ready(async () => {
	const table = $("#table-schedules");
	const refreshButton = $("#table-schedules-refresh");

	let datatable = null;

	const fetchSchedules = async () => {
		refreshButton.html(`Refreshing`);
		refreshButton.attr("disabled", true);
		try {
			const { data } = await axios.get("/dashboard/schedules");
			const tbody = table.find("tbody");

			const rows = data.map((schedule) => {
				const tr = $("<tr />");

				const course = $("<td />");
				course.text(schedule.course?.code);

				const teacher = $("<td />");
				teacher.text(
					`${schedule.teacher?.last_name}, ${
						schedule.teacher?.first_name
					} ${schedule.teacher?.middle_name || ""}`
				);

				const year = $("<td />");
				year.text(schedule.year);

				const times = $("<td />");

				Object.keys(schedule.payload).forEach((day) => {
					const { start_time, end_time } = schedule.payload[day];

					if (isValidDate(start_time) && isValidDate(end_time)) {
						const div = $("<div class='my-1' />");
						div.text(
							`${day} ${dayjs(start_time).format(
								"hh:mm A"
							)} - ${dayjs(end_time).format("hh:mm A")}`
						);

						times.append(div);
					}
				});

				const action = $("<td />");

				const dropdown = $(`<div class='dropdown' />`);
				const dropdownButton = $(
					`<button class='btn btn-sm dropdown-toggle ${outIf(
						user()?.role === "Student",
						"d-none"
					)}' data-toggle='dropdown' />`
				);
				const dropdownMenu = $(
					`<div class='dropdown-menu dropdown-menu-right' />`
				);

				const edit = $(
					`<a class='dropdown-item ${outIf(
						user()?.role !== "Registrar",
						"d-none"
					)}' href='/dashboard/schedules/edit?id=${schedule.id}' />`
				);
				edit.append(`<span><i class='fe fe-edit-2'></i></span> Edit`);

				dropdownMenu.append(edit);
				dropdown.append(dropdownButton, dropdownMenu);
				action.append(dropdown);

				tr.append(course, teacher, year, times, action);

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

	fetchSchedules();

	refreshButton.on("click", (e) => {
		e.preventDefault();

		fetchSchedules();
	});
});
