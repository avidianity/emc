$(document).ready(async () => {
	const table = $("#table-subjects");
	const refreshButton = $("#table-subjects-refresh");

	const fetchsubjects = async () => {
		refreshButton.html(`Refreshing`);
		refreshButton.attr("disabled", true);
		try {
			const { data } = await axios.get("/dashboard/subjects");
			const tbody = table.find("tbody");

			const rows = data.map((subject) => {
				const tr = $("<tr />");

				const code = $("<td />");
				code.text(subject.code);

				const description = $("<td />");
				description.text(subject.description);

				const course_code = $("<td />");
				course_code.text(subject.course_code);

				const level = $("<td />");
				level.text(subject.level);

				const semester = $("<td />");
				semester.text(subject.term);

				const units = $("<td />");
				units.text(subject.units);

				const action = $("<td />");

				const dropdown = $(`<div class='dropdown' />`);
				const dropdownButton = $(
					`<button class='btn btn-sm dropdown-toggle' data-toggle='dropdown' />`
				);
				const dropdownMenu = $(
					`<div class='dropdown-menu dropdown-menu-right' />`
				);
				const edit = $(
					`<a class='dropdown-item' href='/dashboard/subjects/edit?id=${subject.id}' />`
				);
				edit.append(`<span><i class='fe fe-edit-2'></i></span> Edit`);

				dropdownMenu.append(edit);
				dropdown.append(dropdownButton, dropdownMenu);
				action.append(dropdown);

				tr.append(
					code,
					description,
					course_code,
					level,
					semester,
					units,
					action
				);

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

	fetchsubjects();

	refreshButton.on("click", (e) => {
		e.preventDefault();

		fetchsubjects();
	});
});
