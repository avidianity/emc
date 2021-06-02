$(document).ready(async () => {
	const table = $("#table-courses");
	const refreshButton = $("#table-courses-refresh");

	let datatable = null;

	const fetchCourses = async () => {
		refreshButton.html(`Refreshing`);
		refreshButton.attr("disabled", true);
		try {
			const { data } = await axios.get("/dashboard/courses");
			const tbody = table.find("tbody");

			const rows = data.map((course) => {
				const tr = $("<tr />");

				const code = $("<td />");
				code.text(course.code);

				const description = $("<td />");
				description.text(course.description);

				const status = $("<td />");
				const badge = $(`<span class='badge badge-pill' />`);
				badge.addClass(`badge-${course.open ? "success" : "danger"}`);
				badge.text(
					course.open
						? "Open for Enrollment"
						: "Not Open for Enrollment"
				);
				status.append(badge);

				const action = $("<td />");

				const dropdown = $(
					`<div class='dropdown ${outIf(
						user()?.role !== "Registrar",
						"d-none"
					)}' />`
				);
				const dropdownButton = $(
					`<button class='btn btn-sm dropdown-toggle' data-toggle='dropdown' />`
				);
				const dropdownMenu = $(
					`<div class='dropdown-menu dropdown-menu-right' />`
				);
				const edit = $(
					`<a class='dropdown-item' href='/dashboard/courses/edit?id=${course.id}' />`
				);
				edit.append(`<span><i class='fe fe-edit-2'></i></span> Edit`);

				const deleteAction = $(
					`<button class='dropdown-item btn-action-delete ${outIf(
						user()?.role !== "Registrar",
						"d-none"
					)}' data-id='${course.id}' />`
				);
				deleteAction.append(
					`<span><i class='fe fe-trash-2'></i></span> Delete`
				);

				dropdownMenu.append(edit, deleteAction);
				dropdown.append(dropdownButton, dropdownMenu);
				action.append(dropdown);

				tr.append(code, description, status, action);

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

	fetchCourses();

	refreshButton.on("click", (e) => {
		e.preventDefault();

		fetchCourses();
	});

	table.on("click", ".btn-action-delete", async function () {
		const id = $(this).attr("data-id");

		const confirm = await swal({
			text: "Are you sure you want to delete this course?",
			icon: "warning",
			buttons: ["Cancel", "Confirm"],
			dangerMode: true,
		});

		if (!confirm) {
			return;
		}

		try {
			await axios.delete(`/dashboard/courses?id=${id}`);
			toastr.info("Course deleted successfully.", "Notice");
			fetchCourses();
		} catch (error) {
			console.log(error);
			toastr.error("Unable to delete course.");
		}
	});
});
