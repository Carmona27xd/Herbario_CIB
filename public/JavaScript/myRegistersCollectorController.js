document.addEventListener("DOMContentLoaded", async () => {
    const tbody = document.getElementById("protectedBody");
    const specimenDetailsModal = document.getElementById('specimenDetailsModal');

    const collectorEmail = localStorage.getItem("email");

    if (!collectorEmail) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center text-danger">No se encontró la sesión del usuario. Por favor, inicia sesión.</td></tr>`;
        return;
    }

    try {
        const response = await fetch(`../backend/getUserSpecimens.php?email=${encodeURIComponent(collectorEmail)}`);
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
            tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted">No has registrado ningún ejemplar aún.</td></tr>`;
        }
    } catch (error) {
        console.error("Error al cargar los registros:", error);
        tbody.innerHTML = `<tr><td colspan="8" class="text-center text-danger">Error al cargar los datos.</td></tr>`;
    }

    // --- Manejo del modal de detalles ---
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

        // Lógica para el botón de la imagen
        const viewImageLink = document.getElementById('viewImageLink');
        const noImageMessage = document.getElementById('noImageMessage');

        if (details.specimenImage) {
            // Asume que la carpeta de imágenes se llama 'images' y está en el mismo nivel que 'JavaScript'
            const imageUrl = `/herbario/${details.specimenImage}`; // Ajusta la ruta si es necesario
            viewImageLink.href = imageUrl;
            viewImageLink.style.display = 'inline-block';
            noImageMessage.style.display = 'none';
        } else {
            viewImageLink.style.display = 'none';
            noImageMessage.style.display = 'block';
        }
    });
});