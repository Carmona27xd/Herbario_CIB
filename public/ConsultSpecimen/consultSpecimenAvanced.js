document.addEventListener('DOMContentLoaded', () => {
  // ================== SELECTORES ==================
  const estadoSelect = document.querySelector('select#estadoSelect');
  const municipioSelect = document.querySelector('select#municipioSelect');
  const localidadSelect = document.querySelector('select#localidadSelect');

  const campoFiltro = document.getElementById('campoFiltro'); // Familia / Genero / Especie
  const valorBusqueda = document.getElementById('valorBusqueda');

  const altitudInput = document.querySelector("input#altitudInput");
  const chkMenor = document.getElementById("menorQue");
  const chkMayor = document.getElementById("mayorQue");
  const chkIgual = document.getElementById("igualQue");

  const buscarBtn = document.querySelector("button#btnBuscar");

  const btnMostrar = document.getElementById('btnMostrarUbicacion');
  const btnDescargar = document.getElementById('btnDescargarImagenes');
  const modalDownload = new bootstrap.Modal(document.getElementById('downloadModal'));
  const btnImagenes = document.getElementById('downloadImagesBtn');
  const btnPDF = document.getElementById('downloadPdfBtn');

  let ejemplaresOriginal = [];
  let mapa;

  // Carga inicial
  cargarEjemplaresIniciales();
  cargarEstados();

  // Funciones de los selects
  function resetSelect(select, placeholder) {
    select.innerHTML = '';
    const defaultOption = document.createElement('option');
    defaultOption.textContent = placeholder;
    defaultOption.selected = true;
    defaultOption.disabled = true;
    select.appendChild(defaultOption);
  }

  function cargarEstados() {
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
  }

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

  // Carga de los ejemplares
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
      if (ruta && ruta.startsWith('uploads/')) ruta = ruta.replace(/^uploads\//, '');
      const esProtegido = ejemplar.protected === "1" || ejemplar.protected === 1;

      const row = document.createElement('tr');
      row.setAttribute('data-protegido', esProtegido);

      row.innerHTML = `
        <td>${ejemplar.familia || ejemplar.family || ''}</td>
        <td>${ejemplar.genero || ejemplar.genus || ''}</td>
        <td>${ejemplar.especie || ejemplar.species || ''}</td>
        <td>${ejemplar.registros || ejemplar.records || ''}</td>
        <td>
          <img src="${esProtegido ? '../images/no-disponible.jpg' : `/Herbario/uploads/${ruta}`}"
          width="100" class="d-block mx-auto specimen-img"
          onerror="this.onerror=null;this.src='../images/no-disponible.jpg';">
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

  // Filtros filtrosos
  valorBusqueda.addEventListener('input', () => {
    const campo = campoFiltro.value;
    const valor = valorBusqueda.value.toLowerCase();
    if (!campo) return renderTabla(ejemplaresOriginal);

    const filtrados = ejemplaresOriginal.filter(ej => (ej[campo] ?? '').toLowerCase().includes(valor));
    renderTabla(filtrados);
  });

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
      .then(data => renderTabla(data))
      .catch(err => console.error("Error al filtrar:", err));
  });
  document.addEventListener('change', actualizarEstadoBotones);
  function actualizarEstadoBotones() {
    const algunoSeleccionado = Array.from(document.querySelectorAll('.specimen-checkbox')).some(cb => cb.checked);
    btnMostrar.disabled = !algunoSeleccionado;
    btnDescargar.disabled = !algunoSeleccionado;
  }

  btnDescargar.addEventListener('click', () => modalDownload.show());
  btnImagenes.addEventListener('click', () => { modalDownload.hide(); descargarComoImagenes(); });
  btnPDF.addEventListener('click', () => { modalDownload.hide(); descargarComoPDF(); });

  function descargarComoImagenes() {
    const token = localStorage.getItem('jwt');
    const role = localStorage.getItem('role');
    if (!token) return mostrarModalLogin();
    if (contieneProtegidoSeleccionado()) return mostrarModalInvestigador();

    document.querySelectorAll('.specimen-checkbox:checked').forEach(cb => {
      const img = cb.closest('tr').querySelector('img');
      const link = document.createElement('a');
      link.href = img.src; link.download = img.src.split('/').pop();
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
    });
  }

  async function descargarComoPDF() {
    const token = localStorage.getItem('jwt');
    const role = localStorage.getItem('role');
    if (!token) return mostrarModalLogin();
    if (contieneProtegidoSeleccionado()) return mostrarModalInvestigador();

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    const seleccionados = document.querySelectorAll('.specimen-checkbox:checked');
    let index = 0;

    for (const cb of seleccionados) {
      const imgElement = cb.closest('tr').querySelector('img');
      const img = new Image(); img.crossOrigin = 'anonymous'; img.src = imgElement.src;

      await new Promise(resolve => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width; canvas.height = img.height;
          canvas.getContext('2d').drawImage(img, 0, 0);
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

  // Mapa
  btnMostrar.addEventListener('click', async () => {
    const ids = Array.from(document.querySelectorAll('.specimen-checkbox:checked')).map(cb => cb.getAttribute('data-id'));
    if (!ids.length) return;

    if (!localStorage.getItem('jwt')) return mostrarModalLogin();
    if (contieneProtegidoSeleccionado()) return mostrarModalInvestigador();

    try {
      const res = await fetch('../../backend/ConsultSpecimens/serviceFetchCoordinates.php', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ specimenIds: ids })
      });
      const coordenadas = await res.json();
      if (!Array.isArray(coordenadas)) return console.error('Respuesta inválida:', coordenadas);

      const mapModal = new bootstrap.Modal(document.getElementById('mapModal')); mapModal.show();
      setTimeout(() => mostrarEnMapa(coordenadas), 300);
    } catch (err) { console.error('Error al obtener coordenadas:', err); }
  });

  function mostrarEnMapa(coordenadas) {
    if (!mapa) {
      mapa = L.map('map').setView([19.4326, -99.1332], 5);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors' }).addTo(mapa);
    } else {
      mapa.eachLayer(l => { if (l instanceof L.Marker) mapa.removeLayer(l); });
    }

    const grupo = [];
    coordenadas.forEach(coord => {
      const lat = parseFloat(coord.latitude), lon = parseFloat(coord.longitude);
      if (!isNaN(lat) && !isNaN(lon)) {
        const marker = L.marker([lat, lon]).addTo(mapa);
        marker.on('click', async () => {
          const content = await createPopupContent(coord);
          document.getElementById('specimenDetailsPanel').innerHTML = content;
        });
        grupo.push([lat, lon]);
      }
    });
    if (grupo.length) mapa.fitBounds(grupo);
  }

  async function createPopupContent(coord) {
    const res = await fetch(`../../backend/ConsultSpecimens/serviceFetchDetailsSpecimen.php?idSpecimen=${coord.idSpecimen}`);
    const data = await res.json();
    if (data.error) return "No se encontraron detalles del ejemplar.";

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
      ${data.specimenImage ? `<img src="/Herbario/uploads/${data.specimenImage.replace(/^uploads\//,'')}" width="150"/>` : ''}
      <div class="mt-3 d-flex gap-2">
        <button class="btn btn-sm btn-outline-primary" onclick="downloadImage('${data.specimenImage}')">Descargar imagen</button>
        <button class="btn btn-sm btn-outline-success" onclick='downloadExcel(${JSON.stringify(data)})'>Descargar Excel</button>
      </div>
    `;
  }

  document.getElementById('specimenDetailsPanel').addEventListener('click', e => {
    if (e.target.tagName === 'IMG') {
      const imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
      document.getElementById('modalImage').src = e.target.src;
      imageModal.show();
    }
  });
});

function mostrarModalInvestigador() { new bootstrap.Modal(document.getElementById('investigatorRequiredModal')).show(); }
function contieneProtegidoSeleccionado() {
  return Array.from(document.querySelectorAll('.specimen-checkbox:checked'))
    .some(cb => cb.dataset.protegido === "true" || cb.dataset.protegido === "1");
}
function mostrarModalLogin() { new bootstrap.Modal(document.getElementById('loginRequiredModal')).show(); }
function downloadImage(imageName) {
  const token = localStorage.getItem('jwt'); const role = localStorage.getItem('role');

  if (!token) return mostrarModalLogin();

  if (!imageName) return;
  const link = document.createElement('a'); link.href = `/Herbario/uploads/${imageName.replace(/^uploads\//,'')}`;
  link.download = imageName.split('/').pop(); link.click();
}
function downloadExcel(data) {
  const token = localStorage.getItem('jwt'); const role = localStorage.getItem('role');

  if (!token) return mostrarModalLogin();

  const ws_data = [
    ["Campo","Valor"],
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
    ["Información ambiental", data.environmentalInformation || 'N/A']
  ];
  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Ejemplar");
  XLSX.writeFile(wb, `ejemplar_${data.idSpecimen || "detalle"}.xlsx`);
}

window.downloadImage = downloadImage;
window.downloadExcel = downloadExcel;