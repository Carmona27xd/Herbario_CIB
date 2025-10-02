document.getElementById("registerForm").addEventListener("submit", async function (event) {
    event.preventDefault(); 

    let firstFetch = false;
    let secondFetch = false;

    const formDataNewUser = {
        name: document.getElementById("name").value.trim(),
        first_surname: document.getElementById("first_surname").value.trim(),
        second_surname: document.getElementById("second_surname").value.trim(),
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value.trim(),
        role_id: 3
    };

    const passwordVerify = {
        firstPassword: document.getElementById("password"),
        secondPassword: document.getElementById("confirmPassword")
    };

    const ascriptionValue = document.getElementById("ascription").value.trim();

    // Validación de campos vacíos
    if (
        !formDataNewUser.name ||
        !formDataNewUser.first_surname ||
        !formDataNewUser.second_surname ||
        !formDataNewUser.email ||
        !passwordVerify.firstPassword.value.trim() ||
        !passwordVerify.secondPassword.value.trim() ||
        ascriptionValue === ""
    ) {
        const modalMissingFields = new bootstrap.Modal(document.getElementById("missingData"));
        modalMissingFields.show();
        return;
    }

    // Validación de contraseñas
    if (passwordVerify.firstPassword.value !== passwordVerify.secondPassword.value) {
        const passwordMatchModal = new bootstrap.Modal(document.getElementById("passwordMatch"));
        passwordMatchModal.show();
        return;
    }

    try {
        // Registro en registerCollector.php (sin PDF)
        const collectorFormData = new FormData();
        collectorFormData.append("name", formDataNewUser.name);
        collectorFormData.append("first_surname", formDataNewUser.first_surname);
        collectorFormData.append("second_surname", formDataNewUser.second_surname);
        collectorFormData.append("email", formDataNewUser.email);
        collectorFormData.append("ascription", ascriptionValue);

        const response = await fetch("../backend/registerCollector.php", {
            method: "POST",
            body: collectorFormData
        });

        const data = await response.json();
        if (data.success) {
            firstFetch = true; 
        } 
    } catch (error) {
        console.error("Error en registerCollector.php: ", error);
    }

    try {
        // Registro en registerNewUser.php
        const response = await fetch("../backend/registerNewCollector.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formDataNewUser)
        });

        const data = await response.json();
        if (data.success) {
            secondFetch = true;
        } else {
            if (data.message.includes("correo")) {
                alert("El correo ya se encuentra en uso");
            } else {
                alert(data.message);
            }
            return;
        }
    } catch (error) {
        console.error("Error en registerNewUser.php: ", error);
    }

    if (secondFetch && firstFetch) {
        const successModal = new bootstrap.Modal(document.getElementById("successfulRegistration"));
        successModal.show();
    } 
});

// Redirección tras éxito
document.getElementById("successfulButton").addEventListener("click", function () {
    window.location.href = "dashBoardComitteeMember.html";
});
