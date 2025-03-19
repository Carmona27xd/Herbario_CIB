document.addEventListener('DOMContentLoaded', function() {
    const nextButtons = document.querySelectorAll('.next-button');

    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentTab = document.querySelector('.nav-link.active');
            const currentTabId = currentTab.getAttribute('id');
            
            let nextTab = currentTab.parentElement.nextElementSibling;

            if (nextTab) {
                const nextTabButton = nextTab.querySelector('.nav-link');
                nextTabButton.click();
            }
        });
    });

    // Llenar los combo box con los datos desde el PHP
    function loadSelectData() {
        fetch('../../backend/RegisterSpecimens/servicesFetchRegister.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error en la respuesta del servidor");
                }
                return response.json();
            })
            .then(data => {
                if (!data || Object.keys(data).length === 0) {
                    console.error("El servidor no devolvió datos o la respuesta está vacía.");
                    return;
                }

                console.log("Datos recibidos del servidor:", data);

                const selectMap = {
                    "genreSelect": { key: "genero", idKey: "idGenero" },
                    "familySelect": { key: "familia", idKey: "idFamilia" },
                    "specieSelect": { key: "especie", idKey: "idEspecie" },
                    "biologicalFormSelect": { key: "formabiologica", idKey: "idFormaBiologica" },
                    "typeVegetationSelect": { key: "tipovegetacion", idKey: "idTipoVegetacion" },
                    "soilSelect": { key: "suelo", idKey: "idSuelo" },
                    "fruitSelect": { key: "fruto", idKey: "idFruto" },
                    "flowerSelect": { key: "flor", idKey: "idFlor" },
                    "plantClassificationSelect": { key: "clasificacionplanta", idKey: "idClasificacionPlanta" },
                    "abundanceSelect": { key: "abundancia", idKey: "idAbundancia" },
                    "stateSelect": { key: "estado", idKey: "idEstado" },
                    "municipalitySelect": { key: "municipio", idKey: "idMunicipio" },
                    "localitySelect": { key: "localidad", idKey: "idLocalidad" },
                    "collectorSelect": { key: "colector", idKey: "idColector" },
                    "microhabitatSelect": { key: "microhabitat", idKey: "idMicroHabitat" }
                };

                Object.entries(selectMap).forEach(([selectId, { key, idKey }]) => {
                    const select = document.getElementById(selectId);
                    if (select && data[key]) {
                        console.log(`Llenando ${selectId} con datos de ${key}`);
                        select.innerHTML = '<option value="">Seleccionar</option>'; // Opciones predeterminadas

                        data[key].forEach(item => {
                            let option = document.createElement("option");
                            option.value = item[idKey];
                            option.textContent = item.nombre;
                            select.appendChild(option);
                        });
                    } else {
                        console.warn(`No se encontró ${key} en los datos o el select ${selectId} no existe.`);
                    }
                });
            })
            .catch(error => console.error("Error cargando los datos:", error));
    }

    // Llamar a la función para cargar los datos
    loadSelectData();

    //Evento del registro de los ejemplares
    document.getElementById('registrarBtn').addEventListener('click', function() {
        console.log('Botón de registrar clickeado'); 
    
        //Creacion del objeto Form Data
        const formData = new FormData(document.getElementById('formularioEjemplar'));

        formData.append('scientificName', document.getElementById('scientificNameText').value);
        formData.append('family', document.getElementById('familySelect').value);
        formData.append('genre', document.getElementById('genreSelect').value);
        formData.append('species', document.getElementById('specieSelect').value);
        formData.append('biologicalForm', document.getElementById('biologicalFormSelect').value);
        formData.append('typeVegetation', document.getElementById('typeVegetationSelect').value);
        formData.append('soil', document.getElementById('soilSelect').value);
        formData.append('fruit', document.getElementById('fruitSelect').value);
        formData.append('flower', document.getElementById('flowerSelect').value);
        formData.append('associated', document.getElementById('associatedText').value);

        formData.append('lifeCycle', document.getElementById('lifeCycleText').value);
        formData.append('determinerName', document.getElementById('determinerNameText').value);
        formData.append('localName', document.getElementById('localNameText').value);
        formData.append('size', document.getElementById('sizeText').value);
        formData.append('numberDuplicates', document.getElementById('numberDuplicatesText').value);
        formData.append('plantClassification', document.getElementById('plantClassificationSelect').value);
        formData.append('abundance', document.getElementById('abundanceSelect').value);
        formData.append('protected', document.getElementById('protectedCheckbox').checked);
        formData.append('otherInformation', document.getElementById('otherInformationText').value);
        formData.append('specimenImage', document.getElementById('specimenImage').files[0]);

        formData.append('collectDate', document.getElementById('collectDate').value);
        formData.append('collectNumber', document.getElementById('collectNumberText').value);
        formData.append('state', document.getElementById('stateSelect').value);
        formData.append('municipality', document.getElementById('municipalitySelect').value);
        formData.append('locality', document.getElementById('localitySelect').value);
        formData.append('latitude', document.getElementById('latitudeText').value);
        formData.append('longitude', document.getElementById('longitudeText').value);
        formData.append('altitude', document.getElementById('altitudeText').value);
        formData.append('collectors', document.getElementById('collectorSelect').value);
        formData.append('fieldBookImage', document.getElementById('fieldBookImage').files[0]);
        formData.append('microhabitat', document.getElementById('microhabitatSelect').value);

        fetch('http://localhost/SCEPIB_UV/backend/RegisterSpecimens/servicesPostRegister.php', {
            method: 'POST',
            body: formData,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la respuesta del servidor");
            }
            return response.json();
        })
        .then(data => {
            console.log(data); 
            if (data.success) {
                alert(data.message); 
            } else {
                alert("Error: " + data.error); 
            }
        })
        .catch(error => console.error('Error:', error));
    });
});