// app.js

// --- Variables Globales para Three.js ---
let scene, camera, renderer, controls;
// Objetos 3D que necesitamos actualizar o remover
let substationGround, pararrayosPunta, protectionDome; 

// --- 1. Lógica de Login (Sin cambios) ---
function checkLogin() {
    // Validación ultra simple para el ejemplo (user: admin, pass: cualquiera)
    const user = document.getElementById('user').value;
    if(user === "admin") {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('main-panel').style.display = 'block';
        
        // Inicializar el motor 3D UNA sola vez al loguearse
        init3D(); 
    } else {
        alert("Usuario incorrecto. Intenta con 'admin'");
    }
}

// --- 2. Inicialización de Three.js (El Escenario) ---
function init3D() {
    const container = document.getElementById('container3D');
    
    // Obtener dimensiones del contenedor (definido en CSS)
    const width = container.clientWidth || 600; 
    const height = container.clientHeight || 400;

    // A. Escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0); // Fondo gris claro

    // B. Cámara (Perspectiva)
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(50, 50, 50); // Posición inicial elevada
    camera.lookAt(0, 0, 0);

    // C. Renderizador
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // D. Controles de Órbita (Permite rotar con el mouse)
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    
    // E. Iluminación
    const ambientLight = new THREE.AmbientLight(0x404040, 2); // Luz suave general
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Luz tipo sol
    directionalLight.position.set(10, 20, 10);
    scene.add(directionalLight);

    // F. Ayudas visuales (Ejes X, Y, Z)
    const axesHelper = new THREE.AxesHelper(20);
    scene.add(axesHelper);

    // Iniciar el bucle de animación
    animate();
}

// Bucle de renderizado continuo
function animate() {
    requestAnimationFrame(animate);
    if (controls) controls.update(); // Requerido para OrbitControls
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}


// --- 3. Lógica Principal de Renderizado (2D y 3D) ---
function renderizar() {
    // A. OBTENER DATOS DE ENTRADA
    const largoVal = parseFloat(document.getElementById('largo').value);
    const anchoVal = parseFloat(document.getElementById('ancho').value);
    const hVal = parseFloat(document.getElementById('altura').value); // Altura punta
    const RVal = parseFloat(document.getElementById('radio').value);   // Radio esfera rodante

    // B. VALIDACIÓN MATEMÁTICA BÁSICA
    // En el método de la esfera rodante, la altura de la punta no puede ser mayor al radio.
    if (hVal >= RVal) {
        alert("Error de ingeniería: La altura de la punta (h) debe ser MENOR que el Radio de la Esfera (R) para este método.");
        return;
    }

    // --- C. RENDERIZADO 2D (Canvas) ---
    actualizarCanvas2D(largoVal, anchoVal, hVal, RVal);

    // --- D. RENDERIZADO 3D (Three.js) ---
    actualizarEscena3D(largoVal, anchoVal, hVal, RVal);
}


// --- 4. Funciones Auxiliares de Dibujo ---

function actualizarCanvas2D(largo, ancho, h, R) {
    const canvas = document.getElementById('canvas2D');
    const ctx = canvas.getContext('2d');
    
    // Cálculo de ingeniería: Radio de protección en el suelo (y=0)
    const r_prot_suelo = Math.sqrt(Math.pow(R, 2) - Math.pow(R - h, 2));

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Factor de escala simple para que quepa en el canvas
    const scale = Math.min(canvas.width / (largo * 1.5), canvas.height / (ancho * 1.5));
    const offsetX = 50;
    const offsetY = 50;

    // Dibujo zona subestación (rectángulo)
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeRect(offsetX, offsetY, largo * scale, ancho * scale);
    ctx.fillStyle = "#e0e0e0";
    ctx.fillRect(offsetX, offsetY, largo * scale, ancho * scale);
    
    // Dibujo pararrayos (punto en el centro para este ejemplo base)
    const centerX = offsetX + (largo * scale) / 2;
    const centerY = offsetY + (ancho * scale) / 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 3, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();

    // Dibujo círculo de protección en el suelo
    ctx.beginPath();
    ctx.arc(centerX, centerY, r_prot_suelo * scale, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(0, 255, 0, 0.2)"; // Verde transparente
    ctx.fill();
    ctx.strokeStyle = "green";
    ctx.stroke();

    ctx.fillStyle = "black";
    ctx.fillText(`Radio Protección Suelo: ${r_prot_suelo.toFixed(2)}m`, 10, canvas.height - 10);
}

function actualizarEscena3D(largo, ancho, h, R) {
    // 1. Limpiar objetos anteriores para no sobrecargar la memoria
    if (substationGround) scene.remove(substationGround);
    if (pararrayosPunta) scene.remove(pararrayosPunta);
    if (protectionDome) scene.remove(protectionDome);

    // 2. Dibujar el Suelo de la Subestación
    const groundGeom = new THREE.PlaneGeometry(largo, ancho);
    const groundMat = new THREE.MeshLambertMaterial({ color: 0x999999, side: THREE.DoubleSide });
    substationGround = new THREE.Mesh(groundGeom, groundMat);
    substationGround.rotation.x = -Math.PI / 2; // Acostar el plano
    scene.add(substationGround);

    // 3. Dibujar el Mástil del Pararrayos (un cilindro fino)
    const mastGeom = new THREE.CylinderGeometry(0.2, 0.2, h, 16);
    const mastMat = new THREE.MeshLambertMaterial({ color: 0x333333 });
    pararrayosPunta = new THREE.Mesh(mastGeom, mastMat);
    pararrayosPunta.position.y = h / 2; // Elevarlo para que la base esté en 0
    // Por ahora en el centro (0,0,0)
    scene.add(pararrayosPunta);

    // 4. CREAR EL DOMO DE PROTECCIÓN 3D (La Esfera Rodante)
    // Usamos LatheGeometry para generar la forma de revolución
    
    const points = [];
    const segments = 20; // Resolución de la curva
    
    // Generar los puntos de la curva desde el suelo (y=0) hasta la punta (y=h)
    // La ecuación de la esfera es: r² + (R-h + y)² = R²
    // Despejando el radio horizontal r a cualquier altura y:
    // r = sqrt( R² - (R - h + y)² )

    for (let i = 0; i <= segments; i++) {
        // y va de 0 a h
        const y = (i / segments) * h; 
        
        // Ecuación de la Esfera Rodante
        const terminoInterno = R - h + y;
        const r_horizontal = Math.sqrt(Math.pow(R, 2) - Math.pow(terminoInterno, 2));
        
        // Añadir punto (x, y). X es el radio horizontal en ese punto
        points.push(new THREE.Vector2(r_horizontal, y));
    }

    // Crear la geometría girando esos puntos 360 grados sobre el eje Y
    const latheGeom = new THREE.LatheGeometry(points, 32); // 32 segmentos alrededor
    const latheMat = new THREE.MeshPhongMaterial({ 
        color: 0x00ff00, 
        opacity: 0.3, 
        transparent: true,
        side: THREE.DoubleSide, // Ver por dentro y por fuera
        wireframe: false // Cambiar a true para ver la malla
    });
    
    protectionDome = new THREE.Mesh(latheGeom, latheMat);
    // Posición en el centro (0,0,0) donde está el mástil
    scene.add(protectionDome);
}
