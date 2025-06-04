// Variables para almacenar el archivo actual de cada input
let archivoCV = null;
let archivoPermiso = null;
let archivoCarta = null;
let archivoProtocolo = null;

// CV
document.getElementById("curriculumButton").addEventListener("click", function () {
    document.getElementById("cvFile").click();
});

document.getElementById("cvFile").addEventListener("change", function () {
    const fileLabel = document.getElementById("fileNameCurriculum");
    const file = this.files[0];

    if (file) {
        archivoCV = file;
        fileLabel.textContent = "Archivo seleccionado: " + file.name;
    } else if (!archivoCV) {
        fileLabel.textContent = "No se ha seleccionado ningún archivo.";
    }
});

// Permiso
document.getElementById("permisoButton").addEventListener("click", function () {
    document.getElementById("permisoFile").click();
});

document.getElementById("permisoFile").addEventListener("change", function () {
    const fileLabel = document.getElementById("fileNamePermision");
    const file = this.files[0];

    if (file) {
        archivoPermiso = file;
        fileLabel.textContent = "Archivo seleccionado: " + file.name;
    } else if (!archivoPermiso) {
        fileLabel.textContent = "No se ha seleccionado ningún archivo.";
    }
});

// Carta
document.getElementById("letterButton").addEventListener("click", function () {
    document.getElementById("cartaFile").click();
});

document.getElementById("cartaFile").addEventListener("change", function () {
    const fileLabel = document.getElementById("fileNameLetter");
    const file = this.files[0];

    if (file) {
        archivoCarta = file;
        fileLabel.textContent = "Archivo seleccionado: " + file.name;
    } else if (!archivoCarta) {
        fileLabel.textContent = "No se ha seleccionado ningún archivo.";
    }
});

// Protocolo
document.getElementById("protocolButton").addEventListener("click", function () {
    document.getElementById("protocoloFile").click();
});

document.getElementById("protocoloFile").addEventListener("change", function () {
    const fileLabel = document.getElementById("fileNameProtocol");
    const file = this.files[0];

    if (file) {
        archivoProtocolo = file;
        fileLabel.textContent = "Archivo seleccionado: " + file.name;
    } else if (!archivoProtocolo) {
        fileLabel.textContent = "No se ha seleccionado ningún archivo.";
    }
});

document.getElementById("solicitudForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", document.getElementById("names").value.trim());
    formData.append("first_surname", document.getElementById("firstSurname").value.trim());
    formData.append("second_surname", document.getElementById("secondSurname").value.trim());
    formData.append("email", document.getElementById("email").value.trim());
    formData.append("ref_name", document.getElementById("refNames").value.trim());
    formData.append("ref_first_surname", document.getElementById("refFirstSurname").value.trim());
    formData.append("ref_second_surname", document.getElementById("refSecondSurname").value.trim());
    formData.append("ref_email", document.getElementById("refEmail").value.trim());

    const names = document.getElementById("names").value.trim();
    const firstSurname = document.getElementById("firstSurname").value.trim();
    const secondSurname = document.getElementById("secondSurname").value.trim();
    const email = document.getElementById("email").value.trim();
    const refNames = document.getElementById("refNames").value.trim();
    const refFirstSurname = document.getElementById("refFirstSurname").value.trim();
    const refSecondSurname = document.getElementById("refSecondSurname").value.trim();
    const refEmail = document.getElementById("refEmail").value.trim();

    const fileCurriculum = document.getElementById("cvFile").files[0];
    const filePermit = document.getElementById("permisoFile").files[0];
    const fileLetter = document.getElementById("cartaFile").files[0];
    const fileProyect = document.getElementById("protocoloFile").files[0];

    formData.append("cv_file", fileCurriculum);
    formData.append("permit_file", filePermit);
    formData.append("letter_file", fileLetter);
    formData.append("proyect_file", fileProyect);

    if (!names || !firstSurname || !secondSurname || !email || !refNames || !refFirstSurname || !refSecondSurname || !refEmail) {
        const missingFieldsModal = new bootstrap.Modal(document.getElementById("missingFields"));
        missingFieldsModal.show();
        return;
    }
    
    if (!fileCurriculum || !fileLetter || !filePermit) {
        const missingDocuments = new bootstrap.Modal(document.getElementById("missingDocuments"));
        missingDocuments.show();
        return;
    }

    try {
        const response = await fetch("../backend/sendCollectorAplication.php", {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        if (data.success) {
            const exitModal = new bootstrap.Modal(document.getElementById("successRequest"));
            exitModal.show();
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Error: " + error);
    }
});

document.getElementById("aceptModalBtn").addEventListener("click", function () {
    window.location.href = "home.html";
})