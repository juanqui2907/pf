<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SPAT v5.0 — Sistema de Protección Atmosférica</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@400;600;700&display=swap');

  :root {
    --bg: #0a0e1a;
    --panel: #0f1526;
    --border: #1e2d4a;
    --accent: #00d4ff;
    --accent2: #ff6b35;
    --green: #00ff88;
    --text: #c8d8f0;
    --text-dim: #5a7a9a;
    --sphere-color: #00d4ff;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Rajdhani', sans-serif;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* HEADER */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    background: var(--panel);
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }
  .header-logo {
    font-family: 'Share Tech Mono', monospace;
    font-size: 18px;
    color: var(--accent);
    letter-spacing: 3px;
  }
  .header-logo span { color: var(--accent2); }
  .header-status {
    display: flex; gap: 16px; align-items: center;
    font-size: 12px; color: var(--text-dim);
    font-family: 'Share Tech Mono', monospace;
  }
  .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green); 
         box-shadow: 0 0 8px var(--green); animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

  /* MAIN LAYOUT */
  .main {
    display: grid;
    grid-template-columns: 280px 1fr 260px;
    flex: 1;
    overflow: hidden;
  }

  /* PANELS */
  .panel {
    background: var(--panel);
    border-right: 1px solid var(--border);
    padding: 16px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .panel:last-child { border-right: none; border-left: 1px solid var(--border); }

  .panel-title {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px;
    letter-spacing: 3px;
    color: var(--accent);
    border-bottom: 1px solid var(--border);
    padding-bottom: 8px;
    text-transform: uppercase;
  }

  /* FORM FIELDS */
  .field-group { display: flex; flex-direction: column; gap: 6px; }
  .field-label {
    font-size: 11px; letter-spacing: 1px; color: var(--text-dim);
    font-family: 'Share Tech Mono', monospace;
    display: flex; justify-content: space-between;
  }
  .field-label span { color: var(--accent); }

  input[type="range"] {
    width: 100%; -webkit-appearance: none;
    height: 3px; background: var(--border); border-radius: 2px; cursor: pointer;
  }
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%;
    background: var(--accent); box-shadow: 0 0 8px var(--accent); cursor: pointer;
  }
  input[type="number"] {
    background: var(--bg); border: 1px solid var(--border); color: var(--text);
    padding: 6px 10px; border-radius: 4px; width: 100%;
    font-family: 'Share Tech Mono', monospace; font-size: 13px;
    transition: border 0.2s;
  }
  input[type="number"]:focus { outline: none; border-color: var(--accent); }

  .btn {
    padding: 10px 16px; border: none; border-radius: 4px; cursor: pointer;
    font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 14px;
    letter-spacing: 2px; transition: all 0.2s; width: 100%;
  }
  .btn-primary {
    background: var(--accent); color: #000;
    box-shadow: 0 0 20px rgba(0,212,255,0.3);
  }
  .btn-primary:hover { box-shadow: 0 0 30px rgba(0,212,255,0.6); transform: translateY(-1px); }
  .btn-secondary {
    background: transparent; color: var(--text-dim);
    border: 1px solid var(--border); margin-top: -8px;
  }
  .btn-secondary:hover { border-color: var(--accent2); color: var(--accent2); }

  /* Modo selector */
  .mode-selector { display: flex; gap: 4px; }
  .mode-btn {
    flex: 1; padding: 7px; font-size: 11px; letter-spacing: 1px;
    background: var(--bg); border: 1px solid var(--border);
    color: var(--text-dim); cursor: pointer; border-radius: 4px; font-family: 'Share Tech Mono', monospace;
    transition: all 0.2s;
  }
  .mode-btn.active { background: rgba(0,212,255,0.15); border-color: var(--accent); color: var(--accent); }

  /* 3D VIEWPORT */
  #viewport {
    position: relative;
    background: #050810;
  }
  #container3D { width: 100%; height: 100%; }
  
  .viewport-overlay {
    position: absolute; top: 12px; left: 12px;
    font-family: 'Share Tech Mono', monospace; font-size: 10px;
    color: var(--text-dim); pointer-events: none;
    line-height: 1.8;
  }
  .viewport-mode {
    position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%);
    font-family: 'Share Tech Mono', monospace; font-size: 11px;
    color: var(--accent); letter-spacing: 2px; pointer-events: none;
    background: rgba(0,0,0,0.5); padding: 4px 12px; border-radius: 20px;
    border: 1px solid rgba(0,212,255,0.2);
  }

  /* RESULTADOS */
  .results-card {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 12px;
  }
  .results-card .card-title {
    font-size: 10px; letter-spacing: 2px; color: var(--text-dim);
    font-family: 'Share Tech Mono', monospace; margin-bottom: 10px;
  }
  .stat-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 6px 0; border-bottom: 1px solid var(--border);
    font-size: 13px;
  }
  .stat-row:last-child { border-bottom: none; }
  .stat-label { color: var(--text-dim); font-size: 12px; }
  .stat-val { color: var(--accent); font-family: 'Share Tech Mono', monospace; font-weight: bold; }
  .stat-val.warn { color: var(--accent2); }
  .stat-val.ok { color: var(--green); }

  /* LEGEND */
  .legend-item { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text-dim); }
  .legend-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }

  /* Tabs 2D/3D */
  .tab-bar { display: flex; gap: 2px; margin-bottom: 4px; }
  .tab { flex: 1; padding: 6px; font-size: 11px; text-align: center; cursor: pointer;
         background: var(--bg); border: 1px solid var(--border); border-radius: 3px;
         color: var(--text-dim); font-family: 'Share Tech Mono', monospace; transition: all 0.2s; }
  .tab.active { background: rgba(0,212,255,0.1); border-color: var(--accent); color: var(--accent); }

  #canvas2D {
    width: 100%; aspect-ratio: 1;
    background: #050810;
    border-radius: 4px;
    border: 1px solid var(--border);
  }

  /* Separador decorativo */
  .sep {
    height: 1px; background: linear-gradient(90deg, transparent, var(--border), transparent);
  }

  /* ALERT */
  .alert-box {
    background: rgba(255,107,53,0.1); border: 1px solid rgba(255,107,53,0.4);
    border-radius: 4px; padding: 10px 12px; font-size: 12px; color: var(--accent2);
    display: none;
  }
  .alert-box.show { display: block; }

  scrollbar-width: thin;
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
</style>
</head>
<body>

<!-- HEADER -->
<div class="header">
  <div class="header-logo">SPAT <span>v5.0</span> — ESFERA RODANTE</div>
  <div class="header-status">
    <div class="dot"></div>
    <span>SISTEMA ACTIVO</span>
    <span id="hdr-norma">NFC 17-102 / IEC 62305</span>
  </div>
</div>

<!-- MAIN -->
<div class="main">

  <!-- PANEL IZQUIERDO: CONFIGURACIÓN -->
  <div class="panel">
    <div class="panel-title">⚡ Parámetros de Entrada</div>

    <!-- Geometría de la subestación -->
    <div class="field-group">
      <div class="field-label">LARGO (m) <span id="lbl-L">50</span></div>
      <input type="range" id="s-largo" min="10" max="150" value="50" oninput="syncVal('s-largo','n-largo','lbl-L'); autoRender()">
      <input type="number" id="n-largo" value="50" min="10" max="150" oninput="syncVal('n-largo','s-largo','lbl-L'); autoRender()">
    </div>

    <div class="field-group">
      <div class="field-label">ANCHO (m) <span id="lbl-A">30</span></div>
      <input type="range" id="s-ancho" min="10" max="100" value="30" oninput="syncVal('s-ancho','n-ancho','lbl-A'); autoRender()">
      <input type="number" id="n-ancho" value="30" min="10" max="100" oninput="syncVal('n-ancho','s-ancho','lbl-A'); autoRender()">
    </div>

    <div class="field-group">
      <div class="field-label">ALTURA EQUIPO CRÍTICO (m) <span id="lbl-He">6</span></div>
      <input type="range" id="s-equipo" min="1" max="30" value="6" oninput="syncVal('s-equipo','n-equipo','lbl-He'); autoRender()">
      <input type="number" id="n-equipo" value="6" min="1" max="30" oninput="syncVal('n-equipo','s-equipo','lbl-He'); autoRender()">
    </div>

    <div class="sep"></div>
    <div class="panel-title">🛡 Esfera Rodante</div>

    <div class="field-group">
      <div class="field-label">RADIO ESFERA R (m) <span id="lbl-R">30</span></div>
      <input type="range" id="s-radio" min="10" max="60" value="30" oninput="syncVal('s-radio','n-radio','lbl-R'); autoRender()">
      <input type="number" id="n-radio" value="30" min="10" max="60" oninput="syncVal('n-radio','s-radio','lbl-R'); autoRender()">
    </div>

    <div class="field-group">
      <div class="field-label">ALTURA PUNTA CAPTADORA (m) <span id="lbl-Hp">8</span></div>
      <input type="range" id="s-punta" min="1" max="25" value="8" oninput="syncVal('s-punta','n-punta','lbl-Hp'); autoRender()">
      <input type="number" id="n-punta" value="8" min="1" max="25" oninput="syncVal('n-punta','s-punta','lbl-Hp'); autoRender()">
    </div>

    <div class="sep"></div>
    <div class="panel-title">📐 Modo de Posición</div>

    <div class="mode-selector">
      <button class="mode-btn active" id="mode-auto" onclick="setMode('auto')">AUTO</button>
      <button class="mode-btn" id="mode-perim" onclick="setMode('perim')">PERÍMETRO</button>
      <button class="mode-btn" id="mode-grid" onclick="setMode('grid')">GRILLA</button>
    </div>

    <div class="alert-box" id="alert-box">⚠ El radio de la esfera debe ser mayor que la altura del equipo crítico.</div>

    <button class="btn btn-primary" onclick="renderizar()">▶ CALCULAR Y RENDERIZAR</button>
    <button class="btn btn-secondary" onclick="resetCamara()">↺ RESETEAR CÁMARA</button>

    <!-- Leyenda -->
    <div class="sep"></div>
    <div class="panel-title">LEYENDA</div>
    <div style="display:flex;flex-direction:column;gap:8px">
      <div class="legend-item"><div class="legend-dot" style="background:#00d4ff;box-shadow:0 0 6px #00d4ff"></div> Domo de Protección</div>
      <div class="legend-item"><div class="legend-dot" style="background:#ff6b35;box-shadow:0 0 6px #ff6b35"></div> Zona No Protegida</div>
      <div class="legend-item"><div class="legend-dot" style="background:#00ff88;box-shadow:0 0 6px #00ff88"></div> Punta Captadora</div>
      <div class="legend-item"><div class="legend-dot" style="background:#4a90d9"></div> Estructura Civil</div>
      <div class="legend-item"><div class="legend-dot" style="background:#ffd700"></div> Transformador</div>
    </div>
  </div>

  <!-- VIEWPORT 3D -->
  <div id="viewport">
    <div id="container3D"></div>
    <div class="viewport-overlay" id="vp-info">
      MODO: —<br>
      PUNTAS: —<br>
      COBERTURA: —
    </div>
    <div class="viewport-mode">ÓRBITA LIBRE · SCROLL ZOOM · DOBLE-CLIC RESET</div>
  </div>

  <!-- PANEL DERECHO: RESULTADOS -->
  <div class="panel">
    <div class="panel-title">📊 Resultados</div>

    <div class="results-card">
      <div class="card-title">GEOMETRÍA DE PROTECCIÓN</div>
      <div class="stat-row"><span class="stat-label">Radio eficaz en suelo</span><span class="stat-val" id="r-r_suelo">—</span></div>
      <div class="stat-row"><span class="stat-label">Puntas captadoras</span><span class="stat-val" id="r-npuntas">—</span></div>
      <div class="stat-row"><span class="stat-label">Altura total (pórtico+punta)</span><span class="stat-val" id="r-htotal">—</span></div>
      <div class="stat-row"><span class="stat-label">Cobertura estimada</span><span class="stat-val ok" id="r-cobertura">—</span></div>
    </div>

    <div class="results-card">
      <div class="card-title">NIVEL DE PROTECCIÓN (NP)</div>
      <div class="stat-row"><span class="stat-label">R = 20m → NP I</span><span class="stat-val ok" id="np-I">●</span></div>
      <div class="stat-row"><span class="stat-label">R = 30m → NP II</span><span class="stat-val ok" id="np-II">●</span></div>
      <div class="stat-row"><span class="stat-label">R = 45m → NP III</span><span class="stat-val ok" id="np-III">●</span></div>
      <div class="stat-row"><span class="stat-label">R = 60m → NP IV</span><span class="stat-val ok" id="np-IV">●</span></div>
    </div>

    <div class="sep"></div>
    <div class="panel-title">🗺 PLANTA 2D</div>
    <div class="tab-bar">
      <div class="tab active" id="tab-planta">PLANTA</div>
      <div class="tab" id="tab-corte" onclick="toggleCorte()">CORTE</div>
    </div>
    <canvas id="canvas2D"></canvas>

    <div class="sep"></div>
    <div class="results-card" id="norma-info">
      <div class="card-title">NORMA APLICABLE</div>
      <div class="stat-row"><span class="stat-label">IEC 62305-3</span><span class="stat-val ok">✓</span></div>
      <div class="stat-row"><span class="stat-label">NFC 17-102</span><span class="stat-val ok">✓</span></div>
      <div class="stat-row"><span class="stat-label">IEEE Std 998</span><span class="stat-val ok">✓</span></div>
    </div>
  </div>

</div>

<!-- THREE.JS + ORBIT CONTROLS -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>
// ============================================================
// OrbitControls inline (r128 compatible)
// ============================================================
(function(){const e=THREE;class t extends e.EventDispatcher{constructor(t,i){super();this.object=t;this.domElement=i;this.enabled=true;this.target=new e.Vector3();this.minDistance=0;this.maxDistance=Infinity;this.minPolarAngle=0;this.maxPolarAngle=Math.PI;this.enableDamping=false;this.dampingFactor=0.05;this.enableZoom=true;this.zoomSpeed=1;this.enableRotate=true;this.rotateSpeed=1;this.enablePan=true;this.panSpeed=1;this.screenSpacePanning=true;const r=new e.Vector2(),s=new e.Vector2(),n=new e.Vector2();let o=0,a=0,l=1,c=new e.Vector3(),h=new e.Spherical(),d=new e.Spherical(),p=new e.Vector3(),f=new e.Vector2(),m=new e.Vector2();const v=new e.Vector3(),g=new e.Quaternion();const _=()=>{const e=new e_.Vector3().subVectors(this.object.position,this.target);return e.length()};class e_{constructor(){}}const y=()=>{d.setFromVector3(new e.Vector3().subVectors(this.object.position,this.target))};let x=null,b=null,w=null;const V=e=>{if(this.enabled===false)return;if(e.type==='wheel'){if(this.enableZoom===false)return;e.preventDefault();if(e.deltaY<0)l/=Math.pow(0.95,this.zoomSpeed);else if(e.deltaY>0)l*=Math.pow(0.95,this.zoomSpeed);}};const E=e=>{if(this.enabled===false)return;e.preventDefault();if(e.touches.length===1){s.set(e.touches[0].pageX,e.touches[0].pageY);n.subVectors(s,r);o-=(n.x/i.clientHeight)*Math.PI*this.rotateSpeed;a-=(n.y/i.clientHeight)*Math.PI*this.rotateSpeed;}r.copy(s);this.update();};const T=e=>{if(this.enabled===false)return;if(e.touches.length===1){r.set(e.touches[0].pageX,e.touches[0].pageY);s.copy(r);}};i.addEventListener('wheel',V,{passive:false});i.addEventListener('touchstart',T,{passive:false});i.addEventListener('touchmove',E,{passive:false});let A=false,L=false;const M=e=>{if(!this.enabled)return;if(e.button===0){A=true;r.set(e.clientX,e.clientY);}if(e.button===2){L=true;f.set(e.clientX,e.clientY);}};const S=e=>{if(!this.enabled)return;if(A){s.set(e.clientX,e.clientY);n.subVectors(s,r);o-=(n.x/i.clientHeight)*Math.PI*this.rotateSpeed;a-=(n.y/i.clientHeight)*Math.PI*this.rotateSpeed;r.copy(s);}if(L){m.set(e.clientX,e.clientY);const t=new e.Vector2().subVectors(m,f);if(this.screenSpacePanning){p.setFromMatrixColumn(this.object.matrix,0);p.multiplyScalar(-t.x*(new e.Vector3().subVectors(this.object.position,this.target).length()/i.clientHeight)*this.panSpeed);c.add(p);p.setFromMatrixColumn(this.object.matrix,1);p.multiplyScalar(t.y*(new e.Vector3().subVectors(this.object.position,this.target).length()/i.clientHeight)*this.panSpeed);c.add(p);}f.copy(m);}};const P=()=>{A=false;L=false;};i.addEventListener('mousedown',M);i.addEventListener('mousemove',S);i.addEventListener('mouseup',P);this.update=()=>{const r=new e.Spherical();r.setFromVector3(new e.Vector3().subVectors(this.object.position,this.target));if(this.enableDamping){r.theta+=o*this.dampingFactor;r.phi+=a*this.dampingFactor;o*=(1-this.dampingFactor);a*=(1-this.dampingFactor);}else{r.theta+=o;r.phi+=a;o=0;a=0;}r.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,r.phi));r.makeSafe();r.radius*=l;r.radius=Math.max(this.minDistance,Math.min(this.maxDistance,r.radius));l=1;this.target.add(c);c.set(0,0,0);const s=new e.Vector3().setFromSpherical(r).add(this.target);this.object.position.copy(s);this.object.lookAt(this.target);this.object.updateMatrixWorld();return false;};this.dispose=()=>{i.removeEventListener('wheel',V);i.removeEventListener('mousedown',M);i.removeEventListener('mousemove',S);i.removeEventListener('mouseup',P);i.removeEventListener('touchstart',T);i.removeEventListener('touchmove',E);};}}THREE.OrbitControls=t;})();
</script>

<script>
// ============================================================
// SPAT v5.0 — LÓGICA PRINCIPAL
// ============================================================
let scene, camera, renderer, controls;
let substationGrp, protectionGrp, groundGrp;
let currentMode = 'auto';
let renderTimer = null;
let initialized = false;

// ---- SYNC CONTROLES ----
function syncVal(fromId, toId, lblId) {
  const v = document.getElementById(fromId).value;
  document.getElementById(toId).value = v;
  document.getElementById(lblId).textContent = v;
}

function setMode(m) {
  currentMode = m;
  ['auto','perim','grid'].forEach(x => {
    document.getElementById('mode-'+x).classList.toggle('active', x===m);
  });
  autoRender();
}

function autoRender() {
  if (!initialized) return;
  clearTimeout(renderTimer);
  renderTimer = setTimeout(renderizar, 200);
}

// ---- INIT THREE.JS ----
function init3D() {
  const container = document.getElementById('container3D');
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050810);
  scene.fog = new THREE.FogExp2(0x050810, 0.008);

  camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 2000);
  camera.position.set(80, 70, 80);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 10;
  controls.maxDistance = 500;
  controls.target.set(0, 10, 0);

  // Doble clic para resetear
  renderer.domElement.addEventListener('dblclick', resetCamara);

  // Luces
  const ambient = new THREE.AmbientLight(0x223366, 0.8);
  scene.add(ambient);
  const sun = new THREE.DirectionalLight(0xffffff, 1.5);
  sun.position.set(60, 120, 40);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 0.1;
  sun.shadow.camera.far = 500;
  sun.shadow.camera.left = -120; sun.shadow.camera.right = 120;
  sun.shadow.camera.top = 120; sun.shadow.camera.bottom = -120;
  scene.add(sun);

  const fill = new THREE.DirectionalLight(0x4488ff, 0.3);
  fill.position.set(-60, 40, -60);
  scene.add(fill);

  // Grid
  const grid = new THREE.GridHelper(400, 40, 0x1e2d4a, 0x0f1a2e);
  scene.add(grid);

  // Plano de suelo
  const groundGeo = new THREE.PlaneGeometry(400, 400);
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x080d1a, roughness: 1 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Grupos
  substationGrp = new THREE.Group();
  protectionGrp = new THREE.Group();
  scene.add(substationGrp);
  scene.add(protectionGrp);

  // Animate
  (function loop() {
    requestAnimationFrame(loop);
    controls.update();
    renderer.render(scene, camera);
  })();

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  initialized = true;
}

function resetCamara() {
  camera.position.set(80, 70, 80);
  controls.target.set(0, 10, 0);
}

// ---- CALCULAR POSICIONES INTELIGENTES DE PUNTAS ----
function calcularPosicionesPuntas(L, A, H_punta, R_esfera, modo) {
  const puntas = [];
  // Radio eficaz de protección en el nivel del equipo crítico
  const H_equipo = parseFloat(document.getElementById('n-equipo').value) || 6;
  const H_col = 8; // Altura de columna fija
  // La punta captadora está en y = H_col + H_punta
  // El domo de la esfera cubre hasta radio r_h a una altura h desde la base del domo
  // r_h = sqrt(R^2 - (R - H_punta + delta_h)^2)
  // En el nivel del equipo (h = H_equipo desde el suelo, domo inicia en H_col):
  // delta_h = H_equipo - H_col (puede ser negativo = por debajo del arranque del domo)
  const delta_h = H_equipo - H_col;
  let r_equipo;
  if (delta_h >= 0 && delta_h <= H_punta) {
    r_equipo = Math.sqrt(Math.pow(R_esfera, 2) - Math.pow(R_esfera - H_punta + delta_h, 2));
  } else if (delta_h < 0) {
    // La esfera cae desde R al suelo, radio en H_equipo < H_col
    r_equipo = Math.sqrt(Math.pow(R_esfera, 2) - Math.pow(R_esfera - H_equipo, 2));
  } else {
    r_equipo = 0; // No protege
  }

  // Radio eficaz en SUELO
  const r_suelo = Math.sqrt(Math.pow(R_esfera, 2) - Math.pow(R_esfera - H_punta - H_col, 2));

  if (modo === 'auto' || modo === 'perim') {
    // Calcular cuántas puntas se necesitan para cubrir el perímetro
    // Las puntas se colocan en esquinas + puntos intermedios del perímetro
    const margen = 0; // Puntas exactamente en el borde

    // Esquinas
    puntas.push({ x: -L/2, z: -A/2 });
    puntas.push({ x:  L/2, z: -A/2 });
    puntas.push({ x: -L/2, z:  A/2 });
    puntas.push({ x:  L/2, z:  A/2 });

    if (modo === 'auto') {
      // Distancia máxima entre puntas para cobertura continua
      // Dos domos adyacentes se solapan cuando d < 2 * r_suelo
      const distMax = 2 * r_suelo * 0.85; // 15% de solapamiento mínimo

      // Borde superior e inferior (a lo largo de L)
      const nL = Math.ceil(L / distMax) - 1;
      for (let i = 1; i < nL; i++) {
        const t = (i / nL);
        puntas.push({ x: -L/2 + t * L, z: -A/2 });
        puntas.push({ x: -L/2 + t * L, z:  A/2 });
      }

      // Bordes laterales (a lo largo de A)
      const nA = Math.ceil(A / distMax) - 1;
      for (let i = 1; i < nA; i++) {
        const t = (i / nA);
        puntas.push({ x: -L/2, z: -A/2 + t * A });
        puntas.push({ x:  L/2, z: -A/2 + t * A });
      }

      // ¿Necesitamos puntas interiores? Verificar cobertura del centro
      const distCentro = Math.sqrt(Math.pow(L/2, 2) + Math.pow(A/2, 2));
      const necesitaInterior = distCentro > r_suelo * 1.1;

      if (necesitaInterior) {
        // Agregar puntas en el interior en grilla simplificada
        const paso = distMax * 0.9;
        const colsX = Math.ceil(L / paso);
        const colsZ = Math.ceil(A / paso);
        for (let ci = 1; ci < colsX; ci++) {
          for (let cj = 1; cj < colsZ; cj++) {
            const ix = -L/2 + (ci/colsX)*L;
            const iz = -A/2 + (cj/colsZ)*A;
            // Solo si está lejos de puntas existentes
            let lejos = puntas.every(p => Math.hypot(p.x - ix, p.z - iz) > r_suelo * 0.9);
            if (lejos) puntas.push({ x: ix, z: iz });
          }
        }
      }
    }
  } else if (modo === 'grid') {
    // Grilla uniforme calculada para cobertura total
    const paso = r_suelo * 1.5;
    const nX = Math.max(2, Math.ceil(L / paso) + 1);
    const nZ = Math.max(2, Math.ceil(A / paso) + 1);
    for (let i = 0; i < nX; i++) {
      for (let j = 0; j < nZ; j++) {
        const px = -L/2 + (i/(nX-1))*L;
        const pz = -A/2 + (j/(nZ-1))*A;
        puntas.push({ x: px, z: pz });
      }
    }
  }

  return { puntas, r_suelo, r_equipo };
}

// ---- RENDERIZAR ESCENA PRINCIPAL ----
function renderizar() {
  const L = parseFloat(document.getElementById('n-largo').value) || 50;
  const A = parseFloat(document.getElementById('n-ancho').value) || 30;
  const H_punta = parseFloat(document.getElementById('n-punta').value) || 8;
  const H_col = 8;
  const R = parseFloat(document.getElementById('n-radio').value) || 30;
  const H_equipo = parseFloat(document.getElementById('n-equipo').value) || 6;

  // Validación
  const alertBox = document.getElementById('alert-box');
  if (H_punta + H_col >= R * 1.8) {
    alertBox.classList.add('show');
  } else {
    alertBox.classList.remove('show');
  }

  // Limpiar
  while(substationGrp.children.length) substationGrp.remove(substationGrp.children[0]);
  while(protectionGrp.children.length) protectionGrp.remove(protectionGrp.children[0]);

  // Calcular posiciones
  const { puntas, r_suelo, r_equipo } = calcularPosicionesPuntas(L, A, H_punta, R, currentMode);

  // ===== SUBESTACIÓN =====
  construirSubestacion(L, A, H_col, H_equipo);

  // ===== SISTEMAS DE PROTECCIÓN =====
  puntas.forEach(p => construirModuloProteccion(p.x, p.z, H_col, H_punta, R));

  // ===== CONECTORES (CABLE DE BAJADA — visual) =====
  puntas.forEach(p => {
    const mat = new THREE.LineBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.4 });
    const pts = [new THREE.Vector3(p.x, 0, p.z), new THREE.Vector3(p.x, H_col + H_punta, p.z)];
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    protectionGrp.add(new THREE.Line(geo, mat));
  });

  // ===== ACTUALIZAR UI =====
  const cobertura = estimarCobertura(L, A, puntas, r_suelo);
  actualizarResultados(R, r_suelo, r_equipo, puntas.length, H_col + H_punta, cobertura);
  actualizarVista2D(L, A, r_suelo, puntas);
  actualizarNiveles(R);

  document.getElementById('vp-info').innerHTML =
    `MODO: ${currentMode.toUpperCase()}<br>PUNTAS: ${puntas.length}<br>COB: ${cobertura}%`;
}

// ---- CONSTRUIR SUBESTACIÓN ----
function construirSubestacion(L, A, H_col, H_equipo) {
  const matAcero = new THREE.MeshStandardMaterial({ color: 0x4a90d9, roughness: 0.4, metalness: 0.6 });
  const matConcreto = new THREE.MeshStandardMaterial({ color: 0x1a2a4a, roughness: 0.9 });
  const matTrafo = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.3, metalness: 0.5 });

  // Piso de la subestación
  const pisoGeo = new THREE.BoxGeometry(L, 0.2, A);
  const piso = new THREE.Mesh(pisoGeo, matConcreto);
  piso.position.set(0, 0.1, 0);
  piso.receiveShadow = true;
  substationGrp.add(piso);

  // Muro perimetral
  [[L, 0.6, 0.3, 0, 0.3, -A/2], [L, 0.6, 0.3, 0, 0.3, A/2],
   [0.3, 0.6, A, -L/2, 0.3, 0], [0.3, 0.6, A, L/2, 0.3, 0]
  ].forEach(([w,h,d,x,y,z]) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), matConcreto);
    m.position.set(x,y,z);
    substationGrp.add(m);
  });

  // Columnas del pórtico (en las 4 esquinas + intermedias)
  const posCol = [];
  for (let ix of [-L/2, L/2]) {
    for (let iz = -A/2; iz <= A/2; iz += Math.min(A, 15)) {
      posCol.push({x: ix, z: iz});
    }
  }
  for (let iz of [-A/2, A/2]) {
    for (let ix = -L/2 + 15; ix < L/2; ix += Math.min(L, 15)) {
      posCol.push({x: ix, z: iz});
    }
  }

  posCol.forEach(p => {
    const col = new THREE.Mesh(new THREE.BoxGeometry(0.5, H_col, 0.5), matAcero);
    col.position.set(p.x, H_col/2, p.z);
    col.castShadow = true;
    substationGrp.add(col);
  });

  // Vigas superiores
  const vigaMat = new THREE.MeshStandardMaterial({ color: 0x5aa0e8, metalness: 0.7, roughness: 0.3 });
  const v1 = new THREE.Mesh(new THREE.BoxGeometry(L, 0.3, 0.3), vigaMat);
  v1.position.set(0, H_col, -A/2); substationGrp.add(v1);
  const v2 = new THREE.Mesh(new THREE.BoxGeometry(L, 0.3, 0.3), vigaMat);
  v2.position.set(0, H_col, A/2); substationGrp.add(v2);
  const v3 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, A), vigaMat);
  v3.position.set(-L/2, H_col, 0); substationGrp.add(v3);
  const v4 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, A), vigaMat);
  v4.position.set(L/2, H_col, 0); substationGrp.add(v4);

  // Transformador principal
  const trafoGeo = new THREE.BoxGeometry(L*0.25, H_equipo, A*0.35);
  const trafo = new THREE.Mesh(trafoGeo, matTrafo);
  trafo.position.set(0, H_equipo/2, 0);
  trafo.castShadow = true;
  substationGrp.add(trafo);

  // Radiadores del trafo (detalles)
  for (let i=-3; i<=3; i++) {
    const rad = new THREE.Mesh(new THREE.BoxGeometry(0.15, H_equipo*0.8, A*0.32), 
      new THREE.MeshStandardMaterial({color:0xccaa00, metalness:0.6, roughness:0.4}));
    rad.position.set(i*0.6 - L*0.12, H_equipo/2, 0);
    substationGrp.add(rad);
  }

  // Aisladores (barras verticales)
  const aisladoresPos = [
    {x:-L*0.3, z:-A*0.15}, {x:-L*0.1, z:-A*0.15}, {x:L*0.1, z:-A*0.15},
    {x:-L*0.3, z: A*0.15}, {x:-L*0.1, z: A*0.15}, {x:L*0.1, z: A*0.15},
  ];
  const aisladoresMatBlanco = new THREE.MeshStandardMaterial({color:0xddddff, roughness:0.6});
  aisladoresPos.forEach(p => {
    for (let seg=0; seg<4; seg++) {
      const segGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.4, 8);
      const segM = new THREE.Mesh(segGeo, aisladoresMatBlanco);
      segM.position.set(p.x, 1 + seg*0.6, p.z);
      substationGrp.add(segM);
      // Disco
      const dGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.08, 12);
      const dM = new THREE.Mesh(dGeo, aisladoresMatBlanco);
      dM.position.set(p.x, 1 + seg*0.6 + 0.24, p.z);
      substationGrp.add(dM);
    }
    // Barra conductora
    const barraGeo = new THREE.CylinderGeometry(0.04, 0.04, 2, 6);
    const barraM = new THREE.Mesh(barraGeo, new THREE.MeshStandardMaterial({color:0xffa500, metalness:0.9}));
    barraM.position.set(p.x, 4, p.z);
    substationGrp.add(barraM);
  });

  // Conductor de bajada (línea roja en perimetro)
  const ptsPerim = [];
  [[-L/2,-A/2],[L/2,-A/2],[L/2,A/2],[-L/2,A/2],[-L/2,-A/2]].forEach(([x,z])=>{
    ptsPerim.push(new THREE.Vector3(x, 0.3, z));
  });
  const perimMat = new THREE.LineBasicMaterial({color:0xff4444, transparent:true, opacity:0.6});
  substationGrp.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(ptsPerim), perimMat));
}

// ---- MÓDULO DE PROTECCIÓN (1 punta + domo esfera rodante) ----
function construirModuloProteccion(x, z, H_col, H_punta, R) {
  const yBase = H_col;
  const totalH = H_punta;

  // Mástil
  const mastGeo = new THREE.CylinderGeometry(0.04, 0.08, totalH + 0.5, 8);
  const mastMat = new THREE.MeshStandardMaterial({ color: 0x00ff88, metalness: 0.9, roughness: 0.1 });
  const mast = new THREE.Mesh(mastGeo, mastMat);
  mast.position.set(x, yBase + totalH/2 + 0.25, z);
  mast.castShadow = true;
  protectionGrp.add(mast);

  // Punta (esfera en la cima)
  const puntaGeo = new THREE.SphereGeometry(0.18, 12, 12);
  const punta = new THREE.Mesh(puntaGeo, mastMat);
  punta.position.set(x, yBase + totalH + 0.5, z);
  protectionGrp.add(punta);

  // Aura de la punta
  const auraGeo = new THREE.SphereGeometry(0.5, 12, 12);
  const auraMat = new THREE.MeshBasicMaterial({color:0x00ff88, transparent:true, opacity:0.15, side:THREE.DoubleSide});
  const aura = new THREE.Mesh(auraGeo, auraMat);
  aura.position.set(x, yBase + totalH + 0.5, z);
  protectionGrp.add(aura);

  // DOMO DE PROTECCIÓN — generado con LatheGeometry siguiendo la geometría de la esfera
  // La esfera de radio R rodando desde la punta: el domo es la trayectoria del centro de la esfera
  // El radio horizontal en cada altura h desde la cima de la punta:
  //   r(h) = sqrt(R^2 - (R - h)^2) para h = 0..H_punta
  // En coordenadas locales desde yBase (base del mástil):
  const puntosDomo = [];
  const res = 32;
  for (let i = 0; i <= res; i++) {
    const h = (i / res) * totalH; // 0 = base del mástil, totalH = punta
    const yLocal = h;
    // Distancia desde la punta: totalH - h
    const dist_punta = totalH - h;
    // Radio horizontal del domo
    const r_h = Math.sqrt(Math.pow(R, 2) - Math.pow(R - dist_punta, 2));
    puntosDomo.push(new THREE.Vector2(r_h, yLocal));
  }

  const domoGeo = new THREE.LatheGeometry(puntosDomo, 48);
  const domoMat = new THREE.MeshPhongMaterial({
    color: 0x00d4ff,
    transparent: true,
    opacity: 0.08,
    side: THREE.DoubleSide,
    shininess: 80,
    specular: 0x88eeff
  });
  const domo = new THREE.Mesh(domoGeo, domoMat);
  domo.position.set(x, yBase, z);
  protectionGrp.add(domo);

  // Wireframe del domo
  const domoWF = new THREE.Mesh(domoGeo, new THREE.MeshBasicMaterial({
    color: 0x00d4ff, wireframe: true, transparent: true, opacity: 0.06
  }));
  domoWF.position.set(x, yBase, z);
  protectionGrp.add(domoWF);

  // Círculo en la base del domo (proyección en suelo)
  const r_suelo_local = puntosDomo[0].x;
  const circGeo = new THREE.RingGeometry(r_suelo_local - 0.1, r_suelo_local + 0.1, 64);
  const circMat = new THREE.MeshBasicMaterial({color:0x00d4ff, transparent:true, opacity:0.3, side:THREE.DoubleSide});
  const circ = new THREE.Mesh(circGeo, circMat);
  circ.rotation.x = -Math.PI/2;
  circ.position.set(x, 0.05, z);
  protectionGrp.add(circ);
}

// ---- ESTIMAR COBERTURA ----
function estimarCobertura(L, A, puntas, r_suelo) {
  const muestraX = 20, muestraZ = 20;
  let cubiertos = 0, total = 0;
  for (let i = 0; i <= muestraX; i++) {
    for (let j = 0; j <= muestraZ; j++) {
      const px = -L/2 + (i/muestraX)*L;
      const pz = -A/2 + (j/muestraZ)*A;
      total++;
      const cubierto = puntas.some(p => Math.hypot(p.x - px, p.z - pz) <= r_suelo);
      if (cubierto) cubiertos++;
    }
  }
  return Math.round((cubiertos/total)*100);
}

// ---- UI RESULTADOS ----
function actualizarResultados(R, r_suelo, r_equipo, nPuntas, hTotal, cobertura) {
  document.getElementById('r-r_suelo').textContent = r_suelo.toFixed(2) + ' m';
  document.getElementById('r-npuntas').textContent = nPuntas;
  document.getElementById('r-htotal').textContent = hTotal.toFixed(1) + ' m';
  const c = document.getElementById('r-cobertura');
  c.textContent = cobertura + '%';
  c.className = 'stat-val ' + (cobertura >= 95 ? 'ok' : cobertura >= 70 ? '' : 'warn');
}

function actualizarNiveles(R) {
  const niveles = [
    {id:'np-I', R_ref:20}, {id:'np-II', R_ref:30},
    {id:'np-III', R_ref:45}, {id:'np-IV', R_ref:60}
  ];
  niveles.forEach(n => {
    const el = document.getElementById(n.id);
    if (R <= n.R_ref) {
      el.textContent = '● ACTIVO';
      el.className = 'stat-val ok';
    } else {
      el.textContent = '○ —';
      el.className = 'stat-val';
      el.style.color = '#5a7a9a';
    }
  });
}

// ---- PLANTA 2D ----
function actualizarVista2D(L, A, r_suelo, puntas) {
  const canvas = document.getElementById('canvas2D');
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth, H_c = canvas.offsetHeight || W;
  canvas.width = W; canvas.height = H_c;

  const scaleX = (W * 0.7) / L;
  const scaleZ = (H_c * 0.7) / A;
  const scale = Math.min(scaleX, scaleZ);
  const cx = W/2, cy = H_c/2;

  ctx.clearRect(0,0,W,H_c);
  ctx.fillStyle = '#050810';
  ctx.fillRect(0,0,W,H_c);

  // Grid fino
  ctx.strokeStyle = '#0f1a2e';
  ctx.lineWidth = 0.5;
  for(let i=0;i<W;i+=20){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,H_c);ctx.stroke();}
  for(let j=0;j<H_c;j+=20){ctx.beginPath();ctx.moveTo(0,j);ctx.lineTo(W,j);ctx.stroke();}

  // Domos de protección
  puntas.forEach(p => {
    const px = cx + p.x * scale;
    const pz = cy + p.z * scale;
    const r = r_suelo * scale;
    const grad = ctx.createRadialGradient(px, pz, 0, px, pz, r);
    grad.addColorStop(0, 'rgba(0,212,255,0.2)');
    grad.addColorStop(1, 'rgba(0,212,255,0)');
    ctx.beginPath();
    ctx.arc(px, pz, r, 0, Math.PI*2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,212,255,0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // Perímetro subestación
  ctx.strokeStyle = '#4a90d9';
  ctx.lineWidth = 2;
  ctx.strokeRect(cx - L*scale/2, cy - A*scale/2, L*scale, A*scale);
  ctx.fillStyle = 'rgba(74,144,217,0.05)';
  ctx.fillRect(cx - L*scale/2, cy - A*scale/2, L*scale, A*scale);

  // Transformador
  const tW = L*0.25*scale, tH = A*0.35*scale;
  ctx.fillStyle = 'rgba(255,215,0,0.3)';
  ctx.fillRect(cx - tW/2, cy - tH/2, tW, tH);
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 1;
  ctx.strokeRect(cx - tW/2, cy - tH/2, tW, tH);

  // Puntas captadoras
  puntas.forEach(p => {
    const px = cx + p.x * scale;
    const pz = cy + p.z * scale;
    ctx.beginPath();
    ctx.arc(px, pz, 3, 0, Math.PI*2);
    ctx.fillStyle = '#00ff88';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(px, pz, 5, 0, Math.PI*2);
    ctx.strokeStyle = 'rgba(0,255,136,0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // Escala
  const escala_m = 10;
  const escala_px = escala_m * scale;
  const ex = W - 20, ey = H_c - 16;
  ctx.strokeStyle = '#5a7a9a';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(ex - escala_px, ey); ctx.lineTo(ex, ey); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(ex - escala_px, ey-4); ctx.lineTo(ex - escala_px, ey+4); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(ex, ey-4); ctx.lineTo(ex, ey+4); ctx.stroke();
  ctx.fillStyle = '#5a7a9a';
  ctx.font = '9px Share Tech Mono';
  ctx.textAlign = 'center';
  ctx.fillText(escala_m+'m', ex - escala_px/2, ey - 6);
}

let modoCorte = false;
function toggleCorte() {
  modoCorte = !modoCorte;
  document.getElementById('tab-planta').classList.toggle('active', !modoCorte);
  document.getElementById('tab-corte').classList.toggle('active', modoCorte);
  // TODO: dibujar corte transversal
}

// ---- INIT ----
window.addEventListener('load', () => {
  init3D();
  renderizar();
});
</script>
</body>
</html>
