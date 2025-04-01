document.addEventListener("DOMContentLoaded", async function() {
    const jwt = localStorage.getItem("jwt");

    if (!jwt) {
        window.location.href = "logIn.html"; // Redirige al login si no hay JWT
        return;
    }

    try {
        const response = await fetch("../backend/verifyJWT.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jwt })
        });

        const data = await response.json();

        if (data.valid) {
            document.getElementById("userInfo").textContent = `Usuario: ${data.email}`;
        } else {
            localStorage.removeItem("jwt");
            window.location.href = "logIn.html";
        }
    } catch (error) {
        console.error("Error:", error);
        window.location.href = "logIn.html";
    }
});

/*
document.getElementById("logout").addEventListener("click", function() {
    localStorage.removeItem("jwt");
    window.location.href = "logIn.html";
});
*/