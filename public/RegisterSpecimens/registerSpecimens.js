document.addEventListener("DOMContentLoaded", function () {   
    // Combo box de Géneros
    fetch('../../backend/RegisterSpecimens/servicesFetch.php')
        .then(response => response.json())
        .then(data => {
            let select = document.getElementById("genreSelect");
            //Aceder a la propiedad que se desea
            data.genero.forEach(genero => {
                let option = document.createElement("option");
                option.value = genero.idGenero; 
                option.textContent = genero.nombre; 
                select.appendChild(option);
            });
        })
        .catch(error => console.error("Error cargando los géneros:", error));

    // Combo box de Familias
    fetch('../../backend/RegisterSpecimens/servicesFetch.php') 
        .then(response => response.json()) 
        .then(data => {
            let select = document.getElementById("familySelect");
            data.familia.forEach(familia => {
                let option = document.createElement("option");
                option.value = familia.idFamilia; 
                option.textContent = familia.nombre; 
                select.appendChild(option);
            });
        })
        .catch(error => console.error("Error cargando las familias:", error));
    
    // Combo box de Especies
    fetch('../../backend/RegisterSpecimens/servicesFetch.php') 
        .then(response => response.json()) 
        .then(data => {
            let select = document.getElementById("speciesSelect");
            data.especie.forEach(especie => {
                let option = document.createElement("option");
                option.value = especie.idEspecie; 
                option.textContent = especie.nombre; 
                select.appendChild(option);
            });
        })
        .catch(error => console.error("Error cargando las especies:", error));  
    
    //Combo box de la forma biologica
    fetch('../../backend/RegisterSpecimens/servicesFetch.php') 
        .then(response => response.json()) 
        .then(data => {
            let select = document.getElementById("biologicalFormSelect");
            data.formabiologica.forEach(formabiologica => {
                let option = document.createElement("option");
                option.value = formabiologica.idFormaBiologica; 
                option.textContent = formabiologica.nombre; 
                select.appendChild(option);
            });
        })
        .catch(error => console.error("Error cargando las formas biologicas:", error));    

    //Combo box del tipo de vegetacion
    fetch('../../backend/RegisterSpecimens/servicesFetch.php') 
        .then(response => response.json()) 
        .then(data => {
            let select = document.getElementById("typeVegetationSelect");
            data.tipovegetacion.forEach(tipovegetacion => {
                let option = document.createElement("option");
                option.value = tipovegetacion.idTipoVegetacion; 
                option.textContent = tipovegetacion.nombre; 
                select.appendChild(option);
            });
        })
        .catch(error => console.error("Error cargando los tipos de vegetacion:", error)); 
        
    //Combo box del suelo
    fetch('../../backend/RegisterSpecimens/servicesFetch.php') 
        .then(response => response.json()) 
        .then(data => {
            let select = document.getElementById("soilSelect");
            data.suelo.forEach(suelo => {
                let option = document.createElement("option");
                option.value = suelo.idSuelo; 
                option.textContent = suelo.nombre; 
                select.appendChild(option);
            });
        })
        .catch(error => console.error("Error cargando los suelos:", error)); 
        
    //Combo box del fruto
    fetch('../../backend/RegisterSpecimens/servicesFetch.php') 
        .then(response => response.json()) 
        .then(data => {
            let select = document.getElementById("fruitSelect");
            data.fruto.forEach(fruto => {
                let option = document.createElement("option");
                option.value = fruto.idFruto; 
                option.textContent = fruto.nombre; 
                select.appendChild(option);
            });
        })
        .catch(error => console.error("Error cargando los frutos:", error));

    //Combo box de la flor
    fetch('../../backend/RegisterSpecimens/servicesFetch.php') 
        .then(response => response.json()) 
        .then(data => {
            let select = document.getElementById("flowerSelect");
            data.flor.forEach(flor => {
                let option = document.createElement("option");
                option.value = flor.idFlor; 
                option.textContent = flor.nombre; 
                select.appendChild(option);
            });
        })
        .catch(error => console.error("Error cargando las flores:", error));

        document.querySelector("form").addEventListener("submit", function (event) {
            event.preventDefault();
        });
    
        // Comienza la validacion al presionar "Siguiente"
        document.getElementById('nextButton').addEventListener('click', function (event) {
            event.preventDefault();
    
            // Validar los campos obligatorios
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
            const requiredFields = [
                'scientificName',  
                'specimenID',      
                'localName',       
                'determine',
                'size'        
            ];
        
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
        
        // Función para validar los combo boxes obligatorios del formulario
        function validateSelects() {
            let isValid = true;
            const requiredSelects = [
                'genreSelect',         
                'speciesSelect',       
                'familySelect',        
                'biologicalFormSelect',
                'typeVegetationSelect',
                'soilSelect'       
            ];
        
            requiredSelects.forEach(selectId => {
                const select = document.getElementById(selectId);
                if (select.value === "Seleccionar") {
                    isValid = false;
                    select.classList.add('is-invalid'); // Mostrar error visual
                } else {
                    select.classList.remove('is-invalid'); // Quitar error si es válido
                }
            });
        
            return isValid;
        }

        //Funcion para cargar las imagenes
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