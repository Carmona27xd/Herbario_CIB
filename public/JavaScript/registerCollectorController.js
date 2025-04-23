document.getElementById("pdfUpLoad").addEventListener("change", function () {
    const fileLabel = document.getElementById("fileName");
    const pdfFile = this.files[0]; 
    if (pdfFile) {
        fileLabel.textContent = "Archivo seleccionado: " + pdfFile.name;
    } else {
        fileLabel.textContent = "No se ha seleccionado ningún archivo.";
    }
});

document.getElementById("registerForm").addEventListener("submit", async function (event) {
    event.preventDefault(); 

    const formData = new FormData(); 
    formData.append("name", document.getElementById("name").value.trim());
    formData.append("first_surname", document.getElementById("first_surname").value.trim());
    formData.append("second_surname", document.getElementById("second_surname").value.trim());
    formData.append("ascription", document.getElementById("ascription").value.trim());

    const pdfFile = document.getElementById("pdfUpLoad").files[0];
    if (!pdfFile) {
        alert("Por favor selecciona un archivo PDF");
        return;
    } 
    
    formData.append("pdfFile", pdfFile);

    try {
        const response = await fetch("../backend/registerCollector.php", {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        if (data.success) {
            alert("Colector registrado exitosamente");
            window.location.href = "dashBoardAdmin.html";
        } else {
            alert("Error en el registro: " + data.message);
        }
    } catch (error) {
        console.error("Error: ", error);
    }
});
