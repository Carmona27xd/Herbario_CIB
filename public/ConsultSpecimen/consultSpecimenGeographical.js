document.addEventListener("DOMContentLoaded", () => {
  const estadoSelect = document.querySelector('select:nth-of-type(1)');
  const municipioSelect = document.querySelector('select:nth-of-type(2)');
  const localidadSelect = document.querySelector('select:nth-of-type(3)');

  const altitudInput = document.querySelector("input[type='number']");
  const buscarBtn = document.querySelector("button.btn-success");

  const chkMenor = document.getElementById("menorQue");
  const chkMayor = document.getElementById("mayorQue");
  const chkIgual = document.getElementById("igualQue");

  const btnMostrar = document.getElementById('btnMostrarUbicacion');
  const btnDescargar = document.getElementById('btnDescargarImagenes');
  const modal = new bootstrap.Modal(document.getElementById('downloadModal'));
  const btnImagenes = document.getElementById('downloadImagesBtn');
  const btnPDF = document.getElementById('downloadPdfBtn');

  let sidebar = null;
  let markersLayer = null;

  cargarEjemplaresIniciales();

  function resetSelect(select, placeholder) {
    select.innerHTML = '';
    const defaultOption = document.createElement('option');
    defaultOption.textContent = placeholder;
    defaultOption.selected = true;
    defaultOption.disabled = true;
    select.appendChild(defaultOption);
  }

  fetch('../../backend/ConsultSpecimens/serviceFetchState.php')
    .then(res => res.json())
    .then(data => {
      resetSelect(estadoSelect, 'Estado');
      data.forEach(state => {
        const option = document.createElement('option');
        option.value = state.idState;
        option.textContent = state.name;
        estadoSelect.appendChild(option);
      });
    })
    .catch(err => console.error('Error cargando estados:', err));

  estadoSelect.addEventListener('change', () => {
    const idState = estadoSelect.value;

    fetch('../../backend/ConsultSpecimens/serviceFetchMunicipalities.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idState })
    })
      .then(res => res.json())
      .then(data => {
        resetSelect(municipioSelect, 'Municipio');
        resetSelect(localidadSelect, 'Localidad');
        data.forEach(municipio => {
          const option = document.createElement('option');
          option.value = municipio.idMunicipality;
          option.textContent = municipio.name;
          municipioSelect.appendChild(option);
        });
      })
      .catch(err => console.error('Error cargando municipios:', err));
  });

  municipioSelect.addEventListener('change', () => {
    const idMunicipality = municipioSelect.value;

    fetch('../../backend/ConsultSpecimens/serviceFetchLocalities.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idMunicipality })
    })
      .then(res => res.json())
      .then(data => {
        resetSelect(localidadSelect, 'Localidad');
        data.forEach(localidad => {
          const option = document.createElement('option');
          option.value = localidad.idLocality;
          option.textContent = localidad.name;
          localidadSelect.appendChild(option);
        });
      })
      .catch(err => console.error('Error cargando localidades:', err));
  });

//Para la carga inicial
  function cargarEjemplaresIniciales() {
  fetch('../../backend/ConsultSpecimens/servicesFetchConsultSpecimens.php')
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector("table tbody");
      tbody.innerHTML = "";

      data.forEach(ejemplar => {
        let ruta = ejemplar.specimenImage ? ejemplar.specimenImage.replace(/^uploads\//, '') : null;
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${ejemplar.familia}</td>
          <td>${ejemplar.genero}</td>
          <td>${ejemplar.especie}</td>
          <td>${ejemplar.registros}</td>
          <td>
            ${ruta ? `<img src="/SCEPIB_UV/uploads/${ruta}" width="100" class="d-block mx-auto">` : 'Sin imagen'}
          </td>
          <td class="text-center">
            <input type="checkbox" class="form-check-input mx-auto d-block specimen-checkbox" data-id="${ejemplar.idSpecimen}">
          </td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch(err => console.error("Error al cargar ejemplares iniciales:", err));
  }

  buscarBtn.addEventListener("click", () => {
    const filters = {
      idState: estadoSelect.value !== "Estado" ? estadoSelect.value : null,
      idMunicipality: municipioSelect.value !== "Municipio" ? municipioSelect.value : null,
      idLocality: localidadSelect.value !== "Localidad" ? localidadSelect.value : null,
      altitude: altitudInput.value ? parseInt(altitudInput.value) : null,
      operator: chkMenor.checked ? "<=" : chkMayor.checked ? ">=" : chkIgual.checked ? "=" : null
    };

    fetch("../../backend/ConsultSpecimens/serviceFetchSpecimensByGeo.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filters)
    })
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector("table tbody");
      tbody.innerHTML = "";

      data.forEach(ejemplar => {
        let ruta = ejemplar.image_url.replace(/^uploads\//, '');
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${ejemplar.family}</td>
          <td>${ejemplar.genus}</td>
          <td>${ejemplar.species}</td>
          <td>${ejemplar.records}</td>
          <td><img src="/SCEPIB_UV/uploads/${ruta}" width="100" class="d-block mx-auto"></td>
          <td class="text-center"><input type="checkbox" class="form-check-input mx-auto d-block specimen-checkbox" data-id="${ejemplar.idSpecimen}"></td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch(err => console.error("Error al filtrar:", err));
  });

  document.addEventListener('change', () => {
    const algunoSeleccionado = Array.from(document.querySelectorAll('.specimen-checkbox')).some(cb => cb.checked);
    btnMostrar.disabled = !algunoSeleccionado;
    btnDescargar.disabled = !algunoSeleccionado;
  });

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

  //Mapa funcional pero abierto a cambios  
  btnMostrar.addEventListener('click', async () => {
    const checkboxes = document.querySelectorAll('.specimen-checkbox:checked');
    const ids = Array.from(checkboxes).map(cb => cb.getAttribute('data-id'));
    
    if (ids.length === 0) return;
    
    try {
      const response = await fetch('../../backend/ConsultSpecimens/serviceFetchCoordinates.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ specimenIds: ids })
      });
    
      const coordenadas = await response.json();
    
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
    
      // El sidebar para los detalles
      sidebar = L.control.sidebar('sidebarMap', {
        position: 'right'
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
        const marker = L.marker([lat, lon]).addTo(mapa);
      
        // Un click listener para la barra lateral con los detalles
        marker.on('click', async function() {
          const content = await createPopupContent(coord);
          document.getElementById('sidebar-content').innerHTML = content;
          sidebar.open('specimenDetails'); 
        });
      
        grupo.push([lat, lon]);
      } else {
        console.warn(`Coordenada inválida para el ejemplar con ID ${coord.idSpecimen}:`, coord);
      }

    });

    if (grupo.length) {
      mapa.fitBounds(grupo);
    }
  }

    // Aqui se crea el contenido del "popup" de cada marcador
  async function createPopupContent(coord) {
    const response = await fetch(`../../backend/ConsultSpecimens/serviceFetchDetailsSpecimen.php?idSpecimen=${coord.idSpecimen}`);
    const data = await response.json();

    if (data.error) {
      return "No se encontraron detalles del ejemplar.";
    }

    const popupContent = `
      <strong>${data.scientificName}</strong><br>
      <em>Familia:</em> ${data.family || 'N/A'}<br>
      <em>Estado:</em> ${data.state || 'N/A'}<br>
      <em>Municipio:</em> ${data.municipality || 'N/A'}<br>
      <em>Tipo de vegetación:</em> ${data.vegetationType || 'N/A'}<br>
      <em>Suelo:</em> ${data.soil || 'N/A'}<br>
      <em>Forma biológica:</em> ${data.biologicalForm || 'N/A'}<br>
      <em>Tamaño:</em> ${data.size || 'N/A'}<br>
      <em>Edad:</em> ${data.lifeCycle || 'N/A'}<br>
      <em>Flor:</em> ${data.flower || 'N/A'}<br>
      <em>Fruto:</em> ${data.fruit || 'N/A'}<br>
      <em>Asociada:</em> ${data.associated || 'N/A'}<br>
      <em>Nombre local:</em> ${data.localName || 'N/A'}<br>
      <em>Info ambiental:</em> ${data.environmentalInformation || 'N/A'}<br>
      ${data.specimenImage ? `<img src="/SCEPIB_UV/uploads/${data.specimenImage.replace(/^uploads\//, '')}" width="150"/>` : ''}
    `;

    return popupContent;
  }
//Ayuda, el Servicio Social me consume
});


