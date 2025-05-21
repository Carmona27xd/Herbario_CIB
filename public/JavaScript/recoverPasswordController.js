document.getElementById("recoverPasswordForm").addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailInput = document.getElementById("email");

    const response = await fetch("../backend/forgotPassword.php", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email: emailInput.value})
    });

    let email = document.getElementById("email").value.trim();
    if (!email) {
        const missingEmailModal = new bootstrap.Modal(document.getElementById("missingEmail"));
        missingEmailModal.show();
        return;
    }

    try {
        const data = await response.json();
        
        if (data.success) {
            const successModal = new bootstrap.Modal(document.getElementById("success"));
            successModal.show();

        } else if (!data.sucess && data.message == "email not registered") {
            const notRegisteredEmailModal = new bootstrap.Modal(document.getElementById("emailNotRegistered"));
            notRegisteredEmailModal.show();
        }
    } catch (err) {
        alert("Error al procesar la respuesta del servidor");
        console.log(err);
    }
});

document.getElementById("successButton").addEventListener("click", function() {
    window.location.href = "logIn.html";
});