document.getElementById("registerLink").addEventListener("click", function() {
    window.location.href = "register.html";
});

document.getElementById("recoverPasswordLink").addEventListener("click", function() {
    window.location.href = "recoverPassword.html";
});

document.getElementById("logInForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("Por favor completa los campos");
        return;
    }

    let responseText; 
    
    try {
        const response = await fetch("../backend/logIn.php", {
            method: "POST",
            headers: {"Content-Type": "application/json"}, 
            body: JSON.stringify({email, password})
        });

        responseText = await response.text(); // Asignar el valor de responseText
        console.log("Respuesta del servidor:", responseText);

        const data = JSON.parse(responseText);

        if (data.jwt) {
            localStorage.setItem("jwt", data.jwt);
            window.location.href = "dashboard.html";
        } else {
            document.getElementById("message").textContent = data.error || "Error desconocido";
        }
    } catch (error) {
        console.error("Error: ", error);
        console.error("Respuesta del servidor (en caso de error):", responseText); 
        alert("Error al iniciar sesión");
    }
});