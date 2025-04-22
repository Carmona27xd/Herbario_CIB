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
          <td class="text-center"><input type="checkbox" class="form-check-input mx-auto d-block specimen-checkbox" data-id="${ejemplar.idSpecimen}"></td>
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

    //Agregado para la prueba del mapa   
    btnMostrar.addEventListener('click', async () => {
      const checkboxes = document.querySelectorAll('.specimen-checkbox:checked');
      const ids = Array.from(checkboxes).map(cb => cb.getAttribute('data-id'));
      console.log(ids);
    
      if (ids.length === 0) return;
    
      try {
        const response = await fetch('../../backend/ConsultSpecimens/serviceFetchCoordinates.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ specimenIds: ids })
        });
    
        const coordenadas = await response.json();

        console.log(coordenadas);
    
        if (!Array.isArray(coordenadas)) {
          console.error('Respuesta inválida:', coordenadas);
          return;
        }
    
        mostrarEnMapa(coordenadas);
      } catch (error) {
        console.error('Error al obtener coordenadas:', error);
      }
    });
  
    function descargarComoImagenes() {
      const seleccionados = document.querySelectorAll('.specimen-checkbox:checked');
      seleccionados.forEach(cb => {
        const row = cb.closest('tr');
        const img = row.querySelector('img');
        const enlace = document.createElement('a');
        enlace.href = img.src;
        enlace.download = img.src.split('/').pop(); 
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
            pdf.addImage(imgData, 'JPEG', 10, 10, 180, 120); 
            resolve();
          };
        });
  
        index++;
      }
  
      pdf.save('imagenes_seleccionadas.pdf');
    }

    //Agregado para la prueba del mapa
    let mapa;

    function mostrarEnMapa(coordenadas) {
      const mapDiv = document.getElementById('map');
      mapDiv.style.display = 'block';

      if (!mapa) {
        mapa = L.map('map').setView([19.4326, -99.1332], 5); 
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapa);
      } else {
        mapa.eachLayer(layer => {
          if (layer instanceof L.Marker) {
            mapa.removeLayer(layer);
          }
        });
      }

      const grupo = [];

      coordenadas.forEach(coord => {
        const lat = parseFloat(coord.latitude);
        const lon = parseFloat(coord.longitude);

        if (!isNaN(lat) && !isNaN(lon)) {
          L.marker([lat, lon]).addTo(mapa)
            .bindPopup(`<b>${coord.especie}</b><br>${coord.genero} - ${coord.familia}`);
          grupo.push([lat, lon]);
        } else {
          console.warn(`Coordenada inválida para el ejemplar con ID ${coord.idSpecimen}:`, coord);
        }
      });

      if (grupo.length) {
        mapa.fitBounds(grupo);
      }
    }
  });