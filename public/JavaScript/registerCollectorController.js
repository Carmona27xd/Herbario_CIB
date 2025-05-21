document.getElementById("pdfUpLoad").addEventListener("change", function () {
    const fileLabel = document.getElementById("fileName");
    const pdfFile = this.files[0]; 
    if (pdfFile) {
        fileLabel.textContent = "Archivo seleccionado: " + pdfFile.name;
    } else {
        fileLabel.textContent = "No se ha seleccionado ningún archivo.";
    }
});

document.getElementById("registerForm").addEventListener("submit", async function (event) {
    event.preventDefault(); 

    let firstFetch = false;
    let secondFetch = false;

    const formData = new FormData(); 
    formData.append("name", document.getElementById("name").value.trim());
    formData.append("first_surname", document.getElementById("first_surname").value.trim());
    formData.append("second_surname", document.getElementById("second_surname").value.trim());
    formData.append("ascription", document.getElementById("ascription").value.trim());


    const formDataNewUser = {
        name: document.getElementById("name").value.trim(),
        first_surname: document.getElementById("first_surname").value.trim(),
        second_surname: document.getElementById("second_surname").value.trim(),
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value.trim(),
        role_id: 3
    }

    const pdfFile = document.getElementById("pdfUpLoad").files[0];

    const passwordVerify = {
        firstPassword: document.getElementById("password"),
        secondPassword: document.getElementById("confirmPassword")
    }

    const ascriptionValue = document.getElementById("ascription").value;

    if (
        !formDataNewUser.name ||
        !formDataNewUser.first_surname ||
        !formDataNewUser.second_surname ||
        !formDataNewUser. email ||
        !passwordVerify.firstPassword.value.trim() ||
        !passwordVerify.secondPassword.value.trim() ||
        ascriptionValue === ""
    ) {
        const modalMissingFields = new bootstrap.Modal(document.getElementById("missingData"));
        modalMissingFields.show();
        return;
    }
    
    if (!pdfFile) {
        const missingDocumentsModal = new bootstrap.Modal(document.getElementById("missingDocuments"));
        missingDocumentsModal.show();
        return;
    } 

    if (passwordVerify.firstPassword.value !== passwordVerify.secondPassword.value) {
        const passwordMatchModal = new bootstrap.Modal(document.getElementById("passwordMatch"));
        passwordMatchModal.show();
        return;
    }
    
    formData.append("pdfFile", pdfFile);

    try {
        const response = await fetch("../backend/registerCollector.php", {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        if (data.success) {

            firstFetch = true; 
        } 
    } catch (error) {
        console.error("Error: ", error);
    }

    try {
        const response = await fetch("../backend/registerNewUser.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formDataNewUser)
        });

        const data = await response.json();

        if (data.success) {
            secondFetch = true;
        }

    } catch (error) {
        console.error("Error: ", error);
    }

    if (secondFetch && firstFetch) {
        const successModal = new bootstrap.Modal(document.getElementById("successfulRegistration"));
        successModal.show();

    } 
});

document.getElementById("successfulButton").addEventListener("click", function () {
    window.location.href = "dashBoardComitteeMember.html";
})
