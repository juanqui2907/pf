/**
 * SPAT v4.0 - SISTEMA DE PROTECCIÓN ATMOSFÉRICA PROFESIONAL
 * Renderizado de Subestación de Potencia y Método de Esfera Rodante
 */

// --- Variables de Estado Global ---
let scene, camera, renderer, controls;
let powerSubstationGroup = new THREE.Group(); 
let protectionSystemsGroup = new THREE.Group();

/**
 * 1. CONTROL DE ACCESO (LOGIN)
 */
function checkLogin() {
    const user = document.getElementById('user').value.trim();
    const pass = document.getElementById('pass').value.trim();

    // Validación básica para prototipo
    if (user.toLowerCase() === "admin") {
        const loginCard = document.getElementById('login-section');
        const mainApp = document.getElementById('main-panel');
        
        loginCard.style.display = 'none';
        mainApp.style.display = 'block';
        
        // Inicialización forzada del motor gráfico
        setTimeout(() => {
            init3D();
            renderizar();
        }, 150);
    } else {
        alert("⚠️ Acceso denegado. Verifique sus credenciales.");
    }
}

/**
 * 2. CONFIGURACIÓN DEL MOTOR THREE.JS
 */
function init3D() {
    const container = document.getElementById('container3D');
    if (!container) return;

    // Crear Escena con Niebla (para profundidad)
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    scene.fog = new THREE.Fog(0xffffff, 50, 200);

    // Cámara con ángulo de ingeniería
    camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 2000);
    camera.position.set(70, 70, 70);

    // Renderizador con alta calidad
    renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true; // Sombras activadas
    
    container.innerHTML = ""; 
    container.appendChild(renderer.domElement);

    // Controles de Órbita Suaves
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Sistema de Iluminación Completo
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(50, 100, 50);
    mainLight.castShadow = true;
    scene.add(mainLight);

    // Helpers Visuales
    const gridHelper = new THREE.GridHelper(200, 20, 0x6c5ce7, 0xcccccc);
    scene.add(gridHelper);

    // Añadir Grupos a la Escena
    scene.add(powerSubstationGroup);
    scene.add(protectionSystemsGroup);

    // Loop de Animación
    animate();
    
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

function animate() {
    requestAnimationFrame(animate);
    if (controls) controls.update();
    if (renderer) renderer.render(scene, camera);
}

/**
 * 3. LÓGICA DE CONSTRUCCIÓN DE LA SUBESTACIÓN
 */
function renderizar() {
    // Parámetros de entrada
    const L = parseFloat(document.getElementById('largo').value) || 50;
    const A = parseFloat(document.getElementById('ancho').value) || 30;
    const H_punta = parseFloat(document.getElementById('altura').value) || 10;
    const R_esfera = parseFloat(document.getElementById('radio').value) || 20;

    // Validación de seguridad de ingeniería
    if (H_punta >= R_esfera) {
        alert("❌ CRÍTICO: La altura de la punta captadora no puede exceder el radio de la esfera rodante.");
        return;
    }

    // Limpiar grupos previos
    while(powerSubstationGroup.children.length > 0) powerSubstationGroup.remove(powerSubstationGroup.children[0]);
    while(protectionSystemsGroup.children.length > 0) protectionSystemsGroup.remove(protectionSystemsGroup.children[0]);

    // A. CONSTRUIR ESTRUCTURA CIVIL (PÓRTICOS)
    const hPortico = 8; // Metros
    const matGris = new THREE.MeshStandardMaterial({ color: 0xbdc3c7, roughness: 0.3 });

    // Columnas Principales
    const esquinas = [
        {x: -L/2, z: -A/2}, {x: L/2, z: -A/2},
        {x: -L/2, z: A/2},  {x: L/2, z: A/2}
    ];

    esquinas.forEach(pos => {
        // Columna de acero (Estructura)
        const colGeo = new THREE.BoxGeometry(0.6, hPortico, 0.6);
        const col = new THREE.Mesh(colGeo, matGris);
        col.position.set(pos.x, hPortico/2, pos.z);
        powerSubstationGroup.add(col);

        // B. SISTEMA DE APANTALLAMIENTO (Puntas y Domos)
        crearModuloProteccion(pos.x, pos.z, hPortico, H_punta, R_esfera);
    });

    // Vigas de conexión superiores
    const viga1 = new THREE.Mesh(new THREE.BoxGeometry(L, 0.4, 0.4), matGris);
    viga1.position.set(0, hPortico, -A/2);
    powerSubstationGroup.add(viga1);

    const viga2 = new THREE.Mesh(new THREE.BoxGeometry(L, 0.4, 0.4), matGris);
    viga2.position.set(0, hPortico, A/2);
    powerSubstationGroup.add(viga2);

    // C. EQUIPOS INTERNOS (Transformadores y aisladores)
    const trafoGeo = new THREE.BoxGeometry(L * 0.3, 5, A * 0.4);
    const trafoMat = new THREE.MeshStandardMaterial({ color: 0x2c3e50 });
    const trafo = new THREE.Mesh(trafoGeo, trafoMat);
    trafo.position.set(0, 2.5, 0);
    powerSubstationGroup.add(trafo);

    // D. ACTUALIZAR PLANIMETRÍA 2D
    const r_suelo = Math.sqrt(Math.pow(R_esfera, 2) - Math.pow(R_esfera - H_punta, 2));
    actualizarVista2D(L, A, r_suelo);

    // E. RESULTADOS EN UI
    document.getElementById('results-area').innerHTML = `
        <div style="color: #6c5ce7; font-weight: bold;">ANÁLISIS DE RIESGO TERMINADO</div>
        • Radio Eficaz Suelo: ${r_suelo.toFixed(2)} m<br>
        • Esferas Activas: 4 unidades<br>
        • Altura de Protección: ${(hPortico + H_punta)} m
    `;
}

/**
 * 4. GENERADOR DE MÓDULOS DE PROTECCIÓN (ESFERA RODANTE)
 */
function crearModuloProteccion(x, z, hBase, hExtra, R) {
    const totalH = hExtra; // La punta captadora mide hExtra
    const yStart = hBase; // Inicia arriba de la columna

    // Punta captadora (Mástil)
    const mastGeo = new THREE.CylinderGeometry(0.05, 0.1, totalH, 12);
    const mastMat = new THREE.MeshStandardMaterial({ color: 0x34495e, metalness: 0.8 });
    const mast = new THREE.Mesh(mastGeo, mastMat);
    mast.position.set(x, yStart + totalH/2, z);
    protectionSystemsGroup.add(mast);

    // Geometría del Domo de Protección (Lathe)
    const points = [];
    const resolucion = 20;
    for (let i = 0; i <= resolucion; i++) {
        let yLocal = (i / resolucion) * totalH;
        // Ecuación de la esfera: r = sqrt( R² - (R - H + yLocal)² )
        let r_horiz = Math.sqrt(Math.pow(R, 2) - Math.pow((R - totalH + yLocal), 2));
        points.push(new THREE.Vector2(r_horiz, yLocal));
    }

    const domeGeo = new THREE.LatheGeometry(points, 40);
    const domeMat = new THREE.MeshPhongMaterial({
        color: 0x6c5ce7,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide,
        shininess: 100
    });
    
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.set(x, yStart, z);
    protectionSystemsGroup.add(dome);
}

/**
 * 5. PLANO 2D (CANVAS)
 */
function actualizarVista2D(L, A, r_suelo) {
    const canvas = document.getElementById('canvas2D');
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const scale = Math.min(canvas.width / (L * 2.2), canvas.height / (A * 2.2));
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujo de Cimentación
    ctx.strokeStyle = "#dfe6e9";
    ctx.lineWidth = 1;
    ctx.strokeRect(cx - (L*scale)/2 - 10, cy - (A*scale)/2 - 10, L*scale + 20, A*scale + 20);

    // Área de la Subestación
    ctx.strokeStyle = "#6c5ce7";
    ctx.lineWidth = 2;
    ctx.strokeRect(cx - (L*scale)/2, cy - (A*scale)/2, L*scale, A*scale);

    // Círculos de Protección en esquinas
    const offsets = [{x:-1, z:-1}, {x:1, z:-1}, {x:-1, z:1}, {x:1, z:1}];
    offsets.forEach(o => {
        const px = cx + (o.x * L * scale / 2);
        const py = cy + (o.z * A * scale / 2);

        ctx.beginPath();
        ctx.arc(px, py, r_suelo * scale, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(108, 92, 231, 0.15)";
        ctx.fill();
        ctx.strokeStyle = "rgba(108, 92, 231, 0.6)";
        ctx.stroke();
        
        // Pin de ubicación
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI*2);
        ctx.fillStyle = "#2d3436";
        ctx.fill();
    });
}

// Registro del evento de botón en HTML (asegura que el botón funcione)
// Nota: En tu HTML el botón debe tener: onclick="renderizar()"
