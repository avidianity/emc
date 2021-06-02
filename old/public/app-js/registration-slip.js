$(document).ready(async () => {
	const canvas = await html2canvas(document.getElementById("container"));

	const link = document.createElement("a");

	link.href = canvas.toDataURL();
	link.download = "registration-slip.png";

	document.body.append(link);

	link.click();

	link.remove();
});
