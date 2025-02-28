document.addEventListener("DOMContentLoaded", function () {
    // Llenar el combo box de géneros
    fetch('../../backend/RegisterSpecimens/servicesFetch.php')
        .then(response => response.json())
        .then(data => {
            let select = document.getElementById("genreSelect");
            // Acceder a la propiedad 'genero' del objeto
            data.genero.forEach(genero => {
                let option = document.createElement("option");
                option.value = genero.idGenero; 
                option.textContent = genero.nombre; 
                select.appendChild(option);
            });
        })
        .catch(error => console.error("Error cargando los géneros:", error));

    // Llenar el combo box de familias
    fetch('../../backend/RegisterSpecimens/servicesFetch.php') 
        .then(response => response.json()) 
        .then(data => {
            let select = document.getElementById("familySelect");
            // Acceder a la propiedad 'familia' del objeto
            data.familia.forEach(familia => {
                let option = document.createElement("option");
                option.value = familia.idFamilia; 
                option.textContent = familia.nombre; 
                select.appendChild(option);
            });
        })
        .catch(error => console.error("Error cargando las familias:", error));
});