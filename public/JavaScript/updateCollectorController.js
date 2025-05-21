document.addEventListener("DOMContentLoaded", function () {
    const collectorData = sessionStorage.getItem("collectorData");

    if (!collectorData) {
        alert("No hay datos para editar.");
        window.location.href = "adminCollectors.html";
        return;
    }

    const collector = JSON.parse(collectorData);

    // Llenar los campos de texto
    document.getElementById("name").value = collector.names;
    document.getElementById("first_surname").value = collector.first_surname;
    document.getElementById("second_surname").value = collector.second_surname;

    // Seleccionar el valor correcto en el combo box
    document.getElementById("ascription").value = collector.ascription;
});

document.getElementById("cancelButton").addEventListener("click", function() {
    alert("Editar cancelado");
    window.location.href = "adminCollectors.html";
})

document.addEventListener("DOMContentLoaded", function () {
    const collectorData = sessionStorage.getItem("collectorData");

    if (!collectorData) {
        alert("No hay datos para editar.");
        window.location.href = "adminCollectors.html";
        return;
    }

    const collector = JSON.parse(collectorData);

    // Llenar los campos de texto
    document.getElementById("name").value = collector.names;
    document.getElementById("first_surname").value = collector.first_surname;
    document.getElementById("second_surname").value = collector.second_surname;
    document.getElementById("ascription").value = collector.ascription;

    // Manejar el envío del formulario
    document.getElementById("registerForm").addEventListener("submit", function (event) {
        event.preventDefault(); // Evitar que la página se recargue

        // Obtener los valores editados
        const updatedData = {
            id_collector: collector.id_collector, // Usamos el ID en lugar del nombre
            name: document.getElementById("name").value.trim(),
            first_surname: document.getElementById("first_surname").value.trim(),
            second_surname: document.getElementById("second_surname").value.trim(),
            ascription: document.getElementById("ascription").value
        };

        console.log("Enviando datos:", updatedData);

        // Enviar los datos al backend
        fetch("../backend/updateCollector.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(updatedData).toString()
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                sessionStorage.removeItem("collectorData"); 
                const successModal = new bootstrap.Modal(document.getElementById("success"));
                successModal.show();
            } else {
                alert("Error: " + data.message);
            }
        })
        .catch(error => console.error("Error al actualizar:", error));
    });
});

document.getElementById("successfulButton").addEventListener("click", function () {
    window.location.href = "adminCollectors.html";
})