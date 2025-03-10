document.addEventListener("DOMContentLoaded", function () {
    fetch('../../backend/RegisterSpecimens/servicesFetchRegister.php')
        .then(response => response.json())
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
                "flowerSelect": { key: "flor", idKey: "idFlor" }
            };

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

    document.getElementById('nextButton').addEventListener('click', function (event) {
        event.preventDefault();
        const fieldsValid = validateFields();
        const selectsValid = validateSelects();

        if (fieldsValid && selectsValid) {
            window.location.href = "registerSpecimenCollect.html";
        } else {
            alert("Por favor complete todos los campos obligatorios.");
        }
    });

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

    function validateSelects() {
        let isValid = true;
        const requiredSelects = ['genreSelect', 'specieSelect', 'familySelect', 'biologicalFormSelect', 'typeVegetationSelect', 'soilSelect'];

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

});
