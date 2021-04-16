$(document).ready(async () => {
	const table = $("#table-emails");
	const refreshButton = $("#table-emails-refresh");

	const fetchMails = async () => {
		refreshButton.html(`Refreshing`);
		refreshButton.attr("disabled", true);
		try {
			const { data } = await axios.get("/api/emails");
			const tbody = table.find("tbody");

			const rows = data.map((mail) => {
				const tr = $("<tr />");

				const created = $("<td />");
				created.text(
					dayjs(mail.created_at).format("MMMM DD, YYYY hh:mm A")
				);

				const to = $("<td />");
				to.text(mail.to);

				const subject = $("<td />");
				subject.text(mail.subject);

				const status = $("<td />");
				const badge = $(`<span class='badge badge-pill' />`);
				badge.addClass(
					`badge-${mail.status === "Pending" ? "warning" : "success"}`
				);
				badge.text(mail.status);
				status.append(badge);

				const sent = $("<td />");
				sent.text(
					mail.sent
						? dayjs(mail.sent).format("MMMM DD, YYYY hh:mm A")
						: ""
				);

				const content = $("<td />");
				const modal = `
						<button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#${
							mail.uuid
						}">
						View
						</button>
						<div class="modal fade" id="${
							mail.uuid
						}" tabindex="-1" role="dialog" aria-labelledby="${
					mail.uuid
				}label" aria-hidden="true">
						<div class="modal-dialog modal-dialog-centered modal-lg" role="document">
							<div class="modal-content">
							<div class="modal-header">
								<h5 class="modal-title" id="${mail.uuid}label">Content</h5>
								<button type="button" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div class="modal-body">
								${mail.body.replace("<script>", "").replace("</script>", "")}
							</div>
							<div class="modal-footer">
								<button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Close</button>
							</div>
							</div>
						</div>
						</div>`;
				content.html(modal);

				tr.append(created, to, subject, status, sent, content);

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

	fetchMails();

	refreshButton.on("click", (e) => {
		e.preventDefault();

		fetchMails();
	});
});
