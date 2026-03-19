// app.js

// --- Variables Globales Three.js ---
let scene, camera, renderer, controls;
let substationGround, pararrayosPunta, protectionDome; 

// --- 1. Lógica de Login (Actualizada: User 'admin', Pass: cualquiera) ---
function checkLogin() {
    const user = document.getElementById('user').value;
    // En un prototipo, no necesitamos validar el pass para agilizar
    if(user.toLowerCase() === "admin") {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('main-panel').style.display = 'block';
        
        // Inicializar 3D y renderizar por primera vez automáticamente
        init3D(); 
        renderizar(); 
    } else {
        alert("Usuario incorrecto. Intenta con 'admin'");
    }
}

// --- 2. Inicialización de Three.js ---
function init3D() {
    const container = document.getElementById('container3D');
    
    // Obtener dimensiones reales del contenedor CSS
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff); // FONDO BLANCO puro

    // Cámara
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(30, 30, 30); // Un poco más cerca

    // Renderizador moderno con antialias
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio); // Mayor nitidez en pantallas Retina
    container.appendChild(renderer.domElement);

    // Controles de Órbita
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Suaviza el movimiento

    // Iluminación mejorada
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 20);
    scene.add(directionalLight);

    // Helper de ejes (más sutil)
    const axesHelper = new THREE.AxesHelper(10);
    scene.add(axesHelper);

    // Manejar redimensionado de ventana
    window.addEventListener('resize', onWindowResize, false);

    animate();
}

function onWindowResize() {
    const container = document.getElementById('container3D');
    if(!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

function animate() {
    requestAnimationFrame(animate);
    if (controls) controls.update(); 
    if (renderer) renderer.render(scene, camera);
}


// --- 3. Lógica de Renderizado ---
function renderizar() {
    // Entradas
    const largoVal = parseFloat(document.getElementById('largo').value);
    const anchoVal = parseFloat(document.getElementById('ancho').value);
    const hVal = parseFloat(document.getElementById('altura').value); 
    const RVal = parseFloat(document.getElementById('radio').value);   

    // Validación de Ingeniería
    if (hVal >= RVal) {
        alert("🚨 Error de diseño: La altura (h) debe ser menor que el Radio (R).");
        return;
    }

    // Cálculos rápidos
    const r_prot_suelo = Math.sqrt(Math.pow(RVal, 2) - Math.pow(RVal - hVal, 2));
    
    // Actualizar Panel de resultados UI
    const resultsArea = document.getElementById('results-area');
    resultsArea.innerHTML = `<strong>Radio de protección en suelo:</strong> ${r_prot_suelo.toFixed(2)} m`;

    // Ejecutar Visualizaciones
    actualizarCanvas2D(largoVal, anchoVal, hVal, RVal, r_prot_suelo);
    actualizarEscena3D(largoVal, anchoVal, hVal, RVal);
}


// --- 4. Funciones de Dibujo ---

function actualizarCanvas2D(largo, ancho, h, R, r_prot_suelo) {
    const canvas = document.getElementById('canvas2D');
    const ctx = canvas.getContext('2d');
    
    // Ajustar resolución interna del canvas
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const padding = 20;
    const scale = Math.min((canvas.width - padding*2) / largo, (canvas.height - padding*2) / ancho);
    
    const drawLargo = largo * scale;
    const drawAncho = ancho * scale;
    const offsetX = (canvas.width - drawLargo) / 2;
    const offsetY = (canvas.height - drawAncho) / 2;

    // Dibujo zona (Morado muy clarito)
    ctx.fillStyle = "rgba(108, 92, 231, 0.05)";
    ctx.fillRect(offsetX, offsetY, drawLargo, drawAncho);
    ctx.strokeStyle = "#6c5ce7";
    ctx.lineWidth = 1;
    ctx.strokeRect(offsetX, offsetY, drawLargo, drawAncho);
    
    const centerX = offsetX + drawLargo / 2;
    const centerY = offsetY + drawAncho / 2;

    // Círculo protección (Verde acento)
    ctx.beginPath();
    ctx.arc(centerX, centerY, r_prot_suelo * scale, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(0, 184, 148, 0.1)"; 
    ctx.fill();
    ctx.strokeStyle = "#00b894";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 3]); // Línea punteada
    ctx.stroke();
    ctx.setLineDash([]); // Reset

    // Punto pararrayos (Morado fuerte)
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, 2 * Math.PI);
    ctx.fillStyle = "#6c5ce7";
    ctx.fill();
}

function actualizarEscena3D(largo, ancho, h, R) {
    // Limpieza
    if (substationGround) scene.remove(substationGround);
    if (pararrayosPunta) scene.remove(pararrayosPunta);
    if (protectionDome) scene.remove(protectionDome);

    // 1. Suelo (Gris muy suave, casi blanco)
    const groundGeom = new THREE.PlaneGeometry(largo, ancho);
    const groundMat = new THREE.MeshLambertMaterial({ color: 0xf0f0f0, side: THREE.DoubleSide });
    substationGround = new THREE.Mesh(groundGeom, groundMat);
    substationGround.rotation.x = -Math.PI / 2;
    scene.add(substationGround);

    // 2. Mástil (Morado oscuro)
    const mastGeom = new THREE.CylinderGeometry(0.15, 0.15, h, 16);
    const mastMat = new THREE.MeshPhongMaterial({ color: 0x4a148c }); // Deep Purple
    pararrayosPunta = new THREE.Mesh(mastGeom, mastMat);
    pararrayosPunta.position.y = h / 2;
    scene.add(pararrayosPunta);

    // 3. DOMO DE PROTECCIÓN (Verde agua transparente, estilo tecnológico)
    const points = [];
    const segments = 25; 
    
    for (let i = 0; i <= segments; i++) {
        const y = (i / segments) * h; 
        const terminoInterno = R - h + y;
        const r_horizontal = Math.sqrt(Math.pow(R, 2) - Math.pow(terminoInterno, 2));
        points.push(new THREE.Vector2(r_horizontal, y));
    }

    const latheGeom = new THREE.LatheGeometry(points, 40);
    const latheMat = new THREE.MeshPhongMaterial({ 
        color: 0x00cec9, // Cyan/Verde agua
        opacity: 0.25, 
        transparent: true,
        side: THREE.DoubleSide,
        specular: 0xeeffff, // Brillo metálico
        shininess: 100
    });
    
    protectionDome = new THREE.Mesh(latheGeom, latheMat);
    scene.add(protectionDome);
}
