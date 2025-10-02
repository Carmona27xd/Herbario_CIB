document.addEventListener('DOMContentLoaded', function() {
    const nextButtons = document.querySelectorAll('.next-button');

    collector = localStorage.getItem("role");

    if (parseInt(collector) === 3 ) {
        collectorBox = document.getElementById("collectorSelect");
        registerCollectorButton = document.getElementById("registrarColectorBtn");

        if (collectorBox) {
            collectorBox.disabled = true;
        }
             
        if (registerCollectorButton) {
            registerCollectorButton.disabled = true;
        }
        
    }

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
                    "stateSelect": { key: "state", idKey: "idState" },
                    "municipalitySelect": { key: "municipality", idKey: "idMunicipality" },
                    "localitySelect": { key: "locality", idKey: "idLocality" },
                    "collectorSelect": { key: "collector", idKey: "id_collector" },
                    "microhabitatSelect": { key: "microhabitat", idKey: "idMicrohabitat" }
                };
    
                Object.entries(selectMap).forEach(([selectId, { key, idKey }]) => {
                    const select = document.getElementById(selectId);
                    if (select && data[key]) {
                        console.log(`Llenando ${selectId} con datos de ${key}`);
                        select.innerHTML = '<option value="">Seleccionar</option>'; 
    
                        data[key].forEach(item => {
                            let option = document.createElement("option");
                            option.value = item[idKey];
                            option.textContent = key === "collector" ? item.names : item.name;
                            select.appendChild(option);
                        });
                    } else {
                        console.warn(`No se encontró ${key} en los datos o el select ${selectId} no existe.`);
                    }
                });
            })
            .catch(error => console.error("Error cargando los datos:", error));
    }
    
    loadSelectData();

    //Evento del registro de los ejemplares
    document.getElementById('registrarBtn').addEventListener('click', function() {
        console.log('Botón de registrar clickeado'); 

        //Validacion de los campos
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
            { id: 'determinerLastName2Text' },
            { id: 'sizeNumber' },
            { id: 'numberDuplicates' },
            { id: 'specimenImage' },
            { id: 'collectDate' },
            { id: 'collectNumber' },
            { id: 'localNameText' },
            { id: 'fieldBookImage' },
            { id: 'latitudeDegreesNumber' },
            { id: 'latitudeMinutesNumber' },
            { id: 'latitudeSecondsNumber' },
            { id: 'longitudeDegreesNumber' },
            { id: 'longitudeMinutesNumber' },
            { id: 'longitudeSecondsNumber' },
            { id: 'altitudeNumber' },
        ];

        const validateFields = () => {
            let isValid = true;  // Variable para saber si todo es válido
            let invalidFields = []; // Arreglo para almacenar los campos inválidos

            fieldsToValidate.forEach(field => {
                const element = document.getElementById(field.id);

                if (element.tagName === 'SELECT' && !element.value) {
                    element.style.borderColor = 'red';  
                    invalidFields.push(field.id);  
                    isValid = false;  
                } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    if (!element.value.trim()) {  
                        element.style.borderColor = 'red';  
                        invalidFields.push(field.id);  
                        isValid = false;  
                    } else {
                        element.style.borderColor = '';  
                    }
                } else {
                    element.style.borderColor = '';
                }
            });

            if (!isValid) {
                alert("Faltan campos por completar. Por favor, revisa los campos resaltados.");
                return;
            }

            return isValid;
        };

        if (!validateFields()) {
            return;  
        }

        const formData = new FormData(document.getElementById('formularioEjemplar'));

        function convertLatitudeToDecimal(degrees, minutes, seconds) {
            let deg = parseFloat(degrees) || 0;
            let min = parseFloat(minutes) || 0;
            let sec = parseFloat(seconds) || 0;

            let decimal = deg + (min / 60) + (sec / 3600);
            return parseFloat(decimal.toFixed(6)); // Latitud norte (N), siempre positiva
        }

        function convertLongitudeToDecimal(degrees, minutes, seconds) {
            let deg = parseFloat(degrees) || 0;
            let min = parseFloat(minutes) || 0;
            let sec = parseFloat(seconds) || 0;

            let decimal = deg + (min / 60) + (sec / 3600);
            decimal *= -1; // Longitud oeste (W), negativa
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

        //Tab de los datos generales del ejemplar
        formData.append('ejemplarId', document.getElementById('especimenIdText').value);
        formData.append('scientificName', document.getElementById('scientificNameText').value);
        formData.append('family', document.getElementById('familySelect').value);
        formData.append('genre', document.getElementById('genreSelect').value);
        formData.append('species', document.getElementById('specieSelect').value);
        formData.append('biologicalForm', document.getElementById('biologicalFormSelect').value);
        formData.append('typeVegetation', document.getElementById('typeVegetationSelect').value);
        formData.append('soil', document.getElementById('soilSelect').value);
        formData.append('fruit', document.getElementById('fruitSelect').value);
        formData.append('flower', document.getElementById('flowerSelect').value);
        
        //Tab de las caracteristicas del ejemplar
        formData.append('lifeCycle', document.getElementById('lifeCycleNumber').value);
        formData.append('determinerName', document.getElementById('determinerNameText').value);
        formData.append('determinerLastName', document.getElementById('determinerLastNameText').value);
        formData.append('determinerLastName2', document.getElementById('determinerLastName2Text').value); 
        formData.append('size', document.getElementById('sizeNumber').value);
        formData.append('plantClassification', document.getElementById('plantClassificationSelect').value);
        formData.append('associated', document.getElementById('asociatedText').value);
        formData.append('protected', document.getElementById('protectedCheckbox').checked);
        formData.append('abundance', document.getElementById('abundanceSelect').value);
        formData.append('numberDuplicates', document.getElementById('numberDuplicates').value);

        //Tab de otras caracteristicas del ejemplar
        formData.append('environmentalInformation', document.getElementById('environmentalInformationText').value);
        formData.append('otherInformation', document.getElementById('otherInformationText').value);
        formData.append('specimenImage', document.getElementById('specimenImage').files[0]);

        //Tab de la colecta
        formData.append('collectDate', document.getElementById('collectDate').value);
        formData.append('collectNumber', document.getElementById('collectNumber').value);
        formData.append('microhabitat', document.getElementById('microhabitatSelect').value);
        formData.append('localName', document.getElementById('localNameText').value);
        formData.append('collectors', document.getElementById('collectorSelect').value);
        formData.append('fieldBookImage', document.getElementById('fieldBookImage').files[0]);
  
        //Tab de la direccion de la colecta
        formData.append('state', document.getElementById('stateSelect').value);
        formData.append('municipality', document.getElementById('municipalitySelect').value);
        formData.append('locality', document.getElementById('localitySelect').value);
        formData.append('latitudeDegrees', document.getElementById('latitudeDegreesNumber').value);
        formData.append('latitudeMinutes', document.getElementById('latitudeMinutesNumber').value);
        formData.append('latitudeSeconds', document.getElementById('latitudeSecondsNumber').value);
        formData.append('longitudeDegrees', document.getElementById('longitudeDegreesNumber').value);
        formData.append('longitudeMinutes', document.getElementById('longitudeMinutesNumber').value);
        formData.append('longitudeSeconds', document.getElementById('longitudeSecondsNumber').value);
        formData.append('altitude', document.getElementById('altitudeNumber').value);

        //Coordenadas convertidas
        formData.append('latitude', latitudeDecimal);
        formData.append('longitude', longitudeDecimal);

        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }
        
        fetch('../../backend/RegisterSpecimens/servicesPostRegister.php', {
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