document.addEventListener('DOMContentLoaded', () => {
    let isDarkTheme = true; // Estado global del tema

    // 🌀 THREE.JS LATERAL ANIMATION (Tempo Style - Left Panel)
    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, (window.innerWidth / 2) / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true }); // Sin alpha pre-multiplicado
    renderer.setClearColor(0x0A1929); // Empatar exactamente con fondo Navy
    
    
    renderer.setSize(window.innerWidth / 2, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Dynamic Maritime Texture
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 512;

    const maritimeData = [
        "LAT: 8.9833° N", "LON: 79.5167° W", 
        "MMSI: 351465000", "IMO: 9474773",
        "STATUS: UNDERWAY", "COURSE: 142°",
        "ITB-CERT-2026-X4", "SOLAS-III/20",
        "MARPOL-73/78", "Vessel: NEPTUNE-1",
        "INSP: CERTIFIED", "LOG: A1-SECURE"
    ];

    function updateTexture(offset) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Fondo totalmente estéril/transparente
        ctx.fillStyle = isDarkTheme ? '#9DC3C2' : '#0A1929';
        ctx.font = 'bold 24px "IBM Plex Mono"';
        
        for (let i = 0; i < 20; i++) {
            const dataIndex = (i + Math.floor(offset)) % maritimeData.length;
            ctx.fillText(maritimeData[dataIndex], 20, (i * 30) - (offset % 1 * 30));
        }
    }

    const texture = new THREE.CanvasTexture(canvas);
    // Material de texto (transparente)
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false });
    
    // Naval Concept: Rings and Wavy Plane (Simulating Sea Waves & SVG Strokes)
    const geometryRing = new THREE.TorusGeometry(2, 0.01, 16, 100);
    
    const geometryBlade = new THREE.PlaneGeometry(3.5, 0.35, 32, 6); // Mayor subdivisión para estilo vectorial
    const posAttributes = geometryBlade.attributes.position;
    for (let i = 0; i < posAttributes.count; i++) {
        const x = posAttributes.getX(i);
        // Deformación Z para crear la curva permanente matemática de una ola
        posAttributes.setZ(i, Math.sin(x * 2.5) * 0.15);
    }
    geometryBlade.computeVertexNormals();
    
    const stack = [];
    const count = 13;
    for (let i = 0; i < count; i++) {
        // Combinamos un anillo con una "aguja" o lámina de datos
        const group = new THREE.Group();
        
        const ring = new THREE.Mesh(geometryRing, new THREE.MeshBasicMaterial({ color: 0x0A1929, transparent: true, opacity: 0.3 }));
        
        // Base de Color Puro (Oculta mágicamente el fondo confundiéndose con el environment clear color)
        const solidMaterial = new THREE.MeshBasicMaterial({ color: 0x0A1929, transparent: true, opacity: 0.8, side: THREE.DoubleSide });
        const bladeSolid = new THREE.Mesh(geometryBlade, solidMaterial);
        
        // La Capa de Texto
        const blade = new THREE.Mesh(geometryBlade, material);
        blade.position.z += 0.001; // Ligeiramente adelante para evitar flickers
        
        // Capa Wireframe: Se camufla a propósito con el fondo Navy (Modo Noche)
        const wireMaterial = new THREE.MeshBasicMaterial({ color: 0x9DC3C2, wireframe: true, transparent: true, opacity: 0.2 });
        const bladeWire = new THREE.Mesh(geometryBlade, wireMaterial);
        bladeWire.position.z += 0.006; 
        
        group.add(ring);
        group.add(bladeSolid);
        group.add(blade);
        group.add(bladeWire);
        
        group.position.y = (i - count / 2) * 0.25;
        scene.add(group);
        stack.push(group);
    }

    camera.position.z = 4;
    camera.position.x = 0; // Centrado en el panel izquierdo

    let scrollY = 0;
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });

    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.02; // Tiempo más suave para el oleaje
        
        updateTexture(time * 1.5); // Acelerar un poco la textura
        texture.needsUpdate = true;

        const scrollPercent = scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        
        stack.forEach((group, i) => {
            // 🌊 FÍSICA DE OLEAJE MARÍTIMO (Sea Wave Logic)
            const waveOffset = i * 0.4;
            const tide = Math.sin(time * 2 + waveOffset) * 0.15; // Subida y bajada de la marea
            const surge = Math.cos(time * 1.5 + waveOffset) * 0.2; // Empuje horizontal de la ola
            
            // LÓGICA DE BUCLE 360º (Loop Perfection)
            // Multiplicamos scrollPercent * Math.PI * 2 para cerrar círculo completo.
            // (i - 6) asegura que el elemento 6 (Logo ITB) sea el nodo ancla Frontal.
            const twist = (i - 6) * 0.2 + (scrollPercent * Math.PI * 2) + (tide * 0.1);
            
            group.rotation.y = twist;
            // Cabeceo (Pitch) sobre las olas
            group.rotation.z = Math.sin(time * 3 + waveOffset) * 0.08;
            
            // Desplazamiento orgánico
            group.position.x = (Math.sin(twist) * 0.2) + surge;
            group.position.y = (i - count / 2) * 0.25 + tide;
            
            // Suave rotación en X (Roll) para acentuar el choque de la ola
            group.rotation.x = Math.cos(time * 2.5 + waveOffset) * 0.05;
        });

        renderer.render(scene, camera);
    }

    animate();

    // 🚢 ITB VECTOR ASSETS INTEGRATION
    const loader = new THREE.SVGLoader();
    const svgAssets = [
        { url: 'assets/shipGeneralCargo.svg', index: 0, scale: 0.001 },
        { url: 'assets/shipContainer.svg', index: 2, scale: 0.001 },
        { url: 'assets/shipBulkCarrier.svg', index: 4, scale: 0.001 },
        { url: 'assets/logoITB.svg', index: 6, scale: 0.0015 },
        { url: 'assets/shipHeavyLiftVessel.svg', index: 8, scale: 0.001 },
        { url: 'assets/shipTanker.svg', index: 10, scale: 0.001 },
        { url: 'assets/shipRoro.svg', index: 12, scale: 0.001 }
    ];

    svgAssets.forEach(asset => {
        loader.load(asset.url, (data) => {
            const paths = data.paths;
            const group = new THREE.Group();

            for (let i = 0; i < paths.length; i++) {
                const path = paths[i];
                // Ignorar trazos para quedarse solo con el relleno del vector,
                // asegurando un look minimalista y evitando siluetas gigantes de 'stroke' no definidos
                const material = new THREE.MeshBasicMaterial({
                    color: 0xC9A227, // Royal Gold para destacar los barcos
                    side: THREE.DoubleSide,
                    depthWrite: false,
                    transparent: true,
                    opacity: 0.6
                });

                const shapes = THREE.SVGLoader.createShapes(path);
                for (let j = 0; j < shapes.length; j++) {
                    const shape = shapes[j];
                    const geometry = new THREE.ShapeGeometry(shape);
                    const mesh = new THREE.Mesh(geometry, material);
                    group.add(mesh);
                }
            }

            // Center and scale
            group.scale.set(asset.scale, -asset.scale, asset.scale); // SVGs están invertidos en Y
            
            // Auto-centering logic - Recalculate box after scaling
            const box = new THREE.Box3().setFromObject(group);
            const center = box.getCenter(new THREE.Vector3());
            
            // Substracción simple (ya estaba escalado en world-space)
            group.position.x = -center.x;
            group.position.y = -center.y;
            group.position.z = 0.5; // Empujar un poco al frente para que no colisione Z-fighting con la lámina
            
            // Add to specific stack group
            if (stack[asset.index]) {
                stack[asset.index].add(group);
                // Adjust blade logic for visibility
                stack[asset.index].children.forEach(child => {
                    // Transparentar más las hojas si llevan iconos (opcional con wireframes)
                    if (child.material && child.material.map) {
                        child.material.opacity = 0.3;
                    }
                });
            }
        });
    });

    // Resize Handling
    window.addEventListener('resize', () => {
        camera.aspect = (window.innerWidth / 2) / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth / 2, window.innerHeight);
    });

    // 🕵️ REVEAL OBSERVER
    const revealElements = document.querySelectorAll('.grid-item, .hero-text, .hero-text > *');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        revealObserver.observe(el);
    });

    // 🌗 THEME TOGGLE LOGIC
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            isDarkTheme = !isDarkTheme;
            document.documentElement.classList.toggle('light-theme');
            
            // Switch Icon
            themeBtn.innerHTML = isDarkTheme ? '<i class="ph ph-sun"></i>' : '<i class="ph ph-moon"></i>';
            
            // Update 3D Materials y Background Físico de WebGL
            const bgColor = isDarkTheme ? 0x0A1929 : 0xFFFFFF;
            renderer.setClearColor(bgColor);
            
            const newRingColor = isDarkTheme ? 0x0A1929 : 0xE5E7EB; // Anillos exteriores ocultos
            const newWireColor = isDarkTheme ? 0x9DC3C2 : 0x0A1929; // Wireframe de Olas devuelto al Cyan
            const newShipColor = isDarkTheme ? 0xC9A227 : 0x0A1929;
            
            stack.forEach(group => {
                group.children.forEach(child => {
                    // Malla Base (bladeSolid) para camuflaje perfecto
                    if (child.geometry && child.geometry.type === 'PlaneGeometry' && !child.material.map && !child.material.wireframe) {
                        child.material.color.setHex(bgColor);
                    }
                    // Set Ring Color
                    if (child.geometry && child.geometry.type === 'TorusGeometry') {
                        child.material.color.setHex(newRingColor);
                    }
                    // Set Wireframe Color
                    if (child.material && child.material.wireframe) {
                        child.material.color.setHex(newWireColor);
                    }
                    
                    // Set Vector (Ships) Color inside SVG Groups
                    if (child.type === 'Group') {
                        child.children.forEach(mesh => {
                            if (mesh.material && !mesh.material.map && !mesh.material.wireframe) {
                                mesh.material.color.setHex(newShipColor);
                            }
                        });
                    }
                });
            });
        });
    }
});
