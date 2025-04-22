document.getElementById("pdfUploadLetters").addEventListener("change", function () {
    const fileLabel = document.getElementById("fileNameLetters");
    const pdfFile = this.files[0];
    if (pdfFile) {
        fileLabel.textContent = "Archivo seleccionado: " + pdfFile.name;
    } else {
        fileLabel.textContent = "No se ha seleccionado ningun archivo."
    }
});

document.getElementById("registerForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", document.getElementById("name").value.trim());
    formData.append("first_surname", document.getElementById("first_surname").value.trim());
    formData.append("second_surname", document.getElementById("second_surname").value.trim());
    formData.append("email", document.getElementById("email").value.trim());
    formData.append("ascription", document.getElementById("ascription").value.trim());

    const pdfFileLetters = document.getElementById("pdfUploadLetters").files[0];
    if (!pdfFileLetters) {
        const noLettersModal = new bootstrap.Modal(document.getElementById("missingLetters"));
        noLettersModal.show();
    }

    formData.append("documents", pdfFileLetters);

    try {
        const response = await fetch("..backend/sendCollectorRequest.php", {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        if (data.success) {

        } else {

        }
    } catch (error) {
        console.error("Error: " + error);
    }
})