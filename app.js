/**
 * SPAT - Sistema de Protección Atmosférica Profesional
 * Basado en el Método de la Esfera Rodante (IEC 62305)
 */

// --- Variables Globales de la Escena 3D ---
let scene, camera, renderer, controls;
let currentDome, currentMast, currentGround;

// --- 1. Sistema de Acceso ---
function checkLogin() {
    const user = document.getElementById('user').value;
    // Login simple para prototipo: usuario 'admin'
    if (user.toLowerCase() === "admin") {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('main-panel').style.display = 'block';
        
        // Inicializar el motor 3D y ejecutar el primer cálculo
        init3D();
        renderizar();
    } else {
        alert("Usuario no reconocido. Use 'admin' para ingresar.");
    }
}

// --- 2. Inicialización de Three.js (Motor 3D) ---
function init3D() {
    const container = document.getElementById('container3D');
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Escena y fondo (Blanco limpio)
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // Cámara Perspectiva
    camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(40, 40, 40);

    // Renderizador con suavizado de bordes (Antialias)
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Controles de Órbita (Mouse: rotar, scroll: zoom)
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; 

    // Luces (Ambiental para sombras suaves y Direccional para volumen)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    
    const sunLight = new THREE.DirectionalLight(0xffffff, 0.5);
    sunLight.position.set(10, 20, 10);
    scene.add(sunLight);

    // Guía de ejes (X: Rojo, Y: Verde, Z: Azul)
    const axesHelper = new THREE.AxesHelper(15);
    scene.add(axesHelper);

    // Escuchar cambios de tamaño de ventana
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    if (controls) controls.update();
    if (renderer) renderer.render(scene, camera);
}

// --- 3. Lógica de Ingeniería y Renderizado ---
function renderizar() {
    // Captura de datos desde el HTML
    const largo = parseFloat(document.getElementById('largo').value);
    const ancho = parseFloat(document.getElementById('ancho').value);
    const h = parseFloat(document.getElementById('altura').value); // Altura punta
    const R = parseFloat(document.getElementById('radio').value);   // Radio esfera

    // Validación Técnica: h < R (La esfera debe poder tocar la punta y el suelo)
    if (h >= R) {
        alert("Error: Según el método de la esfera rodante, la altura del captador (h) debe ser menor al radio de la esfera (R).");
        return;
    }

    // Cálculo del Radio de Protección en el Suelo (Nivel 0)
    // Fórmula: r = sqrt( R² - (R - h)² )
    const r_suelo = Math.sqrt(Math.pow(R, 2) - Math.pow(R - h, 2));

    // Actualizar texto de resultados en la UI
    document.getElementById('results-area').innerHTML = `
        <strong>Resultados del Cálculo:</strong><br>
        Radio de protección (Suelo): ${r_suelo.toFixed(2)} m<br>
        Área protegida aprox: ${(Math.PI * Math.pow(r_suelo, 2)).toFixed(2)} m²
    `;

    // Ejecutar dibujos
    dibujar2D(largo, ancho, r_suelo);
    dibujar3D(largo, ancho, h, R);
}

// --- 4. Visualización 2D (Vista de Planta) ---
function dibujar2D(largo, ancho, r_suelo) {
    const canvas = document.getElementById('canvas2D');
    const ctx = canvas.getContext('2d');
    
    // Ajuste dinámico del tamaño del canvas
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const scale = Math.min((canvas.width - 40) / largo, (canvas.height - 40) / ancho);
    const offsetX = (canvas.width - largo * scale) / 2;
    const offsetY = (canvas.height - ancho * scale) / 2;

    // Dibujo Rectángulo Subestación (Blanco/Morado)
    ctx.fillStyle = "rgba(108, 92, 231, 0.05)";
    ctx.fillRect(offsetX, offsetY, largo * scale, ancho * scale);
    ctx.strokeStyle = "#6c5ce7";
    ctx.lineWidth = 2;
    ctx.strokeRect(offsetX, offsetY, largo * scale, ancho * scale);

    // Círculo de protección en el suelo (Verde Tech)
    const cx = offsetX + (largo * scale) / 2;
    const cy = offsetY + (ancho * scale) / 2;

    ctx.beginPath();
    ctx.arc(cx, cy, r_suelo * scale, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0, 184, 148, 0.15)";
    ctx.fill();
    ctx.strokeStyle = "#00b894";
    ctx.setLineDash([5, 5]); // Línea discontinua
    ctx.stroke();
    ctx.setLineDash([]); 

    // Punto central (Mástil)
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fillStyle = "#6c5ce7";
    ctx.fill();
}

// --- 5. Visualización 3D (Modelo de Revolución) ---
function dibujar3D(largo, ancho, h, R) {
    // Limpiar objetos previos
    if (currentGround) scene.remove(currentGround);
    if (currentMast) scene.remove(currentMast);
    if (currentDome) scene.remove(currentDome);

    // A. Crear el Suelo
    const groundGeom = new THREE.PlaneGeometry(largo, ancho);
    const groundMat = new THREE.MeshLambertMaterial({ color: 0xf5f5f5, side: THREE.DoubleSide });
    currentGround = new THREE.Mesh(groundGeom, groundMat);
    currentGround.rotation.x = -Math.PI / 2;
    scene.add(currentGround);

    // B. Crear el Mástil (Cilindro morado)
    const mastGeom = new THREE.CylinderGeometry(0.2, 0.2, h, 16);
    const mastMat = new THREE.MeshPhongMaterial({ color: 0x6c5ce7 });
    currentMast = new THREE.Mesh(mastGeom, mastMat);
    currentMast.position.y = h / 2;
    scene.add(currentMast);

    // C. Crear el Domo de Protección (Esfera Rodante)
    // Generamos la curva: r(y) = sqrt( R² - (R - h + y)² )
    const points = [];
    const steps = 30;
    for (let i = 0; i <= steps; i++) {
        const y = (i / steps) * h;
        const r_y = Math.sqrt(Math.pow(R, 2) - Math.pow((R - h + y), 2));
        points.push(new THREE.Vector2(r_y, y));
    }

    // Convertir curva en sólido de revolución (Lathe)
    const domeGeom = new THREE.LatheGeometry(points, 64);
    const domeMat = new THREE.MeshPhongMaterial({
        color: 0x00cec9, // Verde Agua / Cyan
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
        specular: 0xffffff,
        shininess: 80
    });
    
    currentDome = new THREE.Mesh(domeGeom, domeMat);
    scene.add(currentDome);
}
