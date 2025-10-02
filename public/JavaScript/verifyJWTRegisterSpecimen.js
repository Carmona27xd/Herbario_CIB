document.addEventListener("DOMContentLoaded", async function () {
    const jwt = localStorage.getItem("jwt");
    
    if(!jwt) {
        window.location.href = "logIn.html";
        return;
    }
    
    try {
        const response = await fetch("../../backend/verifyJWT.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" }, 
            body: JSON.stringify({jwt})
        });

        const data = await response.json();

        if (data.valid) {
            if (data.role !== 3 && data.role !== 2 ) {
                alert("Acceso denegado, no tienes permiso para ver esta pagina.");
                localStorage.removeItem("jwt");
                window.location.href = "../public/logIn.html";
            }
        } else {
            alert("Error en el primer if");
            localStorage.removeItem("jwt");
            window.location.href = "../logIn.html";
        }
    } catch (error) {
        alert("Entrando en el catch");
        console.error("Error: ", error);
        window.location.href = "../logIn.html";
    }
})