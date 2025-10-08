document.addEventListener("DOMContentLoaded", async () => {
    const tbody = document.getElementById("requestsBody");
    const requestDetailsModal = document.getElementById('requestDetailsModal');

    // --- Función para cargar los datos de las solicitudes ---
    async function loadRequests() {
        try {
            const response = await fetch("../backend/getProtectedRequests.php");
            const result = await response.json();

            tbody.innerHTML = "";

            if (result.success && result.data.length > 0) {
                result.data.forEach(request => {
                    const row = document.createElement("tr");

                    row.innerHTML = `
                        <td>${request.id_request}</td>
                        <td>${request.id_specimen}</td>
                        <td>${request.name}</td>
                        <td>
                            <button class="btn btn-info btn-sm" 
                                    data-bs-toggle="modal" 
                                    data-bs-target="#requestDetailsModal"
                                    data-request-id="${request.id_request}"
                                    data-specimen-id="${request.id_specimen}"
                                    data-name="${request.name}"
                                    data-email="${request.email}"
                                    data-description="${request.description}"
                                    data-status="${request.status}">
                                Detalles
                            </button>
                        </td>
                    `;
                    tbody.appendChild(row);
                });
            } else {
                tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No hay solicitudes de acceso.</td></tr>`;
            }

        } catch (error) {
            console.error("Error al cargar las solicitudes:", error);
            tbody.innerHTML = `<tr><td colspan="4" class="text-center text-danger">Error al cargar los datos.</td></tr>`;
        }
    }

    // Carga las solicitudes al inicio
    await loadRequests();

    // --- Manejo del modal de detalles ---
    requestDetailsModal.addEventListener('show.bs.modal', event => {
        const button = event.relatedTarget;
        
        // Extrae los datos de los atributos `data-*` del botón
        const requestId = button.getAttribute('data-request-id');
        const specimenId = button.getAttribute('data-specimen-id');
        const name = button.getAttribute('data-name');
        const email = button.getAttribute('data-email');
        const description = button.getAttribute('data-description');
        const status = button.getAttribute('data-status');

        // Actualiza el contenido del modal con los datos extraídos
        document.getElementById('detailRequestId').textContent = requestId;
        document.getElementById('detailSpecimenId').textContent = specimenId;
        document.getElementById('detailRequesterName').textContent = name;
        document.getElementById('detailRequesterEmail').textContent = email;
        document.getElementById('detailReason').textContent = description;
        document.getElementById('detailStatus').textContent = status;
    });
});