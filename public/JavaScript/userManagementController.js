document.addEventListener("DOMContentLoaded", function() {

    const filterForm = document.getElementById('filterForm');
    const userTypeSelect = document.getElementById('userTypeSelect');
    const tableBody = document.getElementById('userBody');
    
    // Referencia al modal y al nuevo botón
    const userModal = new bootstrap.Modal(document.getElementById('userDetailsModal'));
    const disableUserBtn = document.getElementById('disableUserBtn');
    
    // Variable para guardar el ID del usuario que estamos viendo
    let currentUserId = null;

    // 1. Event Listener para el formulario de consulta (sin cambios)
    filterForm.addEventListener('submit', async function(event) {
        event.preventDefault(); 
        
        const userType = userTypeSelect.value;
        let role_id;
        switch (userType) {
            case 'comite': role_id = 4; break;
            case 'colectores': role_id = 3; break;
            case 'publico': role_id = 1; break;
            default: return;
        }

        tableBody.innerHTML = `<tr><td colspan="6" class="text-center">Consultando...</td></tr>`;
        await fetchAndDisplayUsers(role_id, userType);
    });

    // 2. Función para hacer el Fetch al PHP (sin cambios)
    async function fetchAndDisplayUsers(role_id, userType) {
        try {
            const response = await fetch(`../backend/getUsers.php?role_id=${role_id}`);
            if (!response.ok) throw new Error(`Error de red: ${response.statusText}`);
            const data = await response.json();
            
            tableBody.innerHTML = ''; // Limpia la tabla

            if (data.success && data.users.length > 0) {
                data.users.forEach(user => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${user.id}</td>
                        <td>${user.name || 'N/A'}</td>
                        <td>${user.first_surname || 'N/A'}</td>
                        <td>${user.second_surname || 'N/A'}</td>
                        <td>${user.email}</td>
                        <td>
                            <button class="btn btn-info btn-sm btn-details" 
                                    data-bs-toggle="modal" 
                                    data-bs-target="#userDetailsModal"
                                    data-id="${user.id}"
                                    data-name="${user.name}"
                                    data-paterno="${user.first_surname}"
                                    data-materno="${user.second_surname}"
                                    data-email="${user.email}"
                                    data-role="${userType}">
                                Detalles
                            </button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            } else if (data.success && data.users.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="6" class="text-center">No se encontraron usuarios para este rol.</td></tr>`;
            } else {
                tableBody.innerHTML = `<tr><td colspan="6" class="text-center">Error: ${data.message}</td></tr>`;
            }
        } catch (error) {
            console.error('Error en fetchAndDisplayUsers:', error);
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center">Error al conectar con el servidor.</td></tr>`;
        }
    }

    // 3. Event Listener para los botones "Detalles" (ACTUALIZADO)
    tableBody.addEventListener('click', function(event) {
        if (event.target.classList.contains('btn-details')) {
            const button = event.target;
            
            // --- ¡NUEVO! Guarda el ID del usuario ---
            currentUserId = button.dataset.id; // Guarda el ID para el botón "Deshabilitar"
            
            const name = button.dataset.name;
            const paterno = button.dataset.paterno;
            const materno = button.dataset.materno;
            const email = button.dataset.email;
            const role = button.dataset.role;

            let roleText;
            switch (role) {
                case 'comite': roleText = 'Comite'; break;
                case 'colectores': roleText = 'Colector'; break;
                case 'publico': roleText = 'Publico General'; break;
                default: roleText = 'Desconocido';
            }

            // Rellena el modal
            document.getElementById('detailUserId').textContent = currentUserId; // Usa la variable guardada
            document.getElementById('detailUserName').textContent = name || 'N/A';
            document.getElementById('detailUserPaterno').textContent = paterno || 'N/A';
            document.getElementById('detailUserMaterno').textContent = materno || 'N/A';
            document.getElementById('detailUserEmail').textContent = email;
            document.getElementById('detailUserRole').textContent = roleText;
        }
    });

    // 4. --- ¡NUEVA LÓGICA! ---
    // Event Listener para el botón "Deshabilitar" en el modal
    disableUserBtn.addEventListener('click', async function() {
        if (!currentUserId) {
            alert("Error: No se ha seleccionado ningún usuario.");
            return;
        }

        // Pide confirmación antes de deshabilitar
        const confirmed = confirm(`¿Estás seguro de que deseas deshabilitar al usuario con ID ${currentUserId}? Esta acción es irreversible desde esta interfaz.`);
        
        if (confirmed) {
            try {
                // Llama al nuevo script PHP
                const response = await fetch('../backend/disableUser.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ user_id: currentUserId })
                });

                const data = await response.json();

                if (data.success) {
                    alert(data.message);
                    userModal.hide(); // Oculta el modal
                    
                    // Refresca la tabla para que el usuario desaparezca de la lista
                    // (Simula un nuevo clic en el botón "Consultar")
                    filterForm.dispatchEvent(new Event('submit'));
                } else {
                    alert(`Error: ${data.message}`);
                }

            } catch (error) {
                console.error('Error al deshabilitar usuario:', error);
                alert("Error de conexión al intentar deshabilitar el usuario.");
            }
        }
    });

    // Mensaje inicial
    tableBody.innerHTML = `<tr><td colspan="6" class="text-center">Seleccione un tipo de usuario y presione "Consultar".</td></tr>`;
});