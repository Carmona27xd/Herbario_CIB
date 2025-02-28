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
        .catch(error => console.error("Error cargando las especies:", error));
    
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
        .catch(error => console.error("Error cargando las familias:", error));   
});