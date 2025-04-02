document.addEventListener("DOMContentLoaded", async function () {
    let filtroActual = "nombreCientifico"; 

    document.querySelectorAll(".filter-btn").forEach(button => {
        button.addEventListener("click", function () {
            filtroActual = this.getAttribute("data-filter");
            document.getElementById("search-input").placeholder = "Buscar por " + this.innerText.trim();
        });
    });

    document.getElementById("search-input").addEventListener("input", function () {
        const searchText = this.value.toLowerCase();
        const filas = document.querySelectorAll("#tabla-body tr");

        filas.forEach(fila => {
            const columna = fila.querySelector(`[data-column="${filtroActual}"]`);
            if (columna) {
                fila.style.display = columna.textContent.toLowerCase().includes(searchText) ? "" : "none";
            }
        });
    });

    try {
        const response = await fetch("../../backend/GenerateLabel/servicesFetchGenerateLabel.php");

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        const tablaBody = document.getElementById("tabla-body");

        tablaBody.innerHTML = "";

        data.forEach(specimen => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td data-column="idEjemplar">${specimen.idSpecimen}</td>
                <td data-column="nombreCientifico">${specimen.ScientificName}</td>
                <td data-column="clasificacionPlanta">${specimen.PlantClassification}</td>
                <td data-column="abundancia">${specimen.Abundance}</td>
                <td><button class="btn btn-success generar-etiqueta">Generar etiqueta</button></td>
            `;
            tablaBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }

    // Manejar eventos de los botones "Generar etiqueta" con event delegation
    document.getElementById("tabla-body").addEventListener("click", function (event) {
        if (event.target.classList.contains("generar-etiqueta")) {

            const fila = event.target.closest('tr');
            const idEjemplar = fila.querySelector('[data-column="idEjemplar"]').textContent;
            const nombreCientifico = fila.querySelector('[data-column="nombreCientifico"]').textContent;
            const clasificacionPlanta = fila.querySelector('[data-column="clasificacionPlanta"]').textContent;
            const abundancia = fila.querySelector('[data-column="abundancia"]').textContent;

            generarPDF(idEjemplar, nombreCientifico, clasificacionPlanta, abundancia);
        }
    });

    function generarPDF(idEjemplar, nombreCientifico, clasificacionPlanta, abundancia) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Etiqueta de Ejemplar", 20, 20);

        doc.setFontSize(12);
        doc.text(`ID del Ejemplar: ${idEjemplar}`, 20, 40);
        doc.text(`Nombre Científico: ${nombreCientifico}`, 20, 50);
        doc.text(`Clasificación del Ejemplar: ${clasificacionPlanta}`, 20, 60);
        doc.text(`Abundancia del Ejemplar: ${abundancia}`, 20, 70);

        doc.save(`Etiqueta_${idEjemplar}.pdf`);
    }
});