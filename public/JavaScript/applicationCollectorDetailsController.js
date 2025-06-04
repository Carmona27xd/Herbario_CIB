/**
 * Manejo de visualización de documentos
 */
document.addEventListener("DOMContentLoaded", () => {
    // Cargar datos de la solicitud
    const request = JSON.parse(localStorage.getItem("selectedRequest"));
    
    if (!request || !request.id_request) {
        console.error("Error: No se pudo cargar la solicitud");
        showError("No se pudo cargar la información de la solicitud");
        return;
    }

    // Mostrar datos básicos
    displayBasicInfo(request);
    
    // Configurar enlaces de documentos
    setupDocumentLinks(request);
    
    // Configurar botón de regreso
    document.getElementById("backButton").addEventListener("click", () => {
        window.location.href = "adminRequestsCollector.html";
    });
});

/**
 * Muestra la información básica del solicitante
 */
function displayBasicInfo(request) {
    const completeNameReference = `${request.ref_name} ${request.ref_first_surname} ${request.ref_second_surname || ''}`.trim();
    
    document.getElementById("infoNames").textContent = request.name;
    document.getElementById("infoFirstSurname").textContent = request.first_surname;
    document.getElementById("infoSecondSurname").textContent = request.second_surname || '';
    document.getElementById("infoEmail").textContent = request.email;
    document.getElementById("referenceName").textContent = completeNameReference;
    document.getElementById("referenceEmail").textContent = request.ref_email;
}

/**
 * Configura todos los enlaces de documentos
 */
function setupDocumentLinks(request) {
    // Lista de documentos a configurar
    const documents = [
        { id: "infoCurriculum", field: "curriculum_name", type: "curriculum" },
        { id: "letterName", field: "letter_name", type: "letter" },
        { id: "infoPermit", field: "permit_name", type: "permit" },
        { id: "proyectName", field: "proyect_name", type: "proyect" }
    ];

    documents.forEach(doc => {
        const element = document.getElementById(doc.id);
        if (!element) return;

        if (request[doc.field]) {
            element.textContent = request[doc.field];
            element.href = `../backend/downloadDocument.php?id=${request.id_request}&type=${doc.type}`;
            
            // Manejar clic para abrir en nueva pestaña
            element.addEventListener("click", (e) => {
                e.preventDefault();
                window.open(element.href, '_blank');
            });
        } else {
            element.textContent = "Documento no disponible";
            element.classList.add("disabled-link");
        }
    });
}

/**
 * Muestra mensajes de error
 */
function showError(message) {
    const errorContainer = document.createElement("div");
    errorContainer.className = "alert alert-danger";
    errorContainer.textContent = message;
    document.body.prepend(errorContainer);
}