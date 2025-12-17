document.addEventListener("DOMContentLoaded", () => {
    const tbody = document.getElementById("requestsBody");
    const filterForm = document.getElementById("filterForm");
    const statusFilter = document.getElementById("statusFilter");
    const requestDetailsModal = document.getElementById('requestDetailsModal');
    
    // Botón de Acción Principal
    const markBtn = document.getElementById('markAsCompleteBtn');
    //Marcar como rechazada
    const markBtnDenied = document.getElementById('markAsDenied');
    
    let currentRequestId = null;

    // 1. Cargar Datos
    async function loadRequests(status) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center p-4">Cargando...</td></tr>`;

        try {
            const response = await fetch(`../backend/getProtectedRequests.php?status=${status}`);
            const result = await response.json();

            tbody.innerHTML = "";

            if (result.success && result.data.length > 0) {
                result.data.forEach(req => {
                    const row = document.createElement("tr");
                    const badgeClass = req.status === 'Atendida' ? 'bg-success' : 'bg-warning text-dark';
                    const fullName = `${req.name} ${req.first_names || ''}`.trim();

                    row.innerHTML = `
                        
                        <td>${req.date}</td>
                        <td>${fullName}</td>
                        <td><span class="badge ${badgeClass}">${req.status}</span></td>
                        <td class="text-center">
                            <button class="btn btn-sm btn-outline-primary btn-details"
                                data-bs-toggle="modal"
                                data-bs-target="#requestDetailsModal"
                                data-id="${req.id_request}"
                                data-date="${req.date}"
                                data-name="${req.name}"
                                data-first-names="${req.first_names || ''}" 
                                data-email="${req.email}"
                                data-specimens="${req.id_specimens}"
                                data-status="${req.status}">
                                <i class="bi bi-eye"></i> Detalles
                            </button>
                        </td>
                    `;
                    tbody.appendChild(row);
                });
            } else {
                tbody.innerHTML = `<tr><td colspan="4" class="text-center p-4 text-muted">No se encontraron solicitudes con estado: <strong>${status}</strong></td></tr>`;
            }

        } catch (error) {
            console.error(error);
            tbody.innerHTML = `<tr><td colspan="4" class="text-center text-danger">Error al cargar datos.</td></tr>`;
        }
    }

    loadRequests(statusFilter.value);

    filterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        loadRequests(statusFilter.value);
    });

    // 2. Configurar Modal
    requestDetailsModal.addEventListener('show.bs.modal', (event) => {
        const btn = event.relatedTarget;
        const id = btn.getAttribute('data-id');
        const date = btn.getAttribute('data-date');
        const name = btn.getAttribute('data-name');
        const firstNames = btn.getAttribute('data-first-names');
        const email = btn.getAttribute('data-email');
        const specimens = btn.getAttribute('data-specimens');
        const status = btn.getAttribute('data-status');

        currentRequestId = id;
        const fullRequesterName = `${name} ${firstNames}`.trim();

        document.getElementById('detailRequestId').textContent = id;
        document.getElementById('detailDate').textContent = date;
        document.getElementById('detailRequesterName').textContent = fullRequesterName;
        document.getElementById('detailRequesterEmail').textContent = email;
        document.getElementById('detailSpecimenIds').textContent = specimens;
        
        const badge = document.getElementById('detailStatusBadge');
        badge.textContent = status;
        badge.className = status === 'Atendida' ? 'badge bg-success' : 'badge bg-warning text-dark';

        // Ocultar botón si ya está atendida
        markBtn.style.display = (status === 'Aceptada' || status === 'Rechazada') ? 'none' : 'inline-block';
        markBtnDenied.style.display = (status === 'Rechazada' || status === 'Aceptada' ) ? 'none' : 'inline-block';
    });

    // 3. Marcar como Atendida
    markBtn.addEventListener('click', async () => {
        if (!confirm("¿Estás seguro de marcar esta solicitud como ACEPTADA?")) return;

        try {
            const response = await fetch('../backend/updateRequestStatus.php', {
                method: 'POST',
                body: JSON.stringify({ id_request: currentRequestId })
            });
            const res = await response.json();

            if (res.success) {
                bootstrap.Modal.getInstance(requestDetailsModal).hide();
                loadRequests(statusFilter.value);
            } else {
                alert("Error: " + res.message);
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión");
        }
    });

    // 3. Marcar como rechazada
    markBtnDenied.addEventListener('click', async () => {
        if (!confirm("¿Estás seguro de marcar esta solicitud como RECHAZADA?")) return;

        try {
            const response = await fetch('../backend/updateRequestStatusDenied.php', {
                method: 'POST',
                body: JSON.stringify({ id_request: currentRequestId })
            });
            const res = await response.json();

            if (res.success) {
                bootstrap.Modal.getInstance(requestDetailsModal).hide();
                loadRequests(statusFilter.value);
            } else {
                alert("Error: " + res.message);
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión");
        }
    });


    // 4. Funcionalidad para abrir documentos
    // Función helper para abrir la ventana
    const openDoc = (type) => {
        if (!currentRequestId) return;
        const url = `../backend/getProtectedRequestDocument.php?id=${currentRequestId}&docType=${type}`;
        window.open(url, '_blank');
    };

    // Listeners para los 6 botones
    document.getElementById('btnDocCompromise').onclick = () => openDoc('compromise');
    document.getElementById('btnDocCV').onclick = () => openDoc('cv');
    document.getElementById('btnDocPermit').onclick = () => openDoc('permit');
    document.getElementById('btnDocProtocol').onclick = () => openDoc('protocol');
    document.getElementById('btnDocRec1').onclick = () => openDoc('rec1');
    document.getElementById('btnDocRec2').onclick = () => openDoc('rec2');
});