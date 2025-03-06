document.getElementById("registerLink").addEventListener("click", function() {
    window.location.href = "register.html";
});

document.getElementById("recoverPasswordLink").addEventListener("click", function() {
    window.location.href = "recoverPassword.html";
});

document.getElementById("logInForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    try {
        const response = await fetch("../backend/logIn.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem("token", data.token);
            alert("¡Bienvenido!");
            window.location.href = "dashBoard.html";
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Error: ", error);
        alert("Ocurrió un error al intentar iniciar sesión.");
    }
});