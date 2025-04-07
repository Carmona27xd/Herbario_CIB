document.addEventListener("DOMContentLoaded", function () {
    fetch("../backend/adminCollectors.php")
        .then(response => response.json())
        .then(data => {
            console.log("Datos recibidos: ", data);
            const tableBody = document.getElementById("collectorsTableBody");
            tableBody.innerHTML = ""; // Limpiar el contenido previo

            if (data.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="5" class="text-center">No hay datos disponibles</td></tr>`;
                return;
            }

            data.forEach(collector => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${collector.names}</td>
                    <td>${collector.first_surname}</td>
                    <td>${collector.second_surname}</td>
                    <td>${collector.ascription}</td>
                    <td>
                        <button class="btn btn-warning btn-sm edit-btn" data-id="${collector.id_collector}">
                            <i class="bi bi-pencil"></i> Editar
                        </button>
                    </td>
                `;

                tableBody.appendChild(row);
            });

            // Agregar eventos a los botones "Editar"
            document.querySelectorAll(".edit-btn").forEach(button => {
                button.addEventListener("click", function () {
                    const row = this.closest("tr");
                    const collector = {
                        id_collector: this.dataset.id,
                        names: row.cells[0].innerText,
                        first_surname: row.cells[1].innerText,
                        second_surname: row.cells[2].innerText,
                        ascription: row.cells[3].innerText
                    };

                    sessionStorage.setItem("collectorData", JSON.stringify(collector));
                    window.location.href = "updateCollector.html";
                });
            });
        })
        .catch(error => {
            console.error("Error al obtener los datos:", error);
            document.getElementById("collectorsTableBody").innerHTML = 
                `<tr><td colspan="5" class="text-center text-danger">Error al cargar los datos</td></tr>`;
        });
});

document.getElementById("backButton").addEventListener("click", function (){
    window.location.href = "dashBoardAdmin.html";
})
