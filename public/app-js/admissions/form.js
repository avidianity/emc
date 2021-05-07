$(document).ready(() => {
	const form = $("#admission-form");

	form.on("submit", async (e) => {
		e.preventDefault();

		const url = form.attr("action");
		const method = form.attr("method");
		const button = form.find(`button[type=submit]`);

		button.attr("disabled", true);

		try {
			const data = new FormData(form[0]);
			data.append("_method", method);
			await axios.post(url, data);
			toastr.info("Admission has been saved successfully.");
			form[0].reset();
		} catch (error) {
			handleError(error);
		} finally {
			button.attr("disabled", false);
		}
	});

	form.on("change", "#course_code", async function () {
		const select = $(this);

		const code = select.val();

		const { data } = await axios.get("/dashboard/subjects");

		const subjects = data
			.filter((subject) => subject.course_code === code)
			.map((subject, index) => {
				const id = String.random();
				return $(`<div class="col-12 col-md-6 col-lg-4 col-xl-3 form-group">
				<div class="custom-control custom-checkbox">
					<input type="checkbox" class="custom-control-input" name="subjects[${index}]" id="${id}" value="${subject.id}">
					<label class="custom-control-label" for="${id}">${subject.code}</label>
				</div>
			</div>`);
			});

		const pane = $("#subjects-pane");

		if (subjects.length > 0) {
			pane.removeClass("d-none");
		} else {
			pane.addClass("d-none");
		}

		const container = pane.find("#container");
		console.log(container, subjects);
		container.html("");
		container.append(...subjects);
	});
});
