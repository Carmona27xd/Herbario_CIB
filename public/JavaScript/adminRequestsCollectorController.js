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
                    <button class="btn btn-warning btn-sm edit-btn" data-id="${request.id_request}">
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
                    adscription: row.cells[4].innerText
                }
            })
        })
    })
    .catch(error => {
        console.error("Error al obtener los datos: ", error);
        document.getElementById("collectorsTableBody").innerHTML = 
        `<tr><td colspan="5" class="text-center text-danger">Error al cargar los datos</td></tr>`;
    })
})

document.getElementById("backButton").addEventListener("click", function () {
    window.location.href = "dashBoardComitteeMember.html";
})