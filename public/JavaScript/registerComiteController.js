// Espera a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function() {

    // Event listener para el formulario de registro
    document.getElementById("registerForm").addEventListener("submit", async function (event) {
        event.preventDefault(); // Evita que el formulario se envíe de forma tradicional

        let registerSuccess = false;

        // Objeto con los datos del formulario
        const formDataNewUser = {
            name: document.getElementById("name").value.trim(),
            first_surname: document.getElementById("first_surname").value.trim(),
            second_surname: document.getElementById("second_surname").value.trim(),
            email: document.getElementById("email").value.trim(),
            password: document.getElementById("password").value.trim(),
            role_id: 3 // Asignando rol de 'Committee Member' (ID 3)
        };

        // Objeto para verificar contraseñas
        const passwordVerify = {
            firstPassword: document.getElementById("password"),
            secondPassword: document.getElementById("confirmPassword")
        };

        // Validación de campos vacíos (Nota: second_surname es opcional)
        if (
            !formDataNewUser.name ||
            !formDataNewUser.first_surname ||
            // !formDataNewUser.second_surname || <-- CORREGIDO: Este campo es opcional
            !formDataNewUser.email ||
            !passwordVerify.firstPassword.value.trim() ||
            !passwordVerify.secondPassword.value.trim()
        ) {
            // Muestra modal de campos faltantes
            const modalMissingFields = new bootstrap.Modal(document.getElementById("missingData"));
            modalMissingFields.show();
            return; // Detiene la ejecución
        }

        // Validación de contraseñas
        if (passwordVerify.firstPassword.value !== passwordVerify.secondPassword.value) {
            // Muestra modal de contraseñas no coincidentes
            const passwordMatchModal = new bootstrap.Modal(document.getElementById("passwordMatch"));
            passwordMatchModal.show();
            return; // Detiene la ejecución
        }

        // --- Único Fetch: Registro en 'registerNewMember.php' ---
        try {
            const response = await fetch("../backend/registerNewMember.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formDataNewUser) // Envía los datos como JSON
            });

            const data = await response.json();
            
            if (data.success) {
                registerSuccess = true; // Marca el registro como exitoso
            } else {
                // Maneja errores específicos del registro
                if (data.message && data.message.includes("correo")) {
                    alert("El correo ya se encuentra en uso");
                } else {
                    alert(data.message || "Ocurrió un error desconocido.");
                }
                return; // Detiene la ejecución si el fetch falla
            }
        } catch (error) {
            console.error("Error en el fetch a registerNewMember.php: ", error);
            alert("Ocurrió un error de conexión. Inténtalo de nuevo."); // Mensaje de error genérico
            return; // Detiene la ejecución
        }

        // --- Verificación Final ---
        // Si el único registro fue exitoso, muestra el modal de éxito
        if (registerSuccess) {
            const successModal = new bootstrap.Modal(document.getElementById("successfulRegistration"));
            successModal.show();
        }
    });

    // --- Event Listener para el Botón de Éxito ---
    // Redirección después de cerrar el modal de éxito
    document.getElementById("successfulButton").addEventListener("click", function () {
        window.location.href = "dashBoardAdmin.html";
    });

});