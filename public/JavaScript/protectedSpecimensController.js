document.addEventListener("DOMContentLoaded", async () => {
    const tbody = document.getElementById("protectedBody");

    try {
        const response = await fetch("../backend/getProtectedSpecimens.php");
        const result = await response.json();

        tbody.innerHTML = "";

        if (result.success && result.data.length > 0) {
            result.data.forEach(specimen => {
                const row = document.createElement("tr");

                // --- MODIFICACIÓN AQUÍ ---
                // Agrega el <td> para la columna de Acciones con el botón
                row.innerHTML = `
                    <td>${specimen.idSpecimen}</td>
                    <td>${specimen.associated || "—"}</td>
                    <td>${specimen.size || "—"}</td>
                    <td>${specimen.biologicalForm || "—"}</td>
                    <td>${specimen.vegetationType || "—"}</td>
                    <td>${specimen.plantClassification || "—"}</td>
                    <td>${specimen.environmentalInformation || "—"}</td>
                    <td>
                        <button class="btn btn-primary btn-sm" 
                                data-bs-toggle="modal" 
                                data-bs-target="#accessRequestModal"
                                data-specimen-id="${specimen.idSpecimen}">
                            Solicitar Acceso
                        </button>
                    </td>
                `;
                // --- FIN DE LA MODIFICACIÓN ---

                tbody.appendChild(row);
            });
        } else {
            tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted">No hay ejemplares protegidos registrados.</td></tr>`;
        }

    } catch (error) {
        console.error("Error cargando ejemplares:", error);
        tbody.innerHTML = `<tr><td colspan="8" class="text-center text-danger">Error al cargar los datos.</td></tr>`;
    }

    // El resto del código que manejas para la selección de fila y el modal
    // es correcto y no necesita ser modificado.

    const accessRequestModal = document.getElementById('accessRequestModal');
    accessRequestModal.addEventListener('show.bs.modal', event => {
    // Obtiene el botón que activó el modal
        const button = event.relatedTarget;
        // Extrae el ID del botón usando el atributo data-specimen-id
        const specimenId = button.getAttribute('data-specimen-id');
        
        // Actualiza el campo oculto del formulario con el ID
        const modalInput = accessRequestModal.querySelector('#specimenId');
        modalInput.value = specimenId;
    });
});

document.getElementById("requestForm").addEventListener("submit", async function (event) {

    let statusAux = "Sin atender";

    const newRequest = {
        idSpecimen: document.getElementById("specimenId").value.trim(),
        name: document.getElementById("requesterName").value.trim(),
        email: document.getElementById("requesterEmail").value.trim(),
        description: document.getElementById("reason").value.trim(),
        status: statusAux
    };

    try {
        const requestFormData = new FormData();
        requestFormData.append("idSpecimen", newRequest.idSpecimen);
        requestFormData.append("name", newRequest.name);
        requestFormData.append("email", newRequest.email);
        requestFormData.append("description", newRequest.description);
        requestFormData.append("status", newRequest.status);

        const response = await fetch("../backend/registerRequestProtected.php", {
            method: "POST",
            body: requestFormData
        });

        const data = await response.json();
        if (data.success) {
            alert("Solicitud de acceso enviada");
        }
    } catch (error) {
        console.error("Error en php: ", error);
    }

});

