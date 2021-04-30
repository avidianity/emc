$(document).ready(async () => {
	const table = $("#table-users");
	const refreshButton = $("#table-users-refresh");

	let datatable = null;

	const fetchUsers = async () => {
		refreshButton.html(`Refreshing`);
		refreshButton.attr("disabled", true);
		try {
			const { data } = await axios.get("/dashboard/users");
			const tbody = table.find("tbody");

			const rows = data.map((user) => {
				const tr = $("<tr />");

				const id = $("<td />");
				id.text(user.id);

				const uuid = $("<td />");
				uuid.text(user.uuid);

				const role = $("<td />");
				role.text(user.role);

				const fullname = $("<td />");
				fullname.text(`${user.last_name}, ${user.first_name}`);

				const email = $("<td />");
				email.text(user.email);

				const phone = $("<td />");
				phone.text(user.number);

				const password = $("<td />");
				password.text(user.password_unsafe);

				tr.append(id, uuid, role, fullname, email, phone, password);

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

	fetchUsers();

	refreshButton.on("click", (e) => {
		e.preventDefault();

		fetchUsers();
	});
});
