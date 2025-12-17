/**
 * Manejo de visualización de documentos
 */
document.addEventListener("DOMContentLoaded", () => {
    // Cargar datos de la solicitud
    const request = JSON.parse(localStorage.getItem("selectedRequest"));
    const btnAuxRequest = document.getElementById("btnAccept");
    const btnDenied = document.getElementById("btnReject");
    const auxID = localStorage.getItem("selectedRequest");
    let idNumber = null;

    if (auxID) {
        const requestData = JSON.parse(auxID);
        idNumber = parseInt(requestData.id_request);
        console.log("El ID de la solicitud es: ", idNumber);
        console.log("El tipo de dato es: ", typeof idNumber);

    } else {
        console.log("No hay datos en el localStorage");
    }

    btnDenied.addEventListener("click", async () => {
        if (!confirm("¿Estás seguro de marcar esta solicitud como ACEPTADA?")) return;
        try {
            const response = await fetch('../backend/updateCollectorRequestStatusDenied.php', {
                method: 'POST',
                body: JSON.stringify({id_request: idNumber})
            });
            const res = await response.json();

            if (res.success) {
                const errorModal = new bootstrap.Modal(document.getElementById('missingLetters'));
                errorModal.show();
            } else {
                alert("Error: " + res.message);
            }
        } catch (error) {
            console.error(error);
        }
    });

    btnAuxRequest.addEventListener("click", async () => {
        if (!confirm("¿Estás seguro de marcar esta solicitud como ACEPTADA?")) return;
        try {
            const response = await fetch('../backend/updateCollectorRequestStatus.php', {
                method: 'POST',
                body: JSON.stringify({id_request: idNumber})
            });
            const res = await response.json();

            if (res.success) {
                const errorModal = new bootstrap.Modal(document.getElementById('missingLetters'));
                errorModal.show();
            } else {
                alert("Error: " + res.message);
            }
        } catch (error) {
            console.error(error);
        }
    });

    document.getElementById("closeModalBtn").addEventListener("click", function() {
        window.location.href = "adminRequestsCollector.html";
    });
    
    if (!request || !request.id_request) {
        console.error("Error: No se pudo cargar la solicitud");
        alert("No se pudo cargar la información de la solicitud");
        return;
    }

    // Mostrar datos básicos (con la función corregida)
    displayBasicInfo(request);
    
    // Configurar enlaces de documentos (con la función corregida)
    setupDocumentLinks(request);
    
    // Configurar botón de regreso
    document.getElementById("backButton").addEventListener("click", () => {
        window.location.href = "adminRequestsCollector.html";
    });
});

/**
 * Muestra la información básica del solicitante
 * (Versión corregida para manejar 'null' como string y leer 'created_at')
 */
function displayBasicInfo(request) {
    const fallbackText = "No disponible"; // Texto de reemplazo

    // Helper function para verificar valores null o el string "null"
    function getText(fieldValue, fallback = fallbackText) {
        // Si el valor existe, Y NO es la palabra "null", úsalo.
        if (fieldValue && fieldValue !== "null") {
            return fieldValue;
        }
        // De lo contrario, usa el texto de reemplazo
        return fallback;
    }
    
    // Manejo especial para el nombre completo de la referencia
    const refName = getText(request.ref_name, ''); 
    const refFirst = getText(request.ref_first_surname, '');
    const refSecond = getText(request.ref_second_surname, '');
    let completeNameReference = `${refName} ${refFirst} ${refSecond}`.trim().replace(/\s+/g, ' ');

    if (completeNameReference === '') {
        completeNameReference = fallbackText;
    }

    // Asignar texto a todos los campos
    document.getElementById("infoNames").textContent = getText(request.name);
    document.getElementById("infoFirstSurname").textContent = getText(request.first_surname);
    document.getElementById("infoSecondSurname").textContent = getText(request.second_surname, ''); 
    document.getElementById("infoEmail").textContent = getText(request.email);
    document.getElementById("referenceName").textContent = completeNameReference;
    document.getElementById("referenceEmail").textContent = getText(request.ref_email);

    // --- ¡CORRECCIÓN FINAL! ---
    // Lee 'created_at' del objeto 'request'
    document.getElementById("infoDateApplication").textContent = getText(request.created_at);
}

/**
 * Configura todos los enlaces de documentos
 * (Versión corregida para manejar 'null' como string)
 */
function setupDocumentLinks(request) {
    const documents = [
        { id: "infoCurriculum", field: "curriculum_name", type: "curriculum" },
        { id: "letterName", field: "letter_name", type: "letter" },
        { id: "infoPermit", field: "permit_name", type: "permit" },
        { id: "proyectName", field: "proyect_name", type: "proyect" }
    ];

    const unavailableText = "No se adjuntó";

    documents.forEach(doc => {
        const element = document.getElementById(doc.id);
        if (!element) return;

        const fieldValue = request[doc.field];

        // Comprueba que el valor exista Y que no sea el string "null"
        if (fieldValue && fieldValue !== "null") {
            element.textContent = fieldValue;
            element.href = `../backend/downloadDocument.php?id=${request.id_request}&type=${doc.type}`;
            
            element.addEventListener("click", (e) => {
                e.preventDefault();
                window.open(element.href, '_blank');
            });
        } else {
            element.textContent = unavailableText;
            element.classList.add("disabled-link");
            element.removeAttribute("href"); 
        }
    });
}