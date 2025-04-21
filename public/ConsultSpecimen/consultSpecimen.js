document.addEventListener('DOMContentLoaded', () => {
    const btnMostrar = document.getElementById('btnMostrarUbicacion');
    const btnDescargar = document.getElementById('btnDescargarImagenes');
    const modal = new bootstrap.Modal(document.getElementById('downloadModal'));
    const btnImagenes = document.getElementById('downloadImagesBtn');
    const btnPDF = document.getElementById('downloadPdfBtn');
  
    let ejemplaresOriginal = [];
  
    fetch('../../backend/ConsultSpecimens/servicesFetchConsultSpecimens.php')
      .then(response => response.json())
      .then(data => {
        ejemplaresOriginal = data;
        renderTabla(data);
      })
      .catch(error => console.error('Error al obtener los datos:', error));
  
    const campoFiltro = document.getElementById('campoFiltro');
    const valorBusqueda = document.getElementById('valorBusqueda');
  
    valorBusqueda.addEventListener('input', () => {
      const campo = campoFiltro.value;
      const valor = valorBusqueda.value.toLowerCase();
  
      if (campo === '') {
        renderTabla(ejemplaresOriginal);
        return;
      }
  
      const filtrados = ejemplaresOriginal.filter(ejemplar =>
        (ejemplar[campo] ?? '').toLowerCase().includes(valor)
      );
  
      renderTabla(filtrados);
    });
  
    function renderTabla(datos) {
      const tbody = document.querySelector('table tbody');
      tbody.innerHTML = '';
  
      datos.forEach(ejemplar => {
        let ruta = ejemplar.specimenImage.replace(/^uploads\//, '');
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${ejemplar.familia}</td>
          <td>${ejemplar.genero}</td>
          <td>${ejemplar.especie}</td>
          <td>${ejemplar.registros}</td>
          <td><img src="/SCEPIB_UV/uploads/${ruta}" width="100" class="d-block mx-auto"></td>
          <td class="text-center"><input type="checkbox" class="form-check-input mx-auto d-block specimen-checkbox"></td>
        `;
        tbody.appendChild(row);
      });
  
      actualizarEstadoBotones(); 
    }
  
    document.addEventListener('change', () => {
      actualizarEstadoBotones();
    });
  
    function actualizarEstadoBotones() {
      const algunoSeleccionado = Array.from(document.querySelectorAll('.specimen-checkbox')).some(cb => cb.checked);
      btnMostrar.disabled = !algunoSeleccionado;
      btnDescargar.disabled = !algunoSeleccionado;
    }
  
    btnDescargar.addEventListener('click', () => {
      modal.show();
    });
  
    btnImagenes.addEventListener('click', () => {
      modal.hide();
      descargarComoImagenes();
    });
  
    btnPDF.addEventListener('click', () => {
      modal.hide();
      descargarComoPDF();
    });
  
    function descargarComoImagenes() {
      const seleccionados = document.querySelectorAll('.specimen-checkbox:checked');
      seleccionados.forEach(cb => {
        const row = cb.closest('tr');
        const img = row.querySelector('img');
        const enlace = document.createElement('a');
        enlace.href = img.src;
        enlace.download = img.src.split('/').pop(); // nombre del archivo
        document.body.appendChild(enlace);
        enlace.click();
        document.body.removeChild(enlace);
      });
    }
  
    async function descargarComoPDF() {
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF();
      const seleccionados = document.querySelectorAll('.specimen-checkbox:checked');
  
      let index = 0;
      for (const cb of seleccionados) {
        const row = cb.closest('tr');
        const imgElement = row.querySelector('img');
  
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = imgElement.src;
  
        await new Promise(resolve => {
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const imgData = canvas.toDataURL('image/jpeg');
  
            if (index > 0) pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 10, 10, 180, 120); // Ajusta el tamaño si hace falta
            resolve();
          };
        });
  
        index++;
      }
  
      pdf.save('imagenes_seleccionadas.pdf');
    }
  });