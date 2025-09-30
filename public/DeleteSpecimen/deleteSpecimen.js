document.addEventListener('DOMContentLoaded', () => {
    const tablaBody = document.getElementById('tabla-body');
    const searchInput = document.getElementById('search-input');
    const btnActualizar = document.getElementById('btnActualizarTabla');

    // Función para cargar la tabla
    function cargarTabla(filtro = '') {
        // Ruta al servicio que obtiene los ejemplares
        fetch(`../backend/ConsultSpecimen/servicesFetchConsultSpecimens.php?search=${encodeURIComponent(filtro)}`)
            .then(res => res.json())
            .then(data => {
                tablaBody.innerHTML = '';

                if (data.length === 0) {
                    tablaBody.innerHTML = `<tr><td colspan="5">No hay ejemplares</td></tr>`;
                    return;
                }

                data.forEach(ejemplar => {
                    const fila = document.createElement('tr');
                    fila.innerHTML = `
                        <td>${ejemplar.id_specimen}</td>
                        <td>${ejemplar.scientific_name || '-'}</td>
                        <td>${ejemplar.classification || '-'}</td>
                        <td>${ejemplar.abundance || '-'}</td>
                        <td>
                            <button class="btn btn-danger btn-sm btn-eliminar" data-id="${ejemplar.id_specimen}">
                                Eliminar
                            </button>
                        </td>
                    `;
                    tablaBody.appendChild(fila);
                });
            })
            .catch(err => console.error('Error al cargar tabla:', err));
    }

    // Función para eliminar ejemplar
    function eliminarEjemplar(id) {
        if (!confirm("¿Seguro que quieres marcar como eliminado este ejemplar?")) return;

        // Ruta al servicio que elimina el ejemplar
        fetch('../backend/DeleteSpecimen/serviceDeleteSpecimen.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_specimen: id })
        })
        .then(res => res.json())
        .then(resp => {
            if (resp.success) {
                alert('Ejemplar marcado como eliminado.');
                cargarTabla(searchInput.value);
            } else {
                alert('Error: ' + (resp.message || 'No se pudo eliminar'));
            }
        })
        .catch(err => console.error('Error al eliminar:', err));
    }

    // Delegación de eventos para botones eliminar
    tablaBody.addEventListener('click', e => {
        if (e.target.classList.contains('btn-eliminar')) {
            const id = e.target.getAttribute('data-id');
            eliminarEjemplar(id);
        }
    });

    // Filtro de búsqueda
    searchInput.addEventListener('input', () => {
        cargarTabla(searchInput.value);
    });

    // Botón de actualizar
    btnActualizar.addEventListener('click', () => {
        cargarTabla(searchInput.value);
    });

    // Cargar tabla al inicio
    cargarTabla();
});