/* =============================================
   TERRASHIELD — app.js
   Estado global, navegación, modales,
   gestión de proyectos, config y toasts.
   ============================================= */

/* =============================================
   APP STATE
   ============================================= */
const AppState = {
  currentProject: null,
  config: {
    theme: 'light',
    decimals: 4,
    decimalSep: '.',
    exportFormat: 'pdf',
    filename: 'TerraShield_Reporte'
  },
  locationValidated: false,
  validatedData: null,
  mallaHistoria: [],
  exportarDesbloqueado: false,
};

/* =============================================
   BOOT SEQUENCE
   ============================================= */
(function boot() {
  const bar    = document.getElementById('boot-bar');
  const splash = document.getElementById('screen-splash');

  const steps = [
    { pct: 25,  delay: 120 },
    { pct: 55,  delay: 300 },
    { pct: 78,  delay: 500 },
    { pct: 92,  delay: 700 },
    { pct: 100, delay: 900 }
  ];

  steps.forEach(s => {
    setTimeout(() => { bar.style.width = s.pct + '%'; }, s.delay);
  });

  setTimeout(() => {
    splash.style.opacity = '0';
    setTimeout(() => {
      splash.style.display = 'none';
      showScreen('screen-home');
    }, 600);
  }, 1200);
})();

/* =============================================
   SCREEN NAVIGATION
   ============================================= */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });
  const target = document.getElementById(id);
  if (target) {
    target.style.display = 'flex';
    target.classList.add('active');
  }
}

/* =============================================
   MODAL MANAGEMENT
   ============================================= */
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// Cerrar modal al hacer clic en el overlay
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', function(e) {
    if (e.target === this) this.classList.remove('open');
  });
});

/* =============================================
   PAGE NAVIGATION (App)
   ============================================= */
function showPage(pageId, navItem) {
  document.querySelectorAll('.section-page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById(pageId);
  if (page) page.classList.add('active');

  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (navItem) navItem.classList.add('active');

  const labels = {
    'page-inicio':     'INICIO',
    'page-datos':      'DATOS GENERALES',
    'page-apant':      'APANTALLAMIENTO',
    'page-malla':      'MALLA A TIERRA',
    'page-verif':      'VERIFICACIONES',
    'page-resultados': 'RESULTADOS',
    'page-exportar':   'EXPORTAR REPORTE'
  };
  document.getElementById('topbar-section-name').textContent = labels[pageId] || pageId;

  /* ── SPAT: inicializar cuando se abre Apantallamiento ── */
  if (pageId === 'page-apant') {
    const appContent = document.querySelector('.app-content');
    if (appContent) {
      appContent.style.padding = '0';
      appContent.style.overflow = 'hidden';
    }
    setTimeout(() => {
      if (typeof spatInit3D === 'function' && !window.spatInited) {
        spatInit3D();
        spatCalcIEEE();
        spatRender();
      } else if (window.spatInited) {
        /* ya iniciado: solo refrescar tamaño del renderer */
        const c = document.getElementById('spat-container3D');
        if (c && window.spatRenderer) {
          window.spatRenderer.setSize(c.clientWidth, c.clientHeight);
          window.spatCamera.aspect = c.clientWidth / c.clientHeight;
          window.spatCamera.updateProjectionMatrix();
        }
      }
    }, 80);
  } else {
    /* Restaurar padding normal en otras páginas */
    const appContent = document.querySelector('.app-content');
    if (appContent) {
      appContent.style.padding = '';
      appContent.style.overflow = '';
    }
  }
}

/* =============================================
   APANTALLAMIENTO: METHOD SELECT
   ============================================= */
function selectMethod(card) {
  document.querySelectorAll('.method-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
}

/* =============================================
   APANTALLAMIENTO: Ng DESDE Td
   Ng = 0.0017 × Td^1.56  (IEEE Std 998)
   ============================================= */
function calcNgFromTd() {
  const td      = parseFloat(document.getElementById('apant-td')?.value);
  const ngInput = document.getElementById('apant-ng-calc');
  const fuente  = document.getElementById('apant-ng-fuente');
  if (!ngInput) return;

  if (!isNaN(td) && td > 0) {
    const ng = parseFloat((0.0017 * Math.pow(td, 1.56)).toFixed(3));
    ngInput.value = ng;
    if (fuente) fuente.textContent = `Calculado: Ng = 0.0017 × ${td}^1.56 = ${ng} flashes/km²/año (IEEE Std 998)`;
  } else {
    // Restaurar valor de referencia del proyecto si Td se borra
    const d = AppState.validatedData;
    if (d) {
      ngInput.value = d.ngDisplay || (d.ng !== null && d.ng !== undefined ? d.ng : 'No disponible');
      if (fuente) fuente.textContent = d.ng !== null ? `Valor de referencia departamental — ${d.departamento}` : 'Sin datos para esta zona';
    } else {
      ngInput.value = '';
      if (fuente) fuente.textContent = '';
    }
  }
}

/* =============================================
   CREATE PROJECT
   ============================================= */
function crearProyecto() {
  const name = document.getElementById('new-proj-name').value.trim();
  if (!name) {
    showToast('Ingrese un nombre para el proyecto', 'error');
    document.getElementById('new-proj-name').classList.add('error');
    return;
  }
  document.getElementById('new-proj-name').classList.remove('error');

  if (!AppState.locationValidated) {
    showToast('Valide la ubicación antes de crear el proyecto', 'error');
    return;
  }

  AppState.currentProject = {
    version: '1.0.0',
    nombre: name,
    tipo: 'Subestacion',
    creado: new Date().toISOString(),
    ubicacion: AppState.validatedData || {},
    datosGenerales: {},
    apantallamiento: {},
    malla: {},
    resultados: {}
  };

  document.getElementById('sb-proj-name').textContent = name;
  document.getElementById('topbar-proj-breadcrumb').textContent = `/ ${name}`;
  document.getElementById('dg-nombre').value = name;

  if (AppState.validatedData) {
    const d = AppState.validatedData;
    document.getElementById('stat-ng').textContent        = d.ng;
    document.getElementById('stat-ubicacion').textContent = d.municipio || '—';
    document.getElementById('stat-depto').textContent     = d.departamento || '—';
    document.getElementById('res-ng').textContent         = d.ng;

    // Temperatura en panel principal
    const statTemp = document.getElementById('stat-temp');
    if (statTemp) statTemp.textContent = d.temp ? d.temp.toFixed(1) : '—';

    // Pre-rellenar Tamb en módulo de malla
    if (d.temp) {
      const mTamb = document.getElementById('m-Tamb');
      const mTambFuente = document.getElementById('m-Tamb-fuente');
      if (mTamb) mTamb.value = parseFloat(d.temp.toFixed(1));
      if (mTambFuente) mTambFuente.style.display = '';
    }

    // Resistividad y tipo de suelo en datos generales
    const inputRho = document.getElementById('dg-resistividad');
    const fuenteRho = document.getElementById('dg-resistividad-fuente');
    const inputTipo = document.getElementById('dg-tipo-suelo');
    if (inputRho && d.rhoSuelo) {
      inputRho.value = d.rhoSuelo;
      if (fuenteRho) {
        fuenteRho.textContent = `Estimación preliminar — ${d.sueloFuente || 'IGAC/IEEE 80'}`;
        fuenteRho.style.display = 'block';
      }
    }
    if (inputTipo && d.tipoSuelo) inputTipo.value = d.tipoSuelo;

    // Ng en módulo de apantallamiento
    const apantNg     = document.getElementById('apant-ng-calc');
    const apantFuente = document.getElementById('apant-ng-fuente');
    if (apantNg) {
      apantNg.value = d.ng !== null && d.ng !== undefined ? d.ng : 'No disponible';
      if (apantFuente) apantFuente.textContent = d.ng !== null ? `Valor de referencia departamental — ${d.departamento}` : 'Sin datos para esta zona (San Andrés). Puede ingresar Td manualmente.';
    }
  }

  // Crear archivo de historial en servidor
  fetch('/proyectos/nuevo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre: name })
  }).catch(() => {});

  // Resetear historial y estado de exportación
  AppState.mallaHistoria = [];
  AppState.exportarDesbloqueado = false;
  if (typeof mallaUpdateExportState === 'function') mallaUpdateExportState([]);

  closeModal('modal-new-project');
  showScreen('screen-app');
  showToast(`Proyecto "${name}" creado exitosamente`, 'success');
}

/* =============================================
   LOAD PROJECT (JSON)
   ============================================= */
function loadProject() {
  document.getElementById('file-input-project').click();
}

function handleProjectFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const proj = JSON.parse(e.target.result);
      AppState.currentProject  = proj;
      AppState.locationValidated = true;
      AppState.validatedData   = proj.ubicacion || null;

      const name = proj.nombre || 'Proyecto cargado';
      document.getElementById('sb-proj-name').textContent = name;
      document.getElementById('topbar-proj-breadcrumb').textContent = `/ ${name}`;
      if (proj.datosGenerales?.nombre) {
        document.getElementById('dg-nombre').value = proj.datosGenerales.nombre;
      }

      if (proj.ubicacion) {
        const d = proj.ubicacion;
        if (d.ng)           { document.getElementById('stat-ng').textContent = d.ng; document.getElementById('res-ng').textContent = d.ng; }
        if (d.municipio)    document.getElementById('stat-ubicacion').textContent = d.municipio;
        if (d.departamento) document.getElementById('stat-depto').textContent     = d.departamento;
        const statTemp = document.getElementById('stat-temp');
        if (statTemp && d.temp) statTemp.textContent = parseFloat(d.temp).toFixed(1);
        if (d.temp) {
          const mTamb = document.getElementById('m-Tamb');
          const mTambFuente = document.getElementById('m-Tamb-fuente');
          if (mTamb) mTamb.value = parseFloat(parseFloat(d.temp).toFixed(1));
          if (mTambFuente) mTambFuente.style.display = '';
        }
        const inputRho  = document.getElementById('dg-resistividad');
        const fuenteRho = document.getElementById('dg-resistividad-fuente');
        const inputTipo = document.getElementById('dg-tipo-suelo');
        if (inputRho  && d.rhoSuelo)  { inputRho.value = d.rhoSuelo; if (fuenteRho) { fuenteRho.textContent = `Estimación preliminar — ${d.sueloFuente || 'IGAC/IEEE 80'}`; fuenteRho.style.display = 'block'; } }
        if (inputTipo && d.tipoSuelo) inputTipo.value = d.tipoSuelo;
      }

      // Crear archivo de historial si no existe y cargar historial previo
      fetch('/proyectos/nuevo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: name })
      }).then(() =>
        fetch(`/proyectos/${encodeURIComponent(name)}`)
      ).then(r => r.json()).then(hist => {
        AppState.mallaHistoria = hist;
        if (typeof mallaRenderHistorial === 'function')   mallaRenderHistorial(hist);
        if (typeof mallaUpdateExportState === 'function') mallaUpdateExportState(hist);
      }).catch(() => {
        AppState.mallaHistoria = [];
        AppState.exportarDesbloqueado = false;
      });

      showScreen('screen-app');
      showToast(`Proyecto "${name}" cargado correctamente`, 'success');
    } catch (err) {
      showToast('Error al leer el archivo JSON', 'error');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

/* =============================================
   SAVE PROJECT (JSON)
   ============================================= */
function saveProject() {
  if (!AppState.currentProject) {
    showToast('No hay proyecto activo para guardar', 'error');
    return;
  }

  AppState.currentProject.datosGenerales = {
    nombre:      document.getElementById('dg-nombre')?.value || AppState.currentProject.nombre,
    actualizado: new Date().toISOString()
  };

  const blob = new Blob([JSON.stringify(AppState.currentProject, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = (AppState.config.filename || 'TerraShield_Proyecto') + '.json';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Proyecto guardado como JSON', 'success');
}

/* =============================================
   EXPORT TXT
   ============================================= */
function exportTXT() {
  if (!AppState.currentProject) { showToast('No hay proyecto activo', 'error'); return; }
  const p = AppState.currentProject;
  const d = p.ubicacion || {};
  let txt  = `=== TERRASHIELD v1.0.0 — REPORTE TÉCNICO ===\n`;
  txt += `Fecha: ${new Date().toLocaleString('es-CO')}\n\n`;
  txt += `PROYECTO: ${p.nombre || '—'}\n`;
  txt += `Tipo: Subestación eléctrica\n\n`;
  txt += `--- UBICACIÓN ---\n`;
  txt += `Departamento: ${d.departamento || '—'}\n`;
  txt += `Municipio: ${d.municipio || '—'}\n`;
  txt += `Latitud: ${d.lat || '—'}°N\n`;
  txt += `Longitud: ${d.lon || '—'}°W\n`;
  txt += `Ng (densidad de rayos): ${d.ng || '—'} rayos/km²/año\n`;
  txt += `Temperatura estimada: ${d.temp || '—'} °C\n\n`;
  txt += `--- APANTALLAMIENTO ---\nEn espera de cálculo (backend Python).\n\n`;
  txt += `--- MALLA A TIERRA ---\nEn espera de cálculo (backend Python).\n\n`;
  txt += `=== FIN DEL REPORTE ===\n`;

  const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = (AppState.config.filename || 'TerraShield') + '.txt';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Reporte TXT exportado', 'success');
}

/* =============================================
   CONFIGURATION
   ============================================= */
function setTheme(theme) {
  AppState.config.theme = theme;
  if (theme === 'dark') {
    document.body.classList.add('dark-theme');
    document.getElementById('theme-dark-btn').classList.add('active');
    document.getElementById('theme-light-btn').classList.remove('active');
  } else {
    document.body.classList.remove('dark-theme');
    document.getElementById('theme-light-btn').classList.add('active');
    document.getElementById('theme-dark-btn').classList.remove('active');
  }
}

function toggleDecSep(btn, sep) {
  btn.closest('.toggle-group').querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  AppState.config.decimalSep = sep;
}

function toggleExportFmt(btn, fmt) {
  btn.closest('.toggle-group').querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  AppState.config.exportFormat = fmt;
}

function saveConfig() {
  AppState.config.decimals = parseInt(document.getElementById('cfg-decimals').value) || 4;
  AppState.config.filename = document.getElementById('cfg-filename').value || 'TerraShield_Reporte';
  closeModal('modal-config');
  showToast('Configuración guardada', 'success');
}

function resetConfig() {
  document.getElementById('cfg-decimals').value = 4;
  document.getElementById('cfg-filename').value = 'TerraShield_Reporte';
  setTheme('light');
  showToast('Configuración restablecida', 'info');
}

/* =============================================
   TOAST NOTIFICATIONS
   ============================================= */
function showToast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast     = document.createElement('div');
  toast.className = `toast ${type === 'success' ? 'success' : type === 'error' ? 'error' : ''}`;

  let icon = '';
  if (type === 'success')
    icon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>`;
  else if (type === 'error')
    icon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
  else
    icon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;

  toast.innerHTML = `${icon} <span>${msg}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity   = '0';
    toast.style.transform = 'translateY(16px)';
    toast.style.transition = 'opacity 0.3s, transform 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

/* =============================================
   KEYBOARD SHORTCUTS
   ============================================= */
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
  }
});