document.getElementById("logoutButton").addEventListener("click", function () {
    // Verificar si hay un token en el localStorage
    const jwt = localStorage.getItem("jwt");

    if (!jwt) {
        alert("No hay una sesión activa");
    } else {
        // Eliminar el token del localStorage
        localStorage.removeItem("jwt");
        alert("Sesión cerrada correctamente");
    }

    // Redirigir al usuario a la página de inicio de sesión
    window.location.href = "login.html";
});