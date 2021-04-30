$(document).ready(async () => {
	const table = $("#table-subjects");
	const refreshButton = $("#table-subjects-refresh");

	let datatable = null;

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
					`<a class='dropdown-item ${outIf(
						user()?.role !== "Registrar",
						"d-none"
					)}' href='/dashboard/subjects/edit?id=${subject.id}' />`
				);
				edit.append(`<span><i class='fe fe-edit-2'></i></span> Edit`);

				const viewGrade = $(
					`<button class='dropdown-item ${
						user()?.role !== "Student" ? "d-none" : ""
					} btn-action-view-grade' data-id='${subject.id}'/>`
				);
				viewGrade.append(
					`<span><i class='fe fe-bookmark'></i></span> View Grade`
				);

				dropdownMenu.append(viewGrade, edit);
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

	fetchsubjects();

	refreshButton.on("click", (e) => {
		e.preventDefault();

		fetchsubjects();
	});

	const viewGradeModal = $("#view-grade-modal");
	const viewGradeList = viewGradeModal.find("ul");

	table.on("click", ".btn-action-view-grade", async function () {
		const button = $(this);

		const id = button.attr("data-id");

		try {
			const { data: grade } = await axios.get(
				`/api/grades/self?subject_id=${id}`
			);

			viewGradeList.html("");

			if (!grade) {
				return toastr.info(
					"Current subject does not have grades yet.",
					"Notice"
				);
			}

			const description = $(`<li class='list-group-item' />`);
			description.html(
				`<b>Description</b> - ${grade.subject?.description}`
					.replace("<script>", "")
					.replace("</script>", "")
			);

			const teacher = $(`<li class='list-group-item' />`);
			teacher.html(
				`<b>Faculty Name</b> - ${grade.teacher?.last_name}, ${
					grade.teacher?.first_name
				} ${grade.teacher?.middle_name || ""}`
					.replace("<script>", "")
					.replace("</script>", "")
			);

			const units = $(`<li class='list-group-item' />`);
			units.html(
				`<b>Units</b> - ${grade.subject?.units}`
					.replace("<script>", "")
					.replace("</script>", "")
			);

			const finalGrade = $(`<li class='list-group-item' />`);
			finalGrade.html(
				`<b>Final Grade</b> - ${grade.grade}`
					.replace("<script>", "")
					.replace("</script>", "")
			);

			viewGradeList.append(description, teacher, units, finalGrade);
			viewGradeModal.modal("show");
		} catch (error) {
			handleError(error);
		}
	});
});
