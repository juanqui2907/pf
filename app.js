/* ═══════════════════════════════════════════════════════
   SPAT v5.0 — app.js
   Responsabilidades:
     · Inicializar escena Three.js
     · Calcular posiciones de puntas captadoras (3 modos)
     · Construir subestación 3D
     · Construir domos de protección (esfera rodante)
     · Estimar cobertura
     · Orquestar la llamada a funciones de ui.js
═══════════════════════════════════════════════════════ */

/* Namespace global para que ui.js pueda llamar a SPAT.renderizar() */
const SPAT = {
  initialized: false,

  /* Objetos Three.js */
  scene:    null,
  camera:   null,
  renderer: null,
  controls: null,

  /* Grupos de objetos */
  substationGrp: null,
  protectionGrp: null,

  /* Constante: altura del pórtico (fija en diseño) */
  H_COL: 8,

  /* ══════════════════════════════════════════════════
     INICIALIZAR THREE.JS
  ══════════════════════════════════════════════════ */
  init() {
    const container = document.getElementById('container3D');

    /* Escena */
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x050810);
    this.scene.fog = new THREE.FogExp2(0x050810, 0.008);

    /* Cámara */
    this.camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      2000
    );
    this.camera.position.set(80, 70, 80);

    /* Renderer */
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    /* Controles de órbita */
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.minDistance   = 10;
    this.controls.maxDistance   = 500;
    this.controls.target.set(0, 10, 0);

    /* Doble clic → resetear cámara */
    this.renderer.domElement.addEventListener('dblclick', () => this.resetCamera());

    /* Iluminación */
    this.scene.add(new THREE.AmbientLight(0x223366, 0.8));

    const sun = new THREE.DirectionalLight(0xffffff, 1.5);
    sun.position.set(60, 120, 40);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { near: 0.1, far: 500, left: -120, right: 120, top: 120, bottom: -120 });
    this.scene.add(sun);

    const fill = new THREE.DirectionalLight(0x4488ff, 0.3);
    fill.position.set(-60, 40, -60);
    this.scene.add(fill);

    /* Helpers */
    this.scene.add(new THREE.GridHelper(400, 40, 0x1e2d4a, 0x0f1a2e));

    /* Suelo */
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(400, 400),
      new THREE.MeshStandardMaterial({ color: 0x080d1a, roughness: 1 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    /* Grupos */
    this.substationGrp = new THREE.Group();
    this.protectionGrp = new THREE.Group();
    this.scene.add(this.substationGrp);
    this.scene.add(this.protectionGrp);

    /* Loop de animación */
    const loop = () => {
      requestAnimationFrame(loop);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };
    loop();

    /* Responsive */
    window.addEventListener('resize', () => {
      this.camera.aspect = container.clientWidth / container.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(container.clientWidth, container.clientHeight);
    });

    this.initialized = true;
  },

  /* ══════════════════════════════════════════════════
     RESETEAR CÁMARA
  ══════════════════════════════════════════════════ */
  resetCamera() {
    this.camera.position.set(80, 70, 80);
    this.controls.target.set(0, 10, 0);
  },

  /* ══════════════════════════════════════════════════
     LIMPIAR GRUPOS
  ══════════════════════════════════════════════════ */
  clearGroup(grp) {
    while (grp.children.length) grp.remove(grp.children[0]);
  },

  /* ══════════════════════════════════════════════════
     CALCULAR POSICIONES DE PUNTAS (3 MODOS)
  ══════════════════════════════════════════════════ */
  calcularPuntas(L, A, H_punta, R, modo) {
    const H_col    = this.H_COL;
    const H_equipo = getVal('n-equipo');

    /* ── Radio eficaz en el nivel del equipo crítico ── */
    const delta = H_equipo - H_col;
    let r_equipo;
    if (delta >= 0 && delta <= H_punta) {
      r_equipo = Math.sqrt(R ** 2 - (R - H_punta + delta) ** 2);
    } else if (delta < 0) {
      r_equipo = Math.sqrt(R ** 2 - (R - H_equipo) ** 2);
    } else {
      r_equipo = 0;
    }

    /* ── Radio eficaz en suelo ── */
    // La punta está a H_col + H_punta del suelo.
    // La esfera roda tangente a la punta: cuando la esfera toca el suelo
    // su centro está en y = R, y el radio horizontal es:
    //   r_suelo = sqrt(R² - (R - (H_col + H_punta))²)
    const H_total = H_col + H_punta;
    const r_suelo = H_total < R
      ? Math.sqrt(R ** 2 - (R - H_total) ** 2)
      : R; // si la punta supera el radio, cobertura máxima

    const puntas = [];

    if (modo === 'grid') {
      /* ── MODO GRILLA ── */
      const paso = r_suelo * 1.5;
      const nX   = Math.max(2, Math.ceil(L / paso) + 1);
      const nZ   = Math.max(2, Math.ceil(A / paso) + 1);
      for (let i = 0; i < nX; i++) {
        for (let j = 0; j < nZ; j++) {
          puntas.push({
            x: -L / 2 + (i / (nX - 1)) * L,
            z: -A / 2 + (j / (nZ - 1)) * A,
          });
        }
      }

    } else {
      /* ── MODO AUTO o PERÍMETRO: primero las 4 esquinas ── */
      puntas.push({ x: -L / 2, z: -A / 2 });
      puntas.push({ x:  L / 2, z: -A / 2 });
      puntas.push({ x: -L / 2, z:  A / 2 });
      puntas.push({ x:  L / 2, z:  A / 2 });

      if (modo === 'auto') {
        /* ── Separación máxima con 15 % de solapamiento ── */
        const dMax = r_suelo * 2 * 0.85;

        /* Puntas intermedias en borde superior e inferior */
        const nL = Math.ceil(L / dMax) - 1;
        for (let i = 1; i < nL; i++) {
          const t = i / nL;
          puntas.push({ x: -L / 2 + t * L, z: -A / 2 });
          puntas.push({ x: -L / 2 + t * L, z:  A / 2 });
        }

        /* Puntas intermedias en bordes laterales */
        const nA = Math.ceil(A / dMax) - 1;
        for (let i = 1; i < nA; i++) {
          const t = i / nA;
          puntas.push({ x: -L / 2, z: -A / 2 + t * A });
          puntas.push({ x:  L / 2, z: -A / 2 + t * A });
        }

        /* ¿El centro queda descubierto? Si la diagonal supera r_suelo, agregar interiores */
        const diagCentro = Math.hypot(L / 2, A / 2);
        if (diagCentro > r_suelo) {
          const paso  = dMax * 0.88;
          const colsX = Math.ceil(L / paso);
          const colsZ = Math.ceil(A / paso);
          for (let ci = 1; ci < colsX; ci++) {
            for (let cj = 1; cj < colsZ; cj++) {
              const ix = -L / 2 + (ci / colsX) * L;
              const iz = -A / 2 + (cj / colsZ) * A;
              /* Solo si está lejos de todas las puntas existentes */
              const lejos = puntas.every(p => Math.hypot(p.x - ix, p.z - iz) > r_suelo * 0.9);
              if (lejos) puntas.push({ x: ix, z: iz });
            }
          }
        }
      }
    }

    return { puntas, r_suelo, r_equipo };
  },

  /* ══════════════════════════════════════════════════
     ESTIMAR COBERTURA (muestra 20×20)
  ══════════════════════════════════════════════════ */
  estimarCobertura(L, A, puntas, r_suelo) {
    const N = 20;
    let cubiertos = 0;
    const total = (N + 1) ** 2;
    for (let i = 0; i <= N; i++) {
      for (let j = 0; j <= N; j++) {
        const px = -L / 2 + (i / N) * L;
        const pz = -A / 2 + (j / N) * A;
        if (puntas.some(p => Math.hypot(p.x - px, p.z - pz) <= r_suelo)) cubiertos++;
      }
    }
    return Math.round((cubiertos / total) * 100);
  },

  /* ══════════════════════════════════════════════════
     CONSTRUIR SUBESTACIÓN 3D
  ══════════════════════════════════════════════════ */
  construirSubestacion(L, A, H_equipo) {
    const H_col = this.H_COL;
    const grp   = this.substationGrp;

    const matAcero    = new THREE.MeshStandardMaterial({ color: 0x4a90d9, roughness: 0.4, metalness: 0.6 });
    const matConcreto = new THREE.MeshStandardMaterial({ color: 0x1a2a4a, roughness: 0.9 });
    const matTrafo    = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.3, metalness: 0.5 });
    const matViga     = new THREE.MeshStandardMaterial({ color: 0x5aa0e8, metalness: 0.7, roughness: 0.3 });
    const matAislador = new THREE.MeshStandardMaterial({ color: 0xddddff, roughness: 0.6 });
    const matCobre    = new THREE.MeshStandardMaterial({ color: 0xffa500, metalness: 0.9 });

    const mesh = (geo, mat, x, y, z) => {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, y, z);
      m.castShadow    = true;
      m.receiveShadow = true;
      grp.add(m);
      return m;
    };

    /* Piso */
    mesh(new THREE.BoxGeometry(L, 0.2, A), matConcreto, 0, 0.1, 0);

    /* Muros perimetrales */
    mesh(new THREE.BoxGeometry(L,   0.6, 0.3), matConcreto, 0,     0.3, -A / 2);
    mesh(new THREE.BoxGeometry(L,   0.6, 0.3), matConcreto, 0,     0.3,  A / 2);
    mesh(new THREE.BoxGeometry(0.3, 0.6, A),   matConcreto, -L / 2, 0.3, 0);
    mesh(new THREE.BoxGeometry(0.3, 0.6, A),   matConcreto,  L / 2, 0.3, 0);

    /* Columnas del pórtico */
    const colGeo = new THREE.BoxGeometry(0.5, H_col, 0.5);
    const posCol = [];
    for (const ix of [-L / 2, L / 2]) {
      for (let iz = -A / 2; iz <= A / 2 + 0.01; iz += Math.min(A, 15)) {
        posCol.push({ x: ix, z: iz });
      }
    }
    for (const iz of [-A / 2, A / 2]) {
      for (let ix = -L / 2 + 15; ix < L / 2; ix += Math.min(L, 15)) {
        posCol.push({ x: ix, z: iz });
      }
    }
    posCol.forEach(p => mesh(colGeo, matAcero, p.x, H_col / 2, p.z));

    /* Vigas superiores */
    mesh(new THREE.BoxGeometry(L,   0.3, 0.3), matViga, 0,      H_col, -A / 2);
    mesh(new THREE.BoxGeometry(L,   0.3, 0.3), matViga, 0,      H_col,  A / 2);
    mesh(new THREE.BoxGeometry(0.3, 0.3, A),   matViga, -L / 2, H_col, 0);
    mesh(new THREE.BoxGeometry(0.3, 0.3, A),   matViga,  L / 2, H_col, 0);

    /* Transformador */
    mesh(new THREE.BoxGeometry(L * 0.25, H_equipo, A * 0.35), matTrafo, 0, H_equipo / 2, 0);

    /* Radiadores del transformador */
    for (let i = -3; i <= 3; i++) {
      mesh(
        new THREE.BoxGeometry(0.15, H_equipo * 0.8, A * 0.32),
        new THREE.MeshStandardMaterial({ color: 0xccaa00, metalness: 0.6, roughness: 0.4 }),
        i * 0.6 - L * 0.12, H_equipo / 2, 0
      );
    }

    /* Aisladores */
    const aisPos = [
      { x: -L * 0.3, z: -A * 0.15 }, { x: -L * 0.1, z: -A * 0.15 }, { x: L * 0.1, z: -A * 0.15 },
      { x: -L * 0.3, z:  A * 0.15 }, { x: -L * 0.1, z:  A * 0.15 }, { x: L * 0.1, z:  A * 0.15 },
    ];
    aisPos.forEach(p => {
      for (let seg = 0; seg < 4; seg++) {
        mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.4, 8), matAislador, p.x, 1 + seg * 0.6, p.z);
        mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.08, 12), matAislador, p.x, 1 + seg * 0.6 + 0.24, p.z);
      }
      mesh(new THREE.CylinderGeometry(0.04, 0.04, 2, 6), matCobre, p.x, 4, p.z);
    });

    /* Cable de tierra perimetral */
    const pts = [
      [-L / 2, -A / 2], [L / 2, -A / 2], [L / 2, A / 2], [-L / 2, A / 2], [-L / 2, -A / 2]
    ].map(([x, z]) => new THREE.Vector3(x, 0.3, z));
    const perimLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({ color: 0xff4444, transparent: true, opacity: 0.6 })
    );
    grp.add(perimLine);
  },

  /* ══════════════════════════════════════════════════
     CONSTRUIR UN MÓDULO DE PROTECCIÓN
     (1 punta captadora + domo de esfera rodante)
  ══════════════════════════════════════════════════ */
  construirModulo(x, z, H_punta, R) {
    const H_col = this.H_COL;
    const yBase = H_col;
    const grp   = this.protectionGrp;

    const matMast  = new THREE.MeshStandardMaterial({ color: 0x00ff88, metalness: 0.9, roughness: 0.1 });
    const matAura  = new THREE.MeshBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.15, side: THREE.DoubleSide });
    const matDomo  = new THREE.MeshPhongMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.08, side: THREE.DoubleSide, shininess: 80, specular: 0x88eeff });
    const matWF    = new THREE.MeshBasicMaterial({ color: 0x00d4ff, wireframe: true, transparent: true, opacity: 0.06 });
    const matCirc  = new THREE.MeshBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.3, side: THREE.DoubleSide });
    const matLine  = new THREE.LineBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.4 });

    /* Mástil */
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.08, H_punta + 0.5, 8), matMast);
    mast.position.set(x, yBase + H_punta / 2 + 0.25, z);
    mast.castShadow = true;
    grp.add(mast);

    /* Esfera en la punta */
    const punta = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), matMast);
    punta.position.set(x, yBase + H_punta + 0.5, z);
    grp.add(punta);

    /* Aura de la punta */
    const aura = new THREE.Mesh(new THREE.SphereGeometry(0.5, 12, 12), matAura);
    aura.position.set(x, yBase + H_punta + 0.5, z);
    grp.add(aura);

    /* ── DOMO DE ESFERA RODANTE ──
       La esfera de radio R rueda desde la punta hacia afuera.
       Radio horizontal en cada punto h (desde la base del mástil) :
         dist_a_punta = H_punta - h
         r(h) = sqrt( R² - (R - dist_a_punta)² )
    */
    const puntosDomo = [];
    const RES = 32;
    for (let i = 0; i <= RES; i++) {
      const h           = (i / RES) * H_punta;
      const dist_punta  = H_punta - h;
      const r_h         = Math.sqrt(Math.max(0, R ** 2 - (R - dist_punta) ** 2));
      puntosDomo.push(new THREE.Vector2(r_h, h));
    }

    const domoGeo = new THREE.LatheGeometry(puntosDomo, 48);

    const domo = new THREE.Mesh(domoGeo, matDomo);
    domo.position.set(x, yBase, z);
    grp.add(domo);

    const domoWF = new THREE.Mesh(domoGeo, matWF);
    domoWF.position.set(x, yBase, z);
    grp.add(domoWF);

    /* Círculo en suelo (proyección del domo) */
    const r_suelo_local = puntosDomo[0].x;
    const circ = new THREE.Mesh(new THREE.RingGeometry(r_suelo_local - 0.1, r_suelo_local + 0.1, 64), matCirc);
    circ.rotation.x = -Math.PI / 2;
    circ.position.set(x, 0.05, z);
    grp.add(circ);

    /* Cable de bajada (visual) */
    const bajada = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x, 0, z),
        new THREE.Vector3(x, yBase + H_punta, z),
      ]),
      matLine
    );
    grp.add(bajada);
  },

  /* ══════════════════════════════════════════════════
     RENDERIZAR — punto de entrada principal
  ══════════════════════════════════════════════════ */
  renderizar() {
    const L        = getVal('n-largo');
    const A        = getVal('n-ancho');
    const H_punta  = getVal('n-punta');
    const R        = getVal('n-radio');
    const H_equipo = getVal('n-equipo');
    const H_total  = this.H_COL + H_punta;
    const modo     = UI.mode;

    /* Alerta si la altura total supera el radio */
    mostrarAlerta(H_total >= R * 1.8);

    /* Limpiar escena */
    this.clearGroup(this.substationGrp);
    this.clearGroup(this.protectionGrp);

    /* Calcular posiciones */
    const { puntas, r_suelo } = this.calcularPuntas(L, A, H_punta, R, modo);

    /* Construir geometría */
    this.construirSubestacion(L, A, H_equipo);
    puntas.forEach(p => this.construirModulo(p.x, p.z, H_punta, R));

    /* Cobertura */
    const cobertura = this.estimarCobertura(L, A, puntas, r_suelo);

    /* Actualizar UI */
    actualizarResultados(r_suelo, puntas.length, H_total, cobertura);
    actualizarNiveles(R);
    actualizarOverlay(modo, puntas.length, cobertura);
    dibujarPlanta(L, A, r_suelo, puntas);
  },
};

/* ════════════════════════════════════════════════════════
   ARRANQUE
════════════════════════════════════════════════════════ */
window.addEventListener('load', () => {
  initUI();       // ui.js: eventos de controles
  SPAT.init();    // app.js: motor Three.js
  SPAT.renderizar();
});
