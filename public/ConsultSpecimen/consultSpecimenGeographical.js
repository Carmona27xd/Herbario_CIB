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
  const modalDownload = new bootstrap.Modal(document.getElementById('downloadModal'));
  const btnImagenes = document.getElementById('downloadImagesBtn');
  const btnPDF = document.getElementById('downloadPdfBtn');

  let ejemplaresOriginal = [];

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

    function cargarEjemplaresIniciales() {
      fetch('../../backend/ConsultSpecimens/servicesFetchConsultSpecimens.php')
        .then(res => res.json())
        .then(data => {
          ejemplaresOriginal = data;
          renderTabla(data);
        })
        .catch(err => console.error("Error al cargar ejemplares iniciales:", err));
    }

    function renderTabla(data) {
    const tbody = document.querySelector("table tbody");
    tbody.innerHTML = "";

    data.forEach(ejemplar => {
      let ruta = ejemplar.specimenImage || ejemplar.image_url || null;

      if (ruta && ruta.startsWith('uploads/')) {
        ruta = ruta.replace(/^uploads\//, '');
      }

      const esProtegido = ejemplar.protected === "1" || ejemplar.protected === 1;

      const row = document.createElement('tr');
      row.setAttribute('data-protegido', esProtegido);

      row.innerHTML = `
        <td>${ejemplar.familia || ejemplar.family || ''}</td>
        <td>${ejemplar.genero || ejemplar.genus || ''}</td>
        <td>${ejemplar.especie || ejemplar.species || ''}</td>
        <td>${ejemplar.registros || ejemplar.records || ''}</td>
        <td>
          <img src="${esProtegido ? '../images/no-disponible.jpg' : `/Herbario/uploads/${ruta}`}
          " width="100" class="d-block mx-auto specimen-img" onerror="this.onerror=null;this.src='../images/no-disponible.jpg';">
        </td>
        <td class="text-center">
          <input type="checkbox" class="form-check-input mx-auto d-block specimen-checkbox" 
            data-id="${ejemplar.idSpecimen}" 
            data-protegido="${esProtegido}">
        </td>
      `;
      tbody.appendChild(row);
    });
    actualizarEstadoBotones();
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
        renderTabla(data);
      })
      .catch(err => console.error("Error al filtrar:", err));
  });

  document.addEventListener('change', () => {
    actualizarEstadoBotones();
  });

  function actualizarEstadoBotones() {
    const algunoSeleccionado = Array.from(document.querySelectorAll('.specimen-checkbox')).some(cb => cb.checked);
    btnMostrar.disabled = !algunoSeleccionado;
    btnDescargar.disabled = !algunoSeleccionado;
  }

  btnDescargar.addEventListener('click', () => {
    modalDownload.show();
  });

  btnImagenes.addEventListener('click', () => {
    modalDownload.hide();
    descargarComoImagenes();
  });

  btnPDF.addEventListener('click', () => {
    modalDownload.hide();
    descargarComoPDF();
  });

  let mapa;

  btnMostrar.addEventListener('click', async () => {
    const checkboxes = document.querySelectorAll('.specimen-checkbox:checked');
    const ids = Array.from(checkboxes).map(cb => cb.getAttribute('data-id'));

    if (ids.length === 0) return;

    if (!localStorage.getItem('jwt')) {
      mostrarModalLogin();
      return;
    }

    if (contieneProtegidoSeleccionado()) {
      mostrarModalInvestigador();
      return;
    }

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

      const mapModal = new bootstrap.Modal(document.getElementById('mapModal'));
      mapModal.show();

      setTimeout(() => mostrarEnMapa(coordenadas), 300);

    } catch (error) {
      console.error('Error al obtener coordenadas:', error);
    }
  });

  function descargarComoImagenes() {
    const token = localStorage.getItem('jwt');
    const role = localStorage.getItem('role');

    if (!token) {
      mostrarModalLogin();
      return;
    }

    if (contieneProtegidoSeleccionado()) {
      mostrarModalInvestigador();
      return;
    }

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
    const token = localStorage.getItem('jwt');
    const role = localStorage.getItem('role');

    if (!token) {
      mostrarModalLogin();
      return;
    }

    if (contieneProtegidoSeleccionado()) {
      mostrarModalInvestigador();
      return;
    }

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

  function mostrarEnMapa(coordenadas) {
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
        const marker = L.marker([lat, lon]).addTo(mapa);

        marker.on('click', async function () {
          const content = await createPopupContent(coord);
          document.getElementById('specimenDetailsPanel').innerHTML = content;
        });

        grupo.push([lat, lon]);
      }
    });

    if (grupo.length) {
      mapa.fitBounds(grupo);
    }
  }

  async function createPopupContent(coord) {
    const response = await fetch(`../../backend/ConsultSpecimens/serviceFetchDetailsSpecimen.php?idSpecimen=${coord.idSpecimen}`);
    const data = await response.json();

    if (data.error) {
      return "No se encontraron detalles del ejemplar.";
    }

    return `
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
      ${data.specimenImage ? `<img src="/Herbario/uploads/${data.specimenImage.replace(/^uploads\//, '')}" width="150"/>` : ''}
      <div class="mt-3 d-flex gap-2">
        <button class="btn btn-sm btn-outline-primary" onclick="downloadImage('${data.specimenImage}')">
          Descargar imagen
        </button>
        <button class="btn btn-sm btn-outline-success" onclick='downloadExcel(${JSON.stringify(data)})'>
          Descargar Excel
        </button>
      </div>
    `;
  }

  const mapModal = document.getElementById('mapModal');
  mapModal.addEventListener('show.bs.modal', function () {
    document.getElementById('specimenDetailsPanel').innerHTML =
      '<p class="text-muted">Haz clic en un marcador para ver los detalles del ejemplar aquí.</p>';
  });

  document.getElementById('specimenDetailsPanel').addEventListener('click', function (event) {
    if (event.target.tagName === 'IMG') {
      const imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
      document.getElementById('modalImage').src = event.target.src;
      imageModal.show();
    }
  });

});

// Funciones globales para control de acceso y descargas
function mostrarModalInvestigador() {
  new bootstrap.Modal(document.getElementById('investigatorRequiredModal')).show();
}

function contieneProtegidoSeleccionado() {
  const seleccionados = document.querySelectorAll('.specimen-checkbox:checked');
  return Array.from(seleccionados).some(cb => cb.dataset.protegido === "true" || cb.dataset.protegido === "1");
}

function mostrarModalLogin() {
  new bootstrap.Modal(document.getElementById('loginRequiredModal')).show();
}

function downloadImage(imageName) {
  const token = localStorage.getItem('jwt');
  const role = localStorage.getItem('role');

  if (!token) {
    mostrarModalLogin();
    return;
  }

  if (!imageName) return;
  const link = document.createElement('a');
  link.href = `/Herbario/uploads/${imageName.replace(/^uploads\//, '')}`;
  link.download = imageName.split('/').pop();
  link.click();
}

function downloadExcel(data) {
  const token = localStorage.getItem('jwt');
  const role = localStorage.getItem('role');

  if (!token) {
    mostrarModalLogin();
    return;
  }

  const ws_data = [
    ["Campo", "Valor"],
    ["Nombre científico", data.scientificName || 'N/A'],
    ["Familia", data.family || 'N/A'],
    ["Estado", data.state || 'N/A'],
    ["Municipio", data.municipality || 'N/A'],
    ["Tipo de vegetación", data.vegetationType || 'N/A'],
    ["Suelo", data.soil || 'N/A'],
    ["Forma biológica", data.biologicalForm || 'N/A'],
    ["Tamaño", data.size || 'N/A'],
    ["Edad", data.lifeCycle || 'N/A'],
    ["Flor", data.flower || 'N/A'],
    ["Fruto", data.fruit || 'N/A'],
    ["Asociada", data.associated || 'N/A'],
    ["Nombre local", data.localName || 'N/A'],
    ["Información ambiental", data.environmentalInformation || 'N/A'],
  ];

  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Ejemplar");
  XLSX.writeFile(wb, `ejemplar_${data.idSpecimen || "detalle"}.xlsx`);
}

window.downloadImage = downloadImage;
window.downloadExcel = downloadExcel;