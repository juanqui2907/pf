/* ═══════════════════════════════════════════════════════
   SPAT v5.0 — ui.js
   Responsabilidades:
     · Inyectar OrbitControls (no hay CDN r128 oficial)
     · Sincronizar sliders ↔ inputs numéricos
     · Botones de modo, render, cámara, tabs
     · Actualizar tarjetas de resultados y niveles NP
     · Dibujar el Canvas 2D (planta)
═══════════════════════════════════════════════════════ */

/* ── OrbitControls inyectados (compatible THREE r128) ── */
(function () {
  const E = THREE;

  class OrbitControls extends E.EventDispatcher {
    constructor(object, domElement) {
      super();
      this.object     = object;
      this.domElement = domElement;
      this.enabled       = true;
      this.target        = new E.Vector3();
      this.minDistance   = 0;
      this.maxDistance   = Infinity;
      this.minPolarAngle = 0;
      this.maxPolarAngle = Math.PI;
      this.enableDamping  = false;
      this.dampingFactor  = 0.05;
      this.enableZoom    = true;
      this.zoomSpeed     = 1;
      this.enableRotate  = true;
      this.rotateSpeed   = 1;
      this.enablePan     = true;
      this.panSpeed      = 1;
      this.screenSpacePanning = true;

      let thetaDelta = 0, phiDelta = 0, scale = 1;
      const panOffset = new E.Vector3();
      const lastMouse = new E.Vector2();
      const currMouse = new E.Vector2();
      const deltaMouse = new E.Vector2();
      let isRotating = false, isPanning = false;

      /* Zoom con rueda */
      const onWheel = (e) => {
        if (!this.enabled) return;
        e.preventDefault();
        scale *= e.deltaY < 0 ? (1 / Math.pow(0.95, this.zoomSpeed)) : Math.pow(0.95, this.zoomSpeed);
      };

      /* Mouse */
      const onMouseDown = (e) => {
        if (!this.enabled) return;
        if (e.button === 0) { isRotating = true; lastMouse.set(e.clientX, e.clientY); }
        if (e.button === 2) { isPanning  = true; lastMouse.set(e.clientX, e.clientY); }
      };
      const onMouseMove = (e) => {
        if (!this.enabled) return;
        currMouse.set(e.clientX, e.clientY);
        deltaMouse.subVectors(currMouse, lastMouse);
        const h = domElement.clientHeight;
        if (isRotating) {
          thetaDelta -= (deltaMouse.x / h) * Math.PI * this.rotateSpeed;
          phiDelta   -= (deltaMouse.y / h) * Math.PI * this.rotateSpeed;
        }
        if (isPanning) {
          const dist = new E.Vector3().subVectors(this.object.position, this.target).length();
          const fac  = dist / h * this.panSpeed;
          const right = new E.Vector3().setFromMatrixColumn(this.object.matrix, 0);
          const up    = new E.Vector3().setFromMatrixColumn(this.object.matrix, 1);
          panOffset.addScaledVector(right, -deltaMouse.x * fac);
          panOffset.addScaledVector(up,     deltaMouse.y * fac);
        }
        lastMouse.copy(currMouse);
      };
      const onMouseUp = () => { isRotating = false; isPanning = false; };

      /* Touch */
      const onTouchStart = (e) => { if (e.touches.length === 1) lastMouse.set(e.touches[0].pageX, e.touches[0].pageY); };
      const onTouchMove  = (e) => {
        if (!this.enabled || e.touches.length !== 1) return;
        e.preventDefault();
        currMouse.set(e.touches[0].pageX, e.touches[0].pageY);
        deltaMouse.subVectors(currMouse, lastMouse);
        thetaDelta -= (deltaMouse.x / domElement.clientHeight) * Math.PI * this.rotateSpeed;
        phiDelta   -= (deltaMouse.y / domElement.clientHeight) * Math.PI * this.rotateSpeed;
        lastMouse.copy(currMouse);
        this.update();
      };

      domElement.addEventListener('wheel',      onWheel,      { passive: false });
      domElement.addEventListener('mousedown',  onMouseDown);
      domElement.addEventListener('mousemove',  onMouseMove);
      domElement.addEventListener('mouseup',    onMouseUp);
      domElement.addEventListener('touchstart', onTouchStart, { passive: false });
      domElement.addEventListener('touchmove',  onTouchMove,  { passive: false });

      this.update = () => {
        const sph = new E.Spherical().setFromVector3(
          new E.Vector3().subVectors(this.object.position, this.target)
        );
        if (this.enableDamping) {
          sph.theta += thetaDelta * this.dampingFactor;
          sph.phi   += phiDelta   * this.dampingFactor;
          thetaDelta *= (1 - this.dampingFactor);
          phiDelta   *= (1 - this.dampingFactor);
        } else {
          sph.theta += thetaDelta; thetaDelta = 0;
          sph.phi   += phiDelta;   phiDelta   = 0;
        }
        sph.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, sph.phi));
        sph.makeSafe();
        sph.radius *= scale;
        sph.radius  = Math.max(this.minDistance, Math.min(this.maxDistance, sph.radius));
        scale = 1;
        this.target.add(panOffset);
        panOffset.set(0, 0, 0);
        this.object.position.copy(new E.Vector3().setFromSpherical(sph).add(this.target));
        this.object.lookAt(this.target);
        this.object.updateMatrixWorld();
      };

      this.dispose = () => {
        domElement.removeEventListener('wheel',      onWheel);
        domElement.removeEventListener('mousedown',  onMouseDown);
        domElement.removeEventListener('mousemove',  onMouseMove);
        domElement.removeEventListener('mouseup',    onMouseUp);
        domElement.removeEventListener('touchstart', onTouchStart);
        domElement.removeEventListener('touchmove',  onTouchMove);
      };
    }
  }

  THREE.OrbitControls = OrbitControls;
})();

/* ════════════════════════════════════════════════════════
   UI STATE
════════════════════════════════════════════════════════ */
const UI = {
  mode: 'auto',
  renderTimer: null,
};

/* ── Sincronizar slider ↔ number ── */
function syncPair(sliderId, numberId, labelId) {
  const slider = document.getElementById(sliderId);
  const number = document.getElementById(numberId);
  const label  = document.getElementById(labelId);

  const update = (src) => {
    const v = src.value;
    slider.value = v;
    number.value = v;
    if (label) label.textContent = v;
    UI.scheduleRender();
  };

  slider.addEventListener('input', () => update(slider));
  number.addEventListener('input', () => update(number));
}

/* ── Debounce render ── */
UI.scheduleRender = function () {
  clearTimeout(UI.renderTimer);
  UI.renderTimer = setTimeout(() => {
    if (typeof SPAT !== 'undefined' && SPAT.initialized) SPAT.renderizar();
  }, 200);
};

/* ── Leer valor numérico de un campo ── */
function getVal(id) {
  return parseFloat(document.getElementById(id).value) || 0;
}

/* ════════════════════════════════════════════════════════
   INICIALIZAR EVENTOS DE UI
════════════════════════════════════════════════════════ */
function initUI() {
  /* Sincronizar pares slider/number */
  syncPair('s-largo',  'n-largo',  'lbl-L');
  syncPair('s-ancho',  'n-ancho',  'lbl-A');
  syncPair('s-equipo', 'n-equipo', 'lbl-He');
  syncPair('s-radio',  'n-radio',  'lbl-R');
  syncPair('s-punta',  'n-punta',  'lbl-Hp');

  /* Botones de modo */
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      UI.mode = btn.dataset.mode;
      UI.scheduleRender();
    });
  });

  /* Botón principal */
  document.getElementById('btn-render').addEventListener('click', () => {
    if (typeof SPAT !== 'undefined') SPAT.renderizar();
  });

  /* Resetear cámara */
  document.getElementById('btn-reset-cam').addEventListener('click', () => {
    if (typeof SPAT !== 'undefined') SPAT.resetCamera();
  });

  /* Tabs 2D */
  document.getElementById('tab-planta').addEventListener('click', () => {
    document.getElementById('tab-planta').classList.add('active');
    document.getElementById('tab-corte').classList.remove('active');
  });
  document.getElementById('tab-corte').addEventListener('click', () => {
    document.getElementById('tab-corte').classList.add('active');
    document.getElementById('tab-planta').classList.remove('active');
  });
}

/* ════════════════════════════════════════════════════════
   ACTUALIZAR RESULTADOS
════════════════════════════════════════════════════════ */
function actualizarResultados(r_suelo, nPuntas, hTotal, cobertura) {
  document.getElementById('r-r_suelo').textContent  = r_suelo.toFixed(2) + ' m';
  document.getElementById('r-npuntas').textContent  = nPuntas;
  document.getElementById('r-htotal').textContent   = hTotal.toFixed(1) + ' m';

  const el = document.getElementById('r-cobertura');
  el.textContent = cobertura + '%';
  el.className   = 'stat-val ' + (cobertura >= 95 ? 'ok' : cobertura >= 70 ? '' : 'warn');
}

function actualizarNiveles(R) {
  const niveles = [
    { id: 'np-I',   Rref: 20 },
    { id: 'np-II',  Rref: 30 },
    { id: 'np-III', Rref: 45 },
    { id: 'np-IV',  Rref: 60 },
  ];
  niveles.forEach(({ id, Rref }) => {
    const el = document.getElementById(id);
    if (R <= Rref) {
      el.textContent = '● ACTIVO';
      el.className   = 'stat-val ok';
    } else {
      el.textContent = '○ —';
      el.className   = 'stat-val';
      el.style.color = 'var(--text-dim)';
    }
  });
}

function actualizarOverlay(mode, nPuntas, cobertura) {
  document.getElementById('vp-info').innerHTML =
    `MODO: ${mode.toUpperCase()}<br>PUNTAS: ${nPuntas}<br>COB: ${cobertura}%`;
}

function mostrarAlerta(visible) {
  document.getElementById('alert-box').classList.toggle('show', visible);
}

/* ════════════════════════════════════════════════════════
   CANVAS 2D — PLANTA
════════════════════════════════════════════════════════ */
function dibujarPlanta(L, A, r_suelo, puntas) {
  const canvas = document.getElementById('canvas2D');
  const ctx    = canvas.getContext('2d');
  const W      = canvas.offsetWidth;
  const Hc     = canvas.offsetHeight || W;
  canvas.width  = W;
  canvas.height = Hc;

  const scale = Math.min((W * 0.7) / L, (Hc * 0.7) / A);
  const cx = W / 2;
  const cy = Hc / 2;

  /* Fondo */
  ctx.fillStyle = '#050810';
  ctx.fillRect(0, 0, W, Hc);

  /* Grid fino */
  ctx.strokeStyle = '#0f1a2e';
  ctx.lineWidth   = 0.5;
  for (let i = 0; i < W; i += 20) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, Hc); ctx.stroke(); }
  for (let j = 0; j < Hc; j += 20) { ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(W, j); ctx.stroke(); }

  /* Domos de protección */
  puntas.forEach(p => {
    const px = cx + p.x * scale;
    const pz = cy + p.z * scale;
    const r  = r_suelo * scale;
    const grad = ctx.createRadialGradient(px, pz, 0, px, pz, r);
    grad.addColorStop(0, 'rgba(0,212,255,0.22)');
    grad.addColorStop(1, 'rgba(0,212,255,0)');
    ctx.beginPath();
    ctx.arc(px, pz, r, 0, Math.PI * 2);
    ctx.fillStyle   = grad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,212,255,0.5)';
    ctx.lineWidth   = 1;
    ctx.stroke();
  });

  /* Perímetro subestación */
  ctx.strokeStyle = '#4a90d9';
  ctx.lineWidth   = 2;
  ctx.strokeRect(cx - (L * scale) / 2, cy - (A * scale) / 2, L * scale, A * scale);
  ctx.fillStyle = 'rgba(74,144,217,0.05)';
  ctx.fillRect(cx - (L * scale) / 2, cy - (A * scale) / 2, L * scale, A * scale);

  /* Transformador */
  const tW = L * 0.25 * scale;
  const tH = A * 0.35 * scale;
  ctx.fillStyle   = 'rgba(255,215,0,0.25)';
  ctx.fillRect(cx - tW / 2, cy - tH / 2, tW, tH);
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth   = 1;
  ctx.strokeRect(cx - tW / 2, cy - tH / 2, tW, tH);

  /* Puntas captadoras */
  puntas.forEach(p => {
    const px = cx + p.x * scale;
    const pz = cy + p.z * scale;
    ctx.beginPath();
    ctx.arc(px, pz, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#00ff88';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(px, pz, 6, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0,255,136,0.35)';
    ctx.lineWidth   = 1;
    ctx.stroke();
  });

  /* Escala gráfica */
  const esc_m  = 10;
  const esc_px = esc_m * scale;
  const ex = W - 20;
  const ey = Hc - 16;
  ctx.strokeStyle = '#5a7a9a';
  ctx.lineWidth   = 1.5;
  ctx.beginPath(); ctx.moveTo(ex - esc_px, ey); ctx.lineTo(ex, ey); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(ex - esc_px, ey - 4); ctx.lineTo(ex - esc_px, ey + 4); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(ex, ey - 4); ctx.lineTo(ex, ey + 4); ctx.stroke();
  ctx.fillStyle  = '#5a7a9a';
  ctx.font       = '9px "Share Tech Mono", monospace';
  ctx.textAlign  = 'center';
  ctx.fillText(esc_m + 'm', ex - esc_px / 2, ey - 6);
}
