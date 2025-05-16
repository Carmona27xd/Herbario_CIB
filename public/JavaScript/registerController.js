document.getElementById("logInLink").addEventListener("click", function() {
    window.location.href = "logIn.html";
});

document.getElementById("successButton").addEventListener("click", function() {
    window.location.href = "logIn.html";
});

document.getElementById("registerForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const formData = {
        name: document.getElementById("name").value.trim(),
        first_surname: document.getElementById("first_surname").value.trim(),
        second_surname: document.getElementById("second_surname").value.trim(),
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value.trim(),
        role_id: 1
    };

    const passwordVerify = {
        firstPassword: document.getElementById("password"),
        secondPassword: document.getElementById("confirmPassword")
    }

    if (
        !formData.name ||
        !formData.first_surname ||
        !formData.second_surname ||
        !formData. email ||
        !passwordVerify.firstPassword.value.trim() ||
        !passwordVerify.secondPassword.value.trim() 
    ) {
        const modalMissingFields = new bootstrap.Modal(document.getElementById("missingData"));
        modalMissingFields.show();
        return;
    }

    const termsCheckBox = document.getElementById("acceptTerms");

    if (!termsCheckBox.checked) {
        const modalTerms = new bootstrap.Modal(document.getElementById("termsModal"));
        modalTerms.show();
        return;
    }

    if (passwordVerify.firstPassword.value === passwordVerify.secondPassword.value) {
        try {
            const response = await fetch("../backend/registerNewUser.php", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) { 
                const successModal = new bootstrap.Modal(document.getElementById("success"));
                successModal.show();

            } else {
                //const emailModal = new bootstrap.Modal(document.getElementById("emailAlreadyExists"));
                //emailModal.show();

                alert(data.message);
            }
        } catch (error) {
            console.error("Error: ", error);
            document.getElementById("message").innerText = "Ocurrió un error al procesar la solicitud";
        }
    } else {
        const passswordMatch = new bootstrap.Modal(document.getElementById("passwordMatch"));
        passswordMatch.show();
        return;
    }
});
