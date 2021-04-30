$(document).ready(async () => {
	const table = $("#table-students");
	const refreshButton = $("#table-students-refresh");

	let datatable = null;

	const fetchStudents = async () => {
		refreshButton.html(`Refreshing`);
		refreshButton.attr("disabled", true);
		try {
			const { data } = await axios.get("/dashboard/students");
			const tbody = table.find("tbody");

			const rows = data.map((student) => {
				const tr = $("<tr />");

				const uuid = $("<td />");
				uuid.text(student.uuid);

				const fullname = $("<td />");
				fullname.text(`${student.last_name}, ${student.first_name}`);

				const course = $("<td />");
				course.text(student.admission?.course_code || "");

				const year = $("<td />");
				year.text(student.admission?.level);

				const status = $("<td />");
				const badge = $(`<span class='badge badge-pill' />`);
				badge.addClass(
					`badge-${student.active ? "success" : "danger"}`
				);
				badge.text(student.active ? "Confirmed" : "Unconfirmed");
				status.append(badge);

				const action = $(
					`<td class='${outIf(
						user()?.role === "Admin",
						"d-none"
					)}' />`
				);

				const dropdown = $(`<div class='dropdown' />`);
				const dropdownButton = $(
					`<button class='btn btn-sm dropdown-toggle' data-toggle='dropdown' />`
				);
				const dropdownMenu = $(
					`<div class='dropdown-menu dropdown-menu-right' />`
				);

				const confirm = $(
					`<button class='dropdown-item btn-action-confirm ${
						student.active || user()?.role !== "Registrar"
							? "d-none"
							: ""
					}' data-id='${student.id}' />`
				);
				confirm.append(
					`<span><i class='fe fe-user-check'></i></span> Confirm`
				);

				const addGrade = $(
					`<button class='dropdown-item btn-action-add-grade ${
						!student.active || user()?.role !== "Teacher"
							? "d-none"
							: ""
					}' data-id='${student.id}' />`
				);
				addGrade.append(
					`<span><i class='fe fe-bookmark'></i></span> Add Grade`
				);

				const edit = $(
					`<a class='dropdown-item ${
						user()?.role !== "Registrar" ? "d-none" : ""
					}' href='/dashboard/admissions/edit?id=${
						student.admission?.id
					}' />`
				);
				edit.append(`<span><i class='fe fe-edit-2'></i></span> Edit`);

				dropdownMenu.append(confirm, addGrade, edit);
				dropdown.append(dropdownButton, dropdownMenu);
				action.append(dropdown);

				tr.append(uuid, fullname, course, year, status, action);

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

	fetchStudents();

	table.on("click", ".btn-action-confirm", async function () {
		const button = $(this);
		const id = button.attr("data-id");

		try {
			await axios.put(`/dashboard/students?id=${id}`, {
				active: true,
			});
			toastr.info("Student has been confirmed.", "Notice");
		} catch (error) {
			handleError(error);
		} finally {
			await fetchStudents();
		}
	});

	const addGradeModal = $("#add-student-grade-modal");
	const addGradeForm = addGradeModal.find("form");

	table.on("click", ".btn-action-add-grade", async function () {
		const button = $(this);

		const id = button.attr("data-id");
		const { data: student } = await axios.get(
			`/dashboard/students/show?id=${id}`
		);

		addGradeForm.find("#student_id").val(id);

		const { data: subjects } = await axios.get("/dashboard/subjects");

		addGradeForm
			.find("#subject_id")
			.html("")
			.append(
				...subjects.map((subject) => {
					const option = $(
						`<option value='${subject.id}'>${subject.code}</option>`
					);

					return option;
				})
			);

		addGradeForm
			.find("#student")
			.val(
				`${student.last_name}, ${student.first_name} ${student.middle_name}`
			);

		addGradeModal.modal("show");
	});

	addGradeForm.on("submit", async (e) => {
		e.preventDefault();

		const url = addGradeForm.attr("action");
		const data = addGradeForm.serialize();

		try {
			await axios.post(url, data);
			toastr.info("Grade added successfully.");
			addGradeForm[0].reset();
			addGradeModal.modal("hide");
		} catch (error) {
			handleError(error);
		}
	});

	refreshButton.on("click", (e) => {
		e.preventDefault();
		fetchStudents();
	});
});
