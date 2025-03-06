document.getElementById("registerForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const formData = {
        name: document.getElementById("name").value.trim(),
        first_surname: document.getElementById("first_surname").value.trim(),
        second_surname: document.getElementById("second_surname").value.trim(),
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value.trim()
    };

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
            alert("Registro exitoso, redirigiendo a Login...");
            window.location.href = "logIn.html";
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Error: ", error);
        document.getElementById("message").innerText = "Ocurrió un error al procesar la solicitud";
    }
});
