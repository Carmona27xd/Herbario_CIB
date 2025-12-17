document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. CONTROL DE PESTAÑAS Y ROL ---
    const nextButtons = document.querySelectorAll('.next-button');
    let collector = localStorage.getItem("role");

    // Si es Colector (Rol 3), ocultar el select de colectores (se asigna automático en backend o se usa el suyo)
    if (parseInt(collector) === 3 ) {
        let collectorBox = document.getElementById("collectorSelect");
        if (collectorBox) {
            collectorBox.disabled = true;
            collectorBox.style.visibility = 'hidden'; // Ocultar visualmente pero mantener espacio si es necesario
            // O usa .style.display = 'none' si prefieres que no ocupe espacio
        }     
    }

    // Navegación entre pestañas (Tabs)
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentTab = document.querySelector('.nav-link.active');
            let nextTab = currentTab.parentElement.nextElementSibling;
            if (nextTab) {
                const nextTabButton = nextTab.querySelector('.nav-link');
                nextTabButton.click();
            }
        });
    });

    // --- 2. CARGA INICIAL DE DATOS (CATÁLOGOS FIJOS) ---
    function loadSelectData() {
        fetch('../../backend/RegisterSpecimens/servicesFetchRegister.php')
            .then(response => {
                if (!response.ok) throw new Error("Error en la respuesta del servidor");
                return response.json();
            })
            .then(data => {
                if (!data || Object.keys(data).length === 0) return;
    
                // Mapeo de IDs de selects a claves del JSON del backend
                // NOTA: Hemos quitado 'municipalitySelect' y 'localitySelect' de aquí
                // para evitar que se carguen todos al inicio.
                const selectMap = {
                    "genreSelect": { key: "genus", idKey: "idGenus" },
                    "familySelect": { key: "family", idKey: "idFamily" },
                    "specieSelect": { key: "species", idKey: "idSpecies" },
                    "biologicalFormSelect": { key: "biologicalForm", idKey: "idBiologicalForm" },
                    "typeVegetationSelect": { key: "vegetationType", idKey: "idVegetationType" },
                    "soilSelect": { key: "soil", idKey: "idSoil" },
                    "fruitSelect": { key: "fruit", idKey: "idFruit" },
                    "flowerSelect": { key: "flower", idKey: "idFlower" },
                    "plantClassificationSelect": { key: "plantClassification", idKey: "idPlantClassification" },
                    "abundanceSelect": { key: "abundance", idKey: "idAbundance" },
                    "stateSelect": { key: "state", idKey: "idState" }, // Solo cargamos ESTADO aquí
                    "collectorSelect": { key: "collector", idKey: "id_collector" },
                    "microhabitatSelect": { key: "microhabitat", idKey: "idMicrohabitat" }
                };
    
                Object.entries(selectMap).forEach(([selectId, { key, idKey }]) => {
                    const select = document.getElementById(selectId);
                    if (select && data[key]) {
                        select.innerHTML = '<option value="">Seleccionar</option>'; 
                        data[key].forEach(item => {
                            let option = document.createElement("option");
                            option.value = item[idKey];
                            // Manejo especial para el nombre del colector vs nombre de planta
                            option.textContent = key === "collector" ? item.names : item.name;
                            select.appendChild(option);
                        });
                    }
                });
            })
            .catch(error => console.error("Error cargando los datos:", error));
    }
    
    loadSelectData();

    // --- 3. LÓGICA DE CASCADA (ESTADO -> MUNICIPIO -> LOCALIDAD) ---

    const estadoSelect = document.getElementById('stateSelect');
    const municipioSelect = document.getElementById('municipalitySelect');
    const localidadSelect = document.getElementById('localitySelect');

    // Función auxiliar para limpiar selects
    function resetSelect(select, placeholder) {
        select.innerHTML = `<option value="">${placeholder}</option>`;
        select.disabled = true; // Deshabilitar hasta que se carguen datos
    }

    // Inicializar selects dependientes como deshabilitados
    if (municipioSelect) resetSelect(municipioSelect, 'Seleccione un estado primero');
    if (localidadSelect) resetSelect(localidadSelect, 'Seleccione un municipio primero');

    // Al cambiar ESTADO
    if (estadoSelect) {
        estadoSelect.addEventListener('change', () => {
            const idState = estadoSelect.value;
            
            // Limpiar hijos
            resetSelect(municipioSelect, 'Cargando municipios...');
            resetSelect(localidadSelect, 'Seleccione un municipio primero');
    
            if (!idState) return;
    
            fetch('../../backend/ConsultSpecimens/serviceFetchMunicipalities.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idState: idState })
            })
            .then(res => res.json())
            .then(data => {
                municipioSelect.innerHTML = '<option value="">Seleccionar Municipio</option>';
                
                if (data.length > 0) {
                    data.forEach(municipio => {
                        const option = document.createElement('option');
                        option.value = municipio.idMunicipality;
                        option.textContent = municipio.name;
                        municipioSelect.appendChild(option);
                    });
                    municipioSelect.disabled = false; // Habilitar
                } else {
                    municipioSelect.innerHTML = '<option value="">No hay municipios disponibles</option>';
                }
            })
            .catch(err => {
                console.error('Error cargando municipios:', err);
                resetSelect(municipioSelect, 'Error al cargar');
            });
        });
    }

    // Al cambiar MUNICIPIO
    if (municipioSelect) {
        municipioSelect.addEventListener('change', () => {
            const idMunicipality = municipioSelect.value;
            
            // Limpiar hijos
            resetSelect(localidadSelect, 'Cargando localidades...');
    
            if (!idMunicipality) return;
    
            fetch('../../backend/ConsultSpecimens/serviceFetchLocalities.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idMunicipality: idMunicipality })
            })
            .then(res => res.json())
            .then(data => {
                localidadSelect.innerHTML = '<option value="">Seleccionar Localidad</option>';
                
                if (data.length > 0) {
                    data.forEach(localidad => {
                        const option = document.createElement('option');
                        option.value = localidad.idLocality;
                        option.textContent = localidad.name;
                        localidadSelect.appendChild(option);
                    });
                    localidadSelect.disabled = false; // Habilitar
                } else {
                    localidadSelect.innerHTML = '<option value="">No hay localidades disponibles</option>';
                }
            })
            .catch(err => {
                console.error('Error cargando localidades:', err);
                resetSelect(localidadSelect, 'Error al cargar');
            });
        });
    }


    // --- 4. EVENTO REGISTRAR ---
    const registrarBtn = document.getElementById('registrarBtn');
    if (registrarBtn) {
        registrarBtn.addEventListener('click', function() {
            console.log('Botón de registrar clickeado'); 
    
            // Lista de campos a validar
            const fieldsToValidate = [
                { id: 'familySelect' },
                { id: 'plantClassificationSelect' },
                { id: 'abundanceSelect' },
                { id: 'stateSelect' },
                { id: 'municipalitySelect' },
                { id: 'localitySelect' },
                { id: 'especimenIdText' },
                { id: 'scientificNameText' },
                { id: 'lifeCycleNumber' },
                { id: 'determinerNameText' },
                { id: 'determinerLastNameText' },
                // { id: 'determinerLastName2Text' }, // Opcional según tu lógica
                { id: 'sizeNumber' },
                { id: 'numberDuplicates' },
                { id: 'specimenImage' }, // Input file
                { id: 'collectDate' },
                { id: 'collectNumber' },
                { id: 'localNameText' },
                // { id: 'fieldBookImage' }, // Opcional
                { id: 'latitudeDegreesNumber' },
                { id: 'latitudeMinutesNumber' },
                { id: 'latitudeSecondsNumber' },
                { id: 'longitudeDegreesNumber' },
                { id: 'longitudeMinutesNumber' },
                { id: 'longitudeSecondsNumber' },
                { id: 'altitudeNumber' },
            ];
    
            const validateFields = () => {
                let isValid = true;
                let invalidFields = [];
    
                fieldsToValidate.forEach(field => {
                    const element = document.getElementById(field.id);
                    if (!element) return; // Si el elemento no existe, saltar
    
                    if (element.tagName === 'SELECT' && !element.value) {
                        element.style.borderColor = 'red';  
                        invalidFields.push(field.id);  
                        isValid = false;  
                    } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                        // Validación especial para archivos
                        if (element.type === 'file') {
                            if (element.files.length === 0) {
                                element.style.borderColor = 'red';
                                isValid = false;
                            } else {
                                element.style.borderColor = '';
                            }
                        } else {
                            if (!element.value.trim()) {  
                                element.style.borderColor = 'red';  
                                invalidFields.push(field.id);  
                                isValid = false;  
                            } else {
                                element.style.borderColor = '';  
                            }
                        }
                    } else {
                        element.style.borderColor = '';
                    }
                });
    
                if (!isValid) {
                    alert("Faltan campos por completar. Por favor, revisa los campos resaltados en rojo.");
                    return false;
                }
                return true;
            };
    
            if (!validateFields()) return;
    
            // Preparar FormData
            const formData = new FormData(document.getElementById('formularioEjemplar'));
    
            // Funciones de conversión de coordenadas
            function convertLatitudeToDecimal(degrees, minutes, seconds) {
                let deg = parseFloat(degrees) || 0;
                let min = parseFloat(minutes) || 0;
                let sec = parseFloat(seconds) || 0;
                let decimal = deg + (min / 60) + (sec / 3600);
                return parseFloat(decimal.toFixed(6));
            }
    
            function convertLongitudeToDecimal(degrees, minutes, seconds) {
                let deg = parseFloat(degrees) || 0;
                let min = parseFloat(minutes) || 0;
                let sec = parseFloat(seconds) || 0;
                let decimal = deg + (min / 60) + (sec / 3600);
                decimal *= -1; // Longitud Oeste es negativa
                return parseFloat(decimal.toFixed(6));
            }
    
            let latitudeDegrees = document.getElementById('latitudeDegreesNumber').value;
            let latitudeMinutes = document.getElementById('latitudeMinutesNumber').value;
            let latitudeSeconds = document.getElementById('latitudeSecondsNumber').value;
            let longitudeDegrees = document.getElementById('longitudeDegreesNumber').value;
            let longitudeMinutes = document.getElementById('longitudeMinutesNumber').value;
            let longitudeSeconds = document.getElementById('longitudeSecondsNumber').value;
    
            let latitudeDecimal = convertLatitudeToDecimal(latitudeDegrees, latitudeMinutes, latitudeSeconds);
            let longitudeDecimal = convertLongitudeToDecimal(longitudeDegrees, longitudeMinutes, longitudeSeconds);
    
            // Agregar datos manuales al FormData
            formData.append('ejemplarId', document.getElementById('especimenIdText').value);
            formData.append('scientificName', document.getElementById('scientificNameText').value);
            
            // Selects
            formData.append('family', document.getElementById('familySelect').value);
            formData.append('genre', document.getElementById('genreSelect').value);
            formData.append('species', document.getElementById('specieSelect').value);
            formData.append('biologicalForm', document.getElementById('biologicalFormSelect').value);
            formData.append('typeVegetation', document.getElementById('typeVegetationSelect').value);
            formData.append('soil', document.getElementById('soilSelect').value);
            formData.append('fruit', document.getElementById('fruitSelect').value);
            formData.append('flower', document.getElementById('flowerSelect').value);
            formData.append('plantClassification', document.getElementById('plantClassificationSelect').value);
            formData.append('abundance', document.getElementById('abundanceSelect').value);
            
            // Ubicación
            formData.append('state', document.getElementById('stateSelect').value);
            formData.append('municipality', document.getElementById('municipalitySelect').value);
            formData.append('locality', document.getElementById('localitySelect').value);
            formData.append('latitude', latitudeDecimal);
            formData.append('longitude', longitudeDecimal);
    
            // Otros campos
            formData.append('lifeCycle', document.getElementById('lifeCycleNumber').value);
            formData.append('determinerName', document.getElementById('determinerNameText').value);
            formData.append('determinerLastName', document.getElementById('determinerLastNameText').value);
            formData.append('determinerLastName2', document.getElementById('determinerLastName2Text').value);
            formData.append('size', document.getElementById('sizeNumber').value);
            formData.append('associated', document.getElementById('asociatedText').value);
            
            // Checkbox Protegido
            const protectedCheck = document.getElementById('protectedCheckbox');
            formData.append('protected', protectedCheck.checked ? "true" : "false");
    
            formData.append('numberDuplicates', document.getElementById('numberDuplicates').value);
            formData.append('environmentalInformation', document.getElementById('environmentalInformationText').value);
            formData.append('otherInformation', document.getElementById('otherInformationText').value);
            
            // Fechas y Colecta
            formData.append('collectDate', document.getElementById('collectDate').value);
            formData.append('collectNumber', document.getElementById('collectNumber').value);
            formData.append('microhabitat', document.getElementById('microhabitatSelect').value);
            formData.append('localName', document.getElementById('localNameText').value);
            
            // Colector (Si está deshabilitado/oculto, puede que no envíe valor, así que verificamos)
            const collectorSel = document.getElementById('collectorSelect');
            if (collectorSel && !collectorSel.disabled) {
                formData.append('collectors', collectorSel.value);
            } else {
                // Si soy colector, el backend probablemente usará mi ID de sesión, 
                // o puedo enviarlo aquí si lo tengo en localStorage
                // formData.append('collectors', localStorage.getItem('userId')); 
            }
    
            // Coordenadas GMS originales
            formData.append('latitudeDegrees', latitudeDegrees);
            formData.append('latitudeMinutes', latitudeMinutes);
            formData.append('latitudeSeconds', latitudeSeconds);
            formData.append('longitudeDegrees', longitudeDegrees);
            formData.append('longitudeMinutes', longitudeMinutes);
            formData.append('longitudeSeconds', longitudeSeconds);
            formData.append('altitude', document.getElementById('altitudeNumber').value);
    
            // Archivos
            const imgFile = document.getElementById('specimenImage');
            if (imgFile.files.length > 0) {
                formData.append('specimenImage', imgFile.files[0]);
            }
            const bookFile = document.getElementById('fieldBookImage');
            if (bookFile && bookFile.files.length > 0) {
                formData.append('fieldBookImage', bookFile.files[0]);
            }
    
            // Datos de sesión / Rol
            let email = localStorage.getItem('email');
            let validated;
            let roleAux = localStorage.getItem('role');
    
            if (parseInt(roleAux) === 3) { // Colector
                formData.append('email', email);
                validated = 0;
                formData.append('validated', validated);
            }
    
            if (parseInt(roleAux) === 2) { // Admin
                formData.append('email', email);
                validated = 1;
                formData.append('validated', validated);
            }
            
            // Enviar al backend
            fetch('../../backend/RegisterSpecimens/servicesPostRegister.php', {
                method: 'POST',
                body: formData,
            })
            .then(response => {
                if (!response.ok) throw new Error("Error en la respuesta del servidor");
                return response.json();
            })
            .then(data => {
                console.log(data); 
                if (data.success) {
                    const successModal = new bootstrap.Modal(document.getElementById("successfulRegistration"));
                    successModal.show();
                } else {
                    alert("Error: " + (data.error || data.message)); 
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }
});

// --- 5. REDIRECCIÓN TRAS ÉXITO ---
// (Fuera del DOMContentLoaded para asegurar que el evento se registre si el botón existe estáticamente)
const successBtn = document.getElementById("successfulButton");
if (successBtn) {
    successBtn.addEventListener("click", function () {
        let roleAux = localStorage.getItem('role');
        if (parseInt(roleAux) === 3) {
            window.location.href = "../dashBoardCollector.html";
        } else if (parseInt(roleAux) === 2) {
            window.location.href = "../dashBoardAdmin.html";
        }
    });
}