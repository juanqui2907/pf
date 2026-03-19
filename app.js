/**
 * SPAT v2.0 - Sistema de Protección Atmosférica Profesional
 * Renderizado de Pórticos de Subestación y Esferas Rodantes Múltiples
 */

let scene, camera, renderer, controls;
let mainGroup = new THREE.Group(); 

// --- 1. Gestión de Acceso ---
function checkLogin() {
    const user = document.getElementById('user').value;
    if (user.toLowerCase() === "admin") {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('main-panel').style.display = 'block';
        
        // Inicialización con retardo para asegurar que el div tenga dimensiones
        setTimeout(() => {
            init3D();
            renderizar();
        }, 200);
    } else {
        alert("Acceso denegado. Intente con el usuario 'admin'.");
    }
}

// --- 2. Inicialización del Motor 3D ---
function init3D() {
    const container = document.getElementById('container3D');
    if (!container) return;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff); // Fondo Blanco

    camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(50, 50, 50);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.innerHTML = ""; // Limpiar antes de insertar
    container.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Iluminación para resaltar estructuras metálicas
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(50, 100, 50);
    scene.add(light);

    scene.add(mainGroup);

    // Ajuste automático si cambias el tamaño de la ventana
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

// --- 3. Lógica de Generación ---
function renderizar() {
    const L = parseFloat(document.getElementById('largo').value);
    const A = parseFloat(document.getElementById('ancho').value);
    const H = parseFloat(document.getElementById('altura').value);
    const R = parseFloat(document.getElementById('radio').value);

    if (H >= R) {
        alert("⚠️ Error Técnico: La altura de la punta (H) debe ser menor al radio de la esfera (R).");
        return;
    }

    // Limpiar escena anterior
    while(mainGroup.children.length > 0) mainGroup.remove(mainGroup.children[0]);

    // A. Dibujar la Subestación (Pórticos y Vigas)
    crearEstructuraSubestacion(L, A, 6); // Altura de pórtico fija en 6m

    // B. Dibujar los 4 Pararrayos en las esquinas
    const esquinas = [
        {x: -L/2, z: -A/2}, {x: L/2, z: -A/2},
        {x: -L/2, z: A/2},  {x: L/2, z: A/2}
    ];

    esquinas.forEach(pos => {
        crearPuntaCaptadora(pos.x, pos.z, H, R);
    });

    // C. Actualizar cálculos y 2D
    const r_suelo = Math.sqrt(Math.pow(R, 2) - Math.pow(R - H, 2));
    document.getElementById('results-area').innerHTML = `
        <strong>Ingeniería de Detalle:</strong><br>
        • Radio de esfera: ${R}m<br>
        • Protección en suelo: ${r_suelo.toFixed(2)}m por punta<br>
        • Estado: Zona Cubierta (Multi-esfera)
    `;
    dibujar2D(L, A, r_suelo);
}

// --- 4. Constructores de Geometría ---

function crearEstructuraSubestacion(L, A, hPortico) {
    const matMetal = new THREE.MeshLambertMaterial({ color: 0xbdc3c7 }); // Gris metálico
    const matEquipos = new THREE.MeshLambertMaterial({ color: 0x6c5ce7, transparent: true, opacity: 0.3 });

    // Dibujar columnas en las esquinas
    const colGeo = new THREE.CylinderGeometry(0.3, 0.3, hPortico, 8);
    const posCol = [{x:-L/2, z:-A/2}, {x:L/2, z:-A/2}, {x:-L/2, z:A/2}, {x:L/2, z:A/2}];
    
    posCol.forEach(p => {
        const col = new THREE.Mesh(colGeo, matMetal);
        col.position.set(p.x, hPortico/2, p.z);
        mainGroup.add(col);
    });

    // Dibujar Vigas superiores (Pórticos)
    const vigaL = new THREE.BoxGeometry(L, 0.2, 0.2);
    const v1 = new THREE.Mesh(vigaL, matMetal);
    v1.position.set(0, hPortico, -A/2);
    mainGroup.add(v1);

    const v2 = new THREE.Mesh(vigaL, matMetal);
    v2.position.set(0, hPortico, A/2);
    mainGroup.add(v2);

    // Representación de transformador central
    const transfo = new THREE.Mesh(new THREE.BoxGeometry(L*0.4, 4, A*0.4), matEquipos);
    transfo.position.y = 2;
    mainGroup.add(transfo);
}

function crearPuntaCaptadora(x, z, h, R) {
    const grupoPunta = new THREE.Group();

    // Mástil delgado
    const mast = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, h, 12),
        new THREE.MeshPhongMaterial({ color: 0x2c3e50 })
    );
    mast.position.y = h/2;
    grupoPunta.add(mast);

    // Domo de protección (Cálculo de la curva de esfera rodante)
    const points = [];
    for (let i = 0; i <= 20; i++) {
        const y = (i / 20) * h;
        const r_y = Math.sqrt(Math.pow(R, 2) - Math.pow((R - h + y), 2));
        points.push(new THREE.Vector2(r_y, y));
    }
    const domeMat = new THREE.MeshPhongMaterial({
        color: 0x00cec9,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide
    });
    const dome = new THREE.Mesh(new THREE.LatheGeometry(points, 32), domeMat);
    grupoPunta.add(dome);

    grupoPunta.position.set(x, 0, z);
    mainGroup.add(grupoPunta);
}

function dibujar2D(L, A, r_suelo) {
    const canvas = document.getElementById('canvas2D');
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const scale = Math.min(canvas.width / (L * 2), canvas.height / (A * 2));
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Área subestación
    ctx.strokeStyle = "#6c5ce7";
    ctx.setLineDash([2, 2]);
    ctx.strokeRect(cx - (L*scale)/2, cy - (A*scale)/2, L*scale, A*scale);
    ctx.setLineDash([]);

    // Círculos de protección
    const offsets = [{x:-1,z:-1}, {x:1,z:-1}, {x:-1,z:1}, {x:1,z:1}];
    offsets.forEach(o => {
        ctx.beginPath();
        ctx.arc(cx + (o.x * L*scale/2), cy + (o.z * A*scale/2), r_suelo * scale, 0, Math.PI*2);
        ctx.fillStyle = "rgba(0, 206, 201, 0.1)";
        ctx.fill();
        ctx.strokeStyle = "#00cec9";
        ctx.stroke();
    });
}
