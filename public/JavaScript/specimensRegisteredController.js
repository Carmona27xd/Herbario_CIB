document.addEventListener("DOMContentLoaded", async () => {
    const tbody = document.getElementById("protectedBody");
    const specimenDetailsModal = document.getElementById('specimenDetailsModal');
    const validateBtn = document.getElementById('validateSpecimenBtn');

    try {
        // La solicitud ya no necesita el correo del localStorage
        const response = await fetch(`../backend/getUnvalidatedSpecimens.php`);
        const result = await response.json();

        tbody.innerHTML = "";

        if (result.success && result.data.length > 0) {
            result.data.forEach(specimen => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${specimen.idSpecimen || "—"}</td>
                    <td>${specimen.associated || "—"}</td>
                    <td>${specimen.size || "—"}</td>
                    <td>${specimen.biologicalFormName || "—"}</td>
                    <td>${specimen.vegetationTypeName || "—"}</td>
                    <td>${specimen.plantClassificationName || "—"}</td>
                    <td>${specimen.environmentalInformation || "—"}</td>
                    <td>
                        <button class="btn btn-info btn-sm" 
                                data-bs-toggle="modal" 
                                data-bs-target="#specimenDetailsModal"
                                data-details='${JSON.stringify(specimen)}'>
                            Detalles
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        } else {
            tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted">No hay ejemplares pendientes de validación.</td></tr>`;
        }
    } catch (error) {
        console.error("Error al cargar los ejemplares:", error);
        tbody.innerHTML = `<tr><td colspan="8" class="text-center text-danger">Error al cargar los datos.</td></tr>`;
    }

    // --- Lógica del modal ---
    specimenDetailsModal.addEventListener('show.bs.modal', event => {
        const button = event.relatedTarget;
        const details = JSON.parse(button.getAttribute('data-details'));

        // Llenar el contenido del modal
        document.getElementById('detailSpecimenId').textContent = details.idSpecimen || '—';
        document.getElementById('detailAssociated').textContent = details.associated || '—';
        document.getElementById('detailSize').textContent = details.size || '—';
        document.getElementById('detailLifeCycle').textContent = details.lifeCycle || '—';
        document.getElementById('detailDuplicates').textContent = details.duplicates || '—';
        document.getElementById('detailSpecimenState').textContent = details.specimenState ? 'Activo' : 'Inactivo';
        document.getElementById('detailProtected').textContent = details.protected ? 'Sí' : 'No';
        document.getElementById('detailValidated').textContent = details.is_validated ? 'Sí' : 'No';
        document.getElementById('detailCollectorEmail').textContent = details.collector_email || '—';

        document.getElementById('detailBiologicalFormName').textContent = details.biologicalFormName || '—';
        document.getElementById('detailVegetationTypeName').textContent = details.vegetationTypeName || '—';
        document.getElementById('detailSoilName').textContent = details.soilName || '—';
        document.getElementById('detailFlowerName').textContent = details.flowerName || '—';
        document.getElementById('detailFruitName').textContent = details.fruitName || '—';
        document.getElementById('detailAbundanceName').textContent = details.abundanceName || '—';
        document.getElementById('detailPlantClassificationName').textContent = details.plantClassificationName || '—';

        document.getElementById('detailAdditionalData').textContent = details.additionalData || '—';
        document.getElementById('detailEnvironmentalInformation').textContent = details.environmentalInformation || '—';

        const viewImageLink = document.getElementById('viewImageLink');
        const noImageMessage = document.getElementById('noImageMessage');

        if (details.specimenImage) {
            const cleanedImagePath = details.specimenImage.startsWith('uploads/') ? details.specimenImage.substring('uploads/'.length) : details.specimenImage;
            const imageUrl = `/herbario/uploads/${cleanedImagePath}`;
            viewImageLink.href = imageUrl;
            viewImageLink.style.display = 'inline-block';
            noImageMessage.style.display = 'none';
        } else {
            viewImageLink.style.display = 'none';
            noImageMessage.style.display = 'block';
        }
        
        // Asignar el ID del ejemplar al botón de validación
        validateBtn.setAttribute('data-specimen-id', details.idSpecimen);
        
        // Ocultar el botón si ya está validado
        if (details.is_validated === 1) {
            validateBtn.style.display = 'none';
        } else {
            validateBtn.style.display = 'inline-block';
        }
    });

    // --- Lógica del botón de validación ---
validateBtn.addEventListener('click', async () => {
    const specimenId = validateBtn.getAttribute('data-specimen-id');

    try {
        const response = await fetch('../backend/validateSpecimen.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idSpecimen: specimenId })
        });

        const result = await response.json();
        
        if (result.success) {
            // **CAMBIO AQUÍ: Ocultamos el modal de detalles y mostramos el de aprobación.**
            // 1. Oculta el modal de los detalles del ejemplar.
            const detailsModalInstance = bootstrap.Modal.getInstance(specimenDetailsModal);
            if (detailsModalInstance) {
                detailsModalInstance.hide();
            }

            // 2. Muestra el modal de "Ejemplar Aprobado".
            const approvalModalElement = document.getElementById('approvalModal');
            const approvalModalInstance = new bootstrap.Modal(approvalModalElement);
            approvalModalInstance.show();

            // Opcional: Recarga la página después de que el modal de aprobación se oculte.
            // Esto asegura que la lista de ejemplares se actualice.
            approvalModalElement.addEventListener('hidden.bs.modal', () => {
                location.reload();
            });

        } else {
            alert("Error al validar el ejemplar: " + result.message);
        }
    } catch (error) {
        console.error("Error al validar el ejemplar:", error);
        alert("Ocurrió un error al validar el ejemplar.");
    }
    });
});