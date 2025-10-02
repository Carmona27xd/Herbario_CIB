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
            id_collector: collector.id_collector,
            name: document.getElementById("name").value.trim(),
            first_surname: document.getElementById("first_surname").value.trim(),
            second_surname: document.getElementById("second_surname").value.trim(),
            ascription: document.getElementById("ascription").value
        };

        // --- Validación de contraseñas opcionales ---
        const newPassword = document.getElementById("new_password").value.trim();
        const confirmPassword = document.getElementById("new_password_confirmation").value.trim();

        if (newPassword || confirmPassword) {
            if (newPassword !== confirmPassword) {
                alert("Las contraseñas no coinciden.");
                return;
            }

            // Si coinciden, incluimos la contraseña en los datos
            updatedData.new_password = newPassword;
        }

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
                // Si también se incluyó contraseña, llamar al endpoint updatePassword.php
                if (updatedData.new_password) {
                    const email = collector.email; 
                    fetch("../backend/updateCollectorPassword.php", {
                        method: "POST",
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        body: new URLSearchParams({
                            email: email,
                            new_password: updatedData.new_password
                        }).toString()
                    })
                    .then(res => res.json())
                    .then(result => {
                        if (!result.success) {
                            alert("Error al actualizar la contraseña: " + result.message);
                        }
                    })
                    .catch(err => console.error("Error al actualizar contraseña:", err));
                }

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

document.getElementById("cancelButton").addEventListener("click", function() {
    alert("Editar cancelado");
    window.location.href = "adminCollectors.html";
});

document.getElementById("successfulButton").addEventListener("click", function () {
    window.location.href = "adminCollectors.html";
});
