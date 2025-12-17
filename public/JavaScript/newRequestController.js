document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Verificar que hay IDs de especímenes seleccionados
    const specimensIds = localStorage.getItem('idForAccess');
    if (!specimensIds) {
        alert("No hay ejemplares seleccionados. Por favor, vuelve al dashboard y selecciona los ejemplares.");
        window.location.href = "dashboardResearcher.html"; // Redirige si no hay IDs
        return;
    }

    // 2. Mejora de UX: Mostrar nombre del archivo al seleccionarlo
    // Seleccionamos todos los inputs de tipo file dentro de las zonas de carga
    const fileInputs = document.querySelectorAll('.file-upload-zone input[type="file"]');
    
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const label = this.parentElement; // La etiqueta <label> contenedora
            const span = label.querySelector('span'); // El texto dentro del label
            
            if (this.files && this.files.length > 0) {
                // Cambiar estilo para indicar éxito
                label.style.borderColor = "#28a745";
                label.style.backgroundColor = "#e6f9e9";
                // Mostrar nombre del archivo (truncado si es muy largo)
                let fileName = this.files[0].name;
                if (fileName.length > 20) fileName = fileName.substring(0, 20) + '...';
                span.textContent = fileName;
                span.style.color = "#28a745";
            } else {
                // Restaurar estilo original si cancelan
                label.style.borderColor = "#ccc";
                label.style.backgroundColor = "#f8f9fa";
                span.textContent = getOriginalLabelText(this.id);
                span.style.color = "#495057";
            }
        });
    });

    // 3. Manejo del Envío del Formulario
    const form = document.getElementById("accessRequestForm");
    
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // --- VALIDACIONES ---

        // A. Validar Archivos (Todos son obligatorios y deben ser PDF)
        const fileFields = [
            { id: "fileCartaCompromiso", name: "Carta Compromiso" },
            { id: "fileCV", name: "Curriculum Vitae" },
            { id: "filePermiso", name: "Permiso de Colecta" },
            { id: "fileRecomendacion1", name: "Carta Recomendación 1" },
            { id: "fileRecomendacion2", name: "Carta Recomendación 2" },
            { id: "fileProtocolo", name: "Protocolo" }
        ];

        for (const field of fileFields) {
            const input = document.getElementById(field.id);
            if (input.files.length === 0) {
                alert(`Falta adjuntar: ${field.name}`);
                return;
            }
            if (input.files[0].type !== "application/pdf") {
                alert(`El archivo ${field.name} debe ser formato PDF.`);
                return;
            }
        }

        // B. Obtener datos de Referencias (Estáticas)
        // Asumimos que hay 2 tarjetas de referencia en el orden del HTML
        const refCards = document.querySelectorAll('.reference-card');
        if (refCards.length < 2) {
            alert("Error en el formulario: Faltan secciones de referencia.");
            return;
        }

        // Función helper para sacar valor de inputs dentro de una tarjeta
        const getRefData = (cardIndex) => {
            const inputs = refCards[cardIndex].querySelectorAll('input');
            // Orden en HTML: [0]Nombre, [1]Correo, [2]Teléfono
            return {
                name: inputs[0].value.trim(),
                email: inputs[1].value.trim(),
                phone: inputs[2].value.trim()
            };
        };

        const ref1 = getRefData(0);
        const ref2 = getRefData(1);

        // Validar que las referencias no estén vacías
        if (!ref1.name || !ref1.email || !ref1.phone || !ref2.name || !ref2.email || !ref2.phone) {
            alert("Por favor completa todos los campos de las referencias personales.");
            return;
        }

        // --- PREPARAR FORMDATA ---
        const formData = new FormData();

        // Datos principales
        // Nota: Los names de los inputs principales ('nombre', 'apellidos', 'correo') se toman automáticos
        // si el form los tiene, pero es más seguro agregarlos manualmente para coincidir con tu BD.
        const mainInputs = form.querySelectorAll('.row.g-3.mb-5 input');
        
        formData.append("id_specimens", JSON.parse(specimensIds).join(',')); // Convertimos array a string "1,2,5"
        formData.append("name", mainInputs[0].value.trim()); // Nombre
        formData.append("first_names", mainInputs[1].value.trim()); // Apellidos (Mapeado a first_names en tu BD)
        formData.append("email", mainInputs[2].value.trim()); // Correo (No está en tu tabla SQL, pero es necesario)

        // Archivos (BLOBs) y Nombres
        fileFields.forEach(field => {
            const file = document.getElementById(field.id).files[0];
            formData.append(getDbBlobName(field.id), file); // El archivo binario
            formData.append(getDbNameField(field.id), file.name); // El nombre del archivo
        });

        // Referencias
        formData.append("reference_one_name", ref1.name);
        formData.append("reference_one_email", ref1.email);
        formData.append("reference_one_phone", ref1.phone);
        
        formData.append("reference_two_name", ref2.name);
        formData.append("reference_two_email", ref2.email);
        formData.append("reference_two_phone", ref2.phone);

        // Datos extra
        formData.append("status", "Pendiente");
        // La fecha se pone automática en la BD (TIMESTAMP), no hace falta enviarla

        // --- ENVIAR AL SERVER ---
        const submitBtn = document.querySelector('.btn-submit');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';

        try {
            const response = await fetch('../backend/registerNewProtectedRequest.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                alert("¡Solicitud enviada con éxito! Se te notificará por correo.");
                // Limpiar localStorage
                localStorage.removeItem('idsForAccessRequest');
                // Redirigir
                window.location.href = "ConsultSpecimen/consultSpecimen.html";
            } else {
                alert("Error al registrar: " + (result.message || "Error desconocido"));
            }

        } catch (error) {
            console.error("Error:", error);
            alert("Hubo un error de conexión al intentar enviar la solicitud.");
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
});

// --- FUNCIONES AUXILIARES ---

// Mapea el ID del input HTML al nombre de la columna BLOB en tu BD
function getDbBlobName(inputId) {
    const map = {
        'fileCartaCompromiso': 'compromise_letter',
        'fileCV': 'cv',
        'filePermiso': 'collect_permit',
        'fileRecomendacion1': 'letter_recommendation',
        'fileRecomendacion2': 'letter_recommendation_two',
        'fileProtocolo': 'protocol'
    };
    return map[inputId];
}

// Mapea el ID del input HTML al nombre de la columna NOMBRE ARCHIVO en tu BD
function getDbNameField(inputId) {
    const map = {
        'fileCartaCompromiso': 'compromise_letter_name',
        'fileCV': 'cv_name',
        'filePermiso': 'collect_permit_name',
        'fileRecomendacion1': 'letter_recommendation_name',
        'fileRecomendacion2': 'letter_recommendation_two_name',
        'fileProtocolo': 'protocol_name'
    };
    return map[inputId];
}

// Helper para restaurar el texto original del label si se cancela la selección
function getOriginalLabelText(inputId) {
    const map = {
        'fileCartaCompromiso': 'Carta compromiso',
        'fileCV': 'CV',
        'filePermiso': 'Permiso colecta',
        'fileRecomendacion1': 'Carta de recomendación',
        'fileRecomendacion2': 'Carta de recomendación',
        'fileProtocolo': 'Protocolo o proyecto'
    };
    return map[inputId];
}