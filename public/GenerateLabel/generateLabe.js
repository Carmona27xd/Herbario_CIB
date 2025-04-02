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
        const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: [80, 50] });
    
        // Dibujar el marco de la etiqueta
        doc.setLineWidth(0.5);
        doc.rect(2, 2, 76, 46);
    
        // Encabezado
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("HERBARIO XALU", 28, 8);
        doc.setFontSize(8);
        doc.text("Universidad Veracruzana", 20, 12);
        doc.text("Facultad de Biología", 26, 16);
    
        // Línea separadora
        doc.line(5, 18, 75, 18);
    
        // Datos del ejemplar
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7);
        doc.text("ID del Ejemplar:", 5, 22);
        doc.setFont("helvetica", "normal");
        doc.text(idEjemplar, 30, 22);
    
        doc.setFont("helvetica", "bold");
        doc.text("Nombre Científico:", 5, 26);
        doc.setFont("helvetica", "italic");
        doc.text(nombreCientifico, 30, 26);
    
        doc.setFont("helvetica", "bold");
        doc.text("Clasificación:", 5, 30);
        doc.setFont("helvetica", "normal");
        doc.text(clasificacionPlanta, 30, 30);
    
        doc.setFont("helvetica", "bold");
        doc.text("Abundancia:", 5, 34);
        doc.setFont("helvetica", "normal");
        doc.text(abundancia, 30, 34);
    
        doc.setFont("helvetica", "bold");
        doc.text("Fecha de Impresión:", 5, 38);
        doc.setFont("helvetica", "normal");
        const fecha = new Date().toLocaleDateString();
        doc.text(fecha, 35, 38);
    
        // Guardar PDF
        doc.save(`Etiqueta_${idEjemplar}.pdf`);
    }
});