document.addEventListener("DOMContentLoaded", function () {
    fetch("../backend/adminRequestsCollector.php")
    .then(response => response.json())
    .then(data => {
        console.log("Datos recibidos: ", data);
        const tableBody = document.getElementById("requestsCollectorTableBody");
        tableBody.innerHTML = "";

        if (data.length == 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center">No se han registrado solicitudes</td></tr>`;
            return;
        }

        data.forEach(request => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${request.name}</td>
                <td>${request.first_surname}</td>
                <td>${request.second_surname}</td>
                <td>${request.email}</td>
                <td> 
                    <button class="btn btn-warning btn-sm edit-btn" 
                    data-id="${request.id_request}"
                    data-name="${request.name}"
                    data-first_surname="${request.first_surname}"
                    data-second_surname="${request.second_surname}"
                    data-email="${request.email}"
                    data-ref_name="${request.ref_name}"
                    data-ref_first_surname="${request.ref_first_surname}"
                    data-ref_second_surname="${request.ref_second_surname}"
                    data-ref_email="${request.ref_email}"
                    data-curriculum_name="${request.curriculum_name}"
                    data-permit_name="${request.permit_name}"
                    data-letter_name="${request.letter_name}"
                    data-proyect_name="${request.proyect_name}">
                    <i class="bi bi-eye"></i> Ver detalles
                    </button>
                </td>
            `;

            tableBody.appendChild(row);
        });

        //Agregar eventos al boton de descargar documentos
        document.querySelectorAll(".edit-btn").forEach(button => {
            button.addEventListener("click", function () {
                const row = this.closest("tr");
                const request = {
                    id_request: this.dataset.id,
                    name: row.cells[0].innerText,
                    first_surname: row.cells[1].innerText,
                    second_surname: row.cells[2].innerText,
                    email: row.cells[3].innerText,
                    
                }

                console.log(this.dataset);

                const application = {

                    id_request: this.dataset.id,
                    name: this.dataset.name,
                    first_surname: this.dataset.first_surname,
                    second_surname: this.dataset.second_surname,
                    email: this.dataset.email,
                    ref_name: this.dataset.ref_name,
                    ref_first_surname: this.dataset.ref_first_surname,
                    ref_second_surname: this.dataset.ref_second_surname,
                    ref_email: this.dataset.ref_email,
                    curriculum_name: this.dataset.curriculum_name,
                    permit_name: this.dataset.permit_name,
                    letter_name: this.dataset.letter_name,
                    proyect_name: this.dataset.proyect_name
                };

                localStorage.setItem("selectedRequest", JSON.stringify(application));

                window.location.href = "applicationCollectorDetails.html";
            });
        });
    })
    .catch(error => {
        console.error("Error al obtener los datos: ", error);
        document.getElementById("collectorsTableBody").innerHTML = 
        `<tr><td colspan="5" class="text-center text-danger">Error al cargar los datos</td></tr>`;
    })
});

document.getElementById("backButton").addEventListener("click", function () {
    window.location.href = "dashBoardComitteeMember.html";
});