/**
 * SPAT - Sistema de Protección Atmosférica Unificado
 * Basado en el Método de la Esfera Rodante (IEC 62305)
 * Visualización Multipararrayos y Subestación 3D
 */

// --- Variables Globales ---
let scene, camera, renderer, controls;
let pararrayosGroup = new THREE.Group(); 
let subestacionMesh, groundMesh;

// --- 1. Sistema de Acceso ---
function checkLogin() {
    const user = document.getElementById('user').value;
    if (user.toLowerCase() === "admin") {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('main-panel').style.display = 'block';
        
        // Delay para asegurar que el contenedor 3D exista en el DOM
        setTimeout(() => {
            init3D();
            renderizar();
        }, 150);
    } else {
        alert("Usuario no reconocido. Use 'admin' para ingresar.");
    }
}

// --- 2. Inicialización de Motor 3D ---
function init3D() {
    const container = document.getElementById('container3D');
    const width = container.clientWidth;
    const height = container.clientHeight || 500; // Asegura altura mínima

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(60, 60, 60);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; 

    // Iluminación
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const sun = new THREE.DirectionalLight(0xffffff, 0.6);
    sun.position.set(50, 100, 50);
    scene.add(sun);

    // Ejes y Grupo de Objetos
    scene.add(new THREE.AxesHelper(20));
    scene.add(pararrayosGroup);

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    if (controls) controls.update();
    if (renderer) renderer.render(scene, camera);
}

// --- 3. Lógica de Cálculo y Renderizado ---
function renderizar() {
    const largo = parseFloat(document.getElementById('largo').value);
    const ancho = parseFloat(document.getElementById('ancho').value);
    const hPunta = parseFloat(document.getElementById('altura').value);
    const R = parseFloat(document.getElementById('radio').value);
    const hEquipos = 5; // Altura fija de los equipos de la subestación

    if (hPunta >= R) {
        alert("Error: La altura h debe ser menor al radio de la esfera R.");
        return;
    }

    // A. Cálculos de Ingeniería
    const r_suelo = Math.sqrt(Math.pow(R, 2) - Math.pow(R - hPunta, 2));
    document.getElementById('results-area').innerHTML = `
        <strong>Resultados:</strong><br>
        Radio prot. suelo: ${r_suelo.toFixed(2)} m<br>
        Configuración: 4 Puntas Captadoras
    `;

    // B. Dibujar Subestación 3D (Volumen)
    if (subestacionMesh) scene.remove(subestacionMesh);
    if (groundMesh) scene.remove(groundMesh);

    // Suelo
    const groundGeo = new THREE.PlaneGeometry(largo * 2, ancho * 2);
    const groundMat = new THREE.MeshLambertMaterial({ color: 0xf0f0f0 });
    groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    scene.add(groundMesh);

    // Cuerpo de la subestación
    const geoSub = new THREE.BoxGeometry(largo, hEquipos, ancho);
    const matSub = new THREE.MeshLambertMaterial({ 
        color: 0x6c5ce7, 
        transparent: true, 
        opacity: 0.15 
    });
    subestacionMesh = new THREE.Mesh(geoSub, matSub);
    subestacionMesh.position.y = hEquipos / 2;
    scene.add(subestacionMesh);

    // C. Dibujar Múltiples Pararrayos
    actualizarMultiplesPararrayos(largo, ancho, hPunta, R);

    // D. Dibujar 2D
    dibujar2D(largo, ancho, r_suelo);
}

function actualizarMultiplesPararrayos(largo, ancho, h, R) {
    while(pararrayosGroup.children.length > 0) pararrayosGroup.remove(pararrayosGroup.children[0]);

    // Colocamos uno en cada esquina de la zona definida
    const coords = [
        {x: -largo/2, z: -ancho/2},
        {x: largo/2, z: -ancho/2},
        {x: -largo/2, z: ancho/2},
        {x: largo/2, z: ancho/2}
    ];

    coords.forEach(pos => {
        const p = crearUnPararrayosCompleto(h, R);
        p.position.set(pos.x, 0, pos.z);
        pararrayosGroup.add(p);
    });
}

function crearUnPararrayosCompleto(h, R) {
    const grupo = new THREE.Group();

    // Mástil
    const mastGeo = new THREE.CylinderGeometry(0.15, 0.15, h, 16);
    const mastMat = new THREE.MeshPhongMaterial({ color: 0x2d3436 });
    const mast = new THREE.Mesh(mastGeo, mastMat);
    mast.position.y = h / 2;
    grupo.add(mast);

    // Domo de Esfera Rodante
    const points = [];
    for (let i = 0; i <= 20; i++) {
        const y = (i / 20) * h;
        const r_y = Math.sqrt(Math.pow(R, 2) - Math.pow((R - h + y), 2));
        points.push(new THREE.Vector2(r_y, y));
    }
    const domeGeo = new THREE.LatheGeometry(points, 32);
    const domeMat = new THREE.MeshPhongMaterial({
        color: 0x00cec9,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide
    });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    grupo.add(dome);

    return grupo;
}

function dibujar2D(largo, ancho, r_suelo) {
    const canvas = document.getElementById('canvas2D');
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const scale = Math.min(canvas.width / (largo * 1.8), canvas.height / (ancho * 1.8));
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Área Subestación
    ctx.strokeStyle = "#6c5ce7";
    ctx.lineWidth = 2;
    ctx.strokeRect(cx - (largo*scale)/2, cy - (ancho*scale)/2, largo*scale, ancho*scale);

    // Círculos de protección (4 esquinas)
    const offsets = [{x:-1,z:-1}, {x:1,z:-1}, {x:-1,z:1}, {x:1,z:1}];
    offsets.forEach(o => {
        const px = cx + (o.x * largo*scale/2);
        const py = cy + (o.z * ancho*scale/2);
        
        ctx.beginPath();
        ctx.arc(px, py, r_suelo * scale, 0, Math.PI*2);
        ctx.fillStyle = "rgba(0, 206, 201, 0.15)";
        ctx.fill();
        ctx.strokeStyle = "rgba(0, 206, 201, 0.5)";
        ctx.stroke();
        
        // Punto de ubicación
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI*2);
        ctx.fillStyle = "#6c5ce7";
        ctx.fill();
    });
}
