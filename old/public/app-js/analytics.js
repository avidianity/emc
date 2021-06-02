$(document).ready(() => {
	const table = $("#analytics-courses-table");
	const tbody = table.find("tbody");

	let datatable = null;

	const fetchCourses = async () => {
		try {
			const { data: courses } = await axios.get("/api/analytics/courses");

			const rows = courses.map((course) => {
				const tr = $("<tr />");

				const code = $("<td />");
				code.text(course.code);

				const description = $("<td />");
				description.text(course.description);

				const students = $("<td />");
				students.text(course.students_count);

				tr.append(code, description, students);

				return tr;
			});

			if (datatable) {
				datatable.destroy();
			}

			tbody.html("");
			tbody.append(...rows);

			datatable = table.DataTable();
		} catch (error) {
			console.log(error.toJSON());
		}
	};

	const fetchStudents = async () => {
		try {
			const { data } = await axios.get("/api/analytics/students");

			$("#old-students").text(data.old);
			$("#new-students").text(data.new);
		} catch (error) {
			console.log(error.toJSON());
		}
	};

	const fetchGenders = async () => {
		try {
			const { data } = await axios.get("/api/analytics/genders");
			$("#male-students").text(data.male);
			$("#female-students").text(data.female);
		} catch (error) {
			console.log(error.toJSON());
		}
	};

	const fetchEnrollees = async () => {
		try {
			const { data } = await axios.get("/api/analytics/enrollees");
			$("#pending-enrollees").text(data.pending);
		} catch (error) {
			console.log(error.toJSON());
		}
	};

	const fetchGraduates = async () => {
		try {
			const { data } = await axios.get("/api/analytics/graduates");
			$("#graduates").text(data);
		} catch (error) {
			console.log(error.toJSON());
		}
	};

	fetchCourses();
	fetchStudents();
	fetchGenders();
	fetchEnrollees();
	fetchGraduates();
});
