document.addEventListener("DOMContentLoaded", async () => {
    const tbody = document.getElementById("requestsCollectorTableBody");

    // --- FUNCIÓN 1: Cargar datos del Backend ---
    try {
        // Asegúrate que la ruta al PHP sea correcta desde donde está este HTML
        const response = await fetch("../backend/adminRequestsCollector.php"); 
        const result = await response.json();

        tbody.innerHTML = ""; // Limpiar spinner de carga

        if (result.success && result.data.length > 0) {
            result.data.forEach(request => {
                const row = document.createElement("tr");

                // 1. Concatenar Nombre Completo
                // (Usamos trim() para quitar espacios si no hay segundo apellido)
                const nombreCompleto = `${request.name} ${request.first_surname} ${request.second_surname || ''}`.trim();

                // 2. Definir Color del Estado (Badge)
                let badgeClass = 'bg-secondary'; // Por defecto
                if (request.status === 'Pendiente') {
                    badgeClass = 'bg-warning text-dark';
                } else if (request.status === 'Aceptada') {
                    badgeClass = 'bg-success';
                } else if (request.status === 'Rechazada') {
                    badgeClass = 'bg-danger';
                }

                // 3. Construir HTML de la fila
                // IMPORTANTE: Guardamos TODOS los datos en los atributos data-* del botón
                // aunque no se muestren en la tabla, para usarlos en "Detalles".
                row.innerHTML = `
                    <td class="ps-4">${request.created_at}</td>
                    <td class="fw-bold text-secondary">${nombreCompleto}</td>
                    <td><span class="badge ${badgeClass} rounded-pill">${request.status}</span></td>
                    <td class="text-center">
                        <button class="btn btn-custom-details btn-sm btn-detalles shadow-sm" 
                            data-id="${request.id_request}"
                            data-name="${request.name}"
                            data-first-surname="${request.first_surname}"
                            data-second-surname="${request.second_surname}"
                            data-email="${request.email}"
                            data-curriculum-name="${request.curriculum_name}"
                            data-letter-name="${request.letter_name}"
                            data-permit-name="${request.permit_name}"
                            data-proyect-name="${request.proyect_name}"
                            data-ref-email="${request.ref_email}"
                            data-ref-first-surname="${request.ref_first_surname}"
                            data-ref-name="${request.ref_name}"
                            data-ref-second-surname="${request.ref_second_surname}"
                            data-date="${request.created_at}"
                            data-status="${request.status}"> 
                            <i class="bi bi-eye-fill me-1"></i> Detalles
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        } else {
            tbody.innerHTML = `<tr><td colspan="4" class="text-center p-4 text-muted">No se encontraron solicitudes.</td></tr>`;
        }
    } catch (error) {
        console.error("Error cargando solicitudes:", error);
        tbody.innerHTML = `<tr><td colspan="4" class="text-center p-4 text-danger"><i class="bi bi-exclamation-triangle"></i> Error al cargar los datos.</td></tr>`;
    }

    // --- FUNCIÓN 2: Manejar clic en "Detalles" ---
    tbody.addEventListener('click', event => {
        // Usamos .closest() para que funcione el clic aunque toques el ícono <i>
        const button = event.target.closest('.btn-detalles');
        
        if (button) {
            // Recopilar todos los datos guardados en el botón
            const requestData = {
                id_request: button.dataset.id,
                name: button.dataset.name,
                first_surname: button.dataset.firstSurname,
                second_surname: button.dataset.secondSurname,
                email: button.dataset.email,
                curriculum_name: button.dataset.curriculumName,
                letter_name: button.dataset.letterName,
                permit_name: button.dataset.permitName,
                proyect_name: button.dataset.proyectName,
                ref_email: button.dataset.refEmail,
                ref_first_surname: button.dataset.refFirstSurname,
                ref_name: button.dataset.refName,
                ref_second_surname: button.dataset.refSecondSurname,
                created_at: button.dataset.date,
                status: button.dataset.status
            };

            // Guardar en LocalStorage
            localStorage.setItem("selectedRequest", JSON.stringify(requestData));
            
            // Redirigir a la página de detalles
            window.location.href = 'applicationCollectorDetails.html';
        }
    });
});