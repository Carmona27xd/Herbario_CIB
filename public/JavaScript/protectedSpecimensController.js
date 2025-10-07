document.addEventListener("DOMContentLoaded", async () => {
    const tbody = document.getElementById("protectedBody");

    try {
        const response = await fetch("../backend/getProtectedSpecimens.php");
        const result = await response.json();

        tbody.innerHTML = "";

        if (result.success && result.data.length > 0) {
            result.data.forEach(specimen => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${specimen.idSpecimen}</td>
                    <td>${specimen.associated || "—"}</td>
                    <td>${specimen.size || "—"}</td>
                    <td>${specimen.biologicalForm || "—"}</td>
                    <td>${specimen.vegetationType || "—"}</td>
                    <td>${specimen.plantClassification || "—"}</td>
                    <td>${specimen.environmentalInformation || "—"}</td>
                `;

                tbody.appendChild(row);
            });
        } else {
            tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted">No hay ejemplares protegidos registrados.</td></tr>`;
        }

    } catch (error) {
        console.error("Error cargando ejemplares:", error);
        tbody.innerHTML = `<tr><td colspan="8" class="text-center text-danger">Error al cargar los datos.</td></tr>`;
    }

    tbody.addEventListener("click", (event) => {
        const row = event.target.closest("tr");
        if (!row) return;
        
        tbody.querySelectorAll("tr").forEach(tr => tr.classList.remove("table-active"));

        row.classList.add("table-active");

        //console.log("Fila seleccionada:", row.cells[0].textContent);
    });

    let selectedSpecimen = null;

    tbody.addEventListener("click", (event) => {
        const row = event.target.closest("tr");
        if(!row) return;

        tbody.querySelectorAll("tr").forEach(tr => tr.classList.remove("table-active"));
        row.classList.add("table-active");

        selectedSpecimen = row.cells[0].textContent;
        console.log("Ejemplar seleccionado: ", selectedSpecimen);
    });
});
