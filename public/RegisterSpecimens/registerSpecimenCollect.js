//A revisar, el modelo de datos no contiene datos de los municipios, quizas acceder a una API externa

document.addEventListener("DOMContentLoaded", function () {
    // Llamada para obtener los datos de los combo box
    fetch('../../backend/RegisterSpecimens/servicesFetchCollect.php')
        .then(response => response.json())
        .then(data => {
            if (!data) {
                console.error("No se recibieron datos válidos del servidor.");
                return;
            }

            // Mapeo de selectores con la propiedad necesarias
            const selectMap = {
                "stateSelect": { key: "estado", idKey: "idEstado" },
                "collectorSelect": { key: "colector", idKey: "idColector" },
                "municipalitySelect": { key: "municipio", idKey: "idMunicipio" },
                "countrySelect": { key: "pais", idKey: "idPais" },
                "typeVegetationSelect": { key: "tipovegetacion", idKey: "idTipoVegetacion" },
                "localitySelect": { key: "localidad", idKey: "idLocalidad" },
            };

            // Llenar los combo boxes con los datos correspondientes
            Object.entries(selectMap).forEach(([selectId, { key, idKey }]) => {
                const select = document.getElementById(selectId);
                if (select && data[key]) {
                    console.log(`Llenando ${selectId} con datos de ${key}`); 
                    select.innerHTML = '<option value="">Seleccionar</option>'; 

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

    // Validacion y paso a la siguiente página
    document.getElementById('nextButton').addEventListener('click', function (event) {
        event.preventDefault();
        const fieldsValid = validateFields();
        const selectsValid = validateSelects();

        if (fieldsValid && selectsValid) {
            alert("Se ha registrado correctamente");
        } else {
            alert("Por favor complete todos los campos obligatorios.");
        }
    });

    // Funcion para la validacion de los campos obligatorios
    function validateFields() {
        let isValid = true;
        const requiredFields = ['scientificName', 'specimenID', 'localName', 'determine', 'size'];

        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('is-invalid'); 
            } else {
                field.classList.remove('is-invalid'); 
            }
        });

        return isValid;
    }

    // Funcion para la validacion de los combo box obligatorios
    function validateSelects() {
        let isValid = true;
        const requiredSelects = ['genreSelect', 'speciesSelect', 'familySelect', 'biologicalFormSelect', 'typeVegetationSelect', 'soilSelect'];

        requiredSelects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (!select.value) {
                isValid = false;
                select.classList.add('is-invalid');
            } else {
                select.classList.remove('is-invalid');
            }
        });

        return isValid;
    }

    // Funcion para la carga de la imagen
    window.previewImage = function(event) {
        const input = event.target;
        const preview = document.getElementById('preview');

        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.src = e.target.result;
            };
            reader.readAsDataURL(input.files[0]);
        }
    };
});