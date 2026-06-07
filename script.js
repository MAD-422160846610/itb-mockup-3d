document.addEventListener('DOMContentLoaded', () => {
    let isDarkTheme = true;
    let mobileMenuOpen = false;

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuOpen = !mobileMenuOpen;
            mobileMenu.classList.toggle('active', mobileMenuOpen);
            mobileMenuBtn.innerHTML = mobileMenuOpen 
                ? '<i class="ph ph-x"></i>' 
                : '<i class="ph ph-list"></i>';
        });

        // Close menu when clicking a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuOpen = false;
                mobileMenu.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="ph ph-list"></i>';
            });
        });
    }

    // Smooth Scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const navHeight = 80;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // EmailJS - Configurar con tus credenciales
    // Reemplaza estos valores con los tuyos de EmailJS
    const EMAILJS_PUBLIC_KEY = 'TU_PUBLIC_KEY';
    const EMAILJS_SERVICE_ID = 'TU_SERVICE_ID';
    const EMAILJS_TEMPLATE_ID = 'TU_TEMPLATE_ID';

    // Contact Form Handler with EmailJS
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const formStatus = document.getElementById('form-status');

    if (contactForm && typeof emailjs !== 'undefined') {
        // Inicializar EmailJS
        emailjs.init(EMAILJS_PUBLIC_KEY);

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Mostrar estado de carga
            if (submitBtn) {
                submitBtn.textContent = 'Enviando...';
                submitBtn.disabled = true;
            }

            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            // Validación simple
            if (!data.name || !data.email) {
                if (formStatus) {
                    formStatus.textContent = 'Por favor completa los campos requeridos.';
                    formStatus.className = 'form-status error';
                }
                if (submitBtn) {
                    submitBtn.textContent = 'Enviar Mensaje';
                    submitBtn.disabled = false;
                }
                return;
            }

            try {
                // Enviar email usando EmailJS
                await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                    from_name: data.name,
                    from_email: data.email,
                    company: data.company || 'No especifica',
                    service: data.service || 'Otro',
                    message: data.message
                });

                // Éxito
                if (formStatus) {
                    formStatus.textContent = '¡Gracias! Tu mensaje ha sido enviado correctamente.';
                    formStatus.className = 'form-status success';
                }
                contactForm.reset();
            } catch (error) {
                // Error
                console.error('Error al enviar:', error);
                if (formStatus) {
                    formStatus.textContent = 'Error al enviar. Por favor intenta de nuevo o contáctanos directamente.';
                    formStatus.className = 'form-status error';
                }
            } finally {
                if (submitBtn) {
                    submitBtn.textContent = 'Enviar Mensaje';
                    submitBtn.disabled = false;
                }
            }
        });
    } else if (contactForm) {
        // Fallback si EmailJS no está cargado
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            if (!data.name || !data.email) {
                alert('Por favor completa los campos requeridos.');
                return;
            }

            console.log('Form submitted:', data);
            alert('Gracias por contactarnos. Te responderemos pronto.');
            this.reset();
        });
    }

    // 🌀 THREE.JS LATERAL ANIMATION (Tempo Style - Left Panel)
    const container = document.getElementById('canvas-container');
    
    // Check if THREE.js is loaded
    if (typeof THREE === 'undefined') {
        console.warn('Three.js not loaded, skipping 3D animation');
        return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, (window.innerWidth / 2) / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0x0A1929);
    
    renderer.setSize(window.innerWidth / 2, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Dynamic Maritime Texture
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 512;

    const maritimeData = [
        "LAT: 10.4806° N", "LON: 66.9036° W", 
        "MMSI: 351465000", "IMO: 9474773",
        "STATUS: UNDERWAY", "COURSE: 142°",
        "ITB-CERT-2026-X4", "SOLAS-III/20",
        "MARPOL-73/78", "Vessel: NEPTUNE-1",
        "INSP: CERTIFIED", "LOG: A1-SECURE"
    ];

    function updateTexture(offset) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = isDarkTheme ? '#9DC3C2' : '#0A1929';
        ctx.font = 'bold 24px "IBM Plex Mono", monospace';
        
        for (let i = 0; i < 20; i++) {
            const dataIndex = (i + Math.floor(offset)) % maritimeData.length;
            ctx.fillText(maritimeData[dataIndex], 20, (i * 30) - (offset % 1 * 30));
        }
    }

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshBasicMaterial({ 
        map: texture, 
        transparent: true, 
        opacity: 0.9, 
        side: THREE.DoubleSide, 
        depthWrite: false 
    });
    
    // Naval Concept: Rings and Wavy Plane
    const geometryRing = new THREE.TorusGeometry(2, 0.01, 16, 100);
    
    const geometryBlade = new THREE.PlaneGeometry(3.5, 0.35, 32, 6);
    const posAttributes = geometryBlade.attributes.position;
    for (let i = 0; i < posAttributes.count; i++) {
        const x = posAttributes.getX(i);
        posAttributes.setZ(i, Math.sin(x * 2.5) * 0.15);
    }
    geometryBlade.computeVertexNormals();
    
    const stack = [];
    const count = 13;
    for (let i = 0; i < count; i++) {
        const group = new THREE.Group();
        
        const ring = new THREE.Mesh(geometryRing, new THREE.MeshBasicMaterial({ 
            color: 0x0A1929, 
            transparent: true, 
            opacity: 0.3 
        }));
        
        const solidMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x0A1929, 
            transparent: true, 
            opacity: 0.8, 
            side: THREE.DoubleSide 
        });
        const bladeSolid = new THREE.Mesh(geometryBlade, solidMaterial);
        
        const blade = new THREE.Mesh(geometryBlade, material);
        blade.position.z += 0.001;
        
        const wireMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x9DC3C2, 
            wireframe: true, 
            transparent: true, 
            opacity: 0.2 
        });
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
    camera.position.x = 0;

    let scrollY = 0;
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });

    let time = 0;
    let letteringAsset = null;
    function animate() {
        requestAnimationFrame(animate);
        
        // Performance optimization: Stop rendering on mobile if canvas is hidden
        if (window.innerWidth <= 1024) return;

        time += 0.02;
        
        updateTexture(time * 1.5);
        texture.needsUpdate = true;

        const scrollPercent = scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        
        stack.forEach((group, i) => {
            const waveOffset = i * 0.4;
            const tide = Math.sin(time * 2 + waveOffset) * 0.15;
            const surge = Math.cos(time * 1.5 + waveOffset) * 0.2;
            const twist = (i - 6) * 0.2 + (scrollPercent * Math.PI * 2) + (tide * 0.1);

            group.rotation.y = twist;
            group.rotation.z = Math.sin(time * 3 + waveOffset) * 0.08;
            
            group.position.x = (Math.sin(twist) * 0.2) + surge;
            group.position.y = (i - count / 2) * 0.25 + tide;
            group.position.z = 0;
            
            group.rotation.x = Math.cos(time * 2.5 + waveOffset) * 0.05;

            // Visibility logic for elements inside the group (Ships)
            const cosTwist = Math.cos(twist);
            const targetOpacity = Math.pow(Math.max(0, cosTwist), 3);
            
            group.children.forEach(child => {
                if (child.userData && (child.userData.isShip || child.userData.isAsset)) {
                    // Apply to the group children
                    child.children.forEach(mesh => {
                        if (mesh.material) {
                            mesh.material.opacity = targetOpacity;
                            mesh.material.transparent = true;
                            mesh.visible = targetOpacity > 0.05;
                        }
                    });
                }
            });
        });

        // Floating Branding Update
        if (letteringAsset) {
            const offsetX = -0.25;
            const offsetY = 0.25;
            
            letteringAsset.position.x = offsetX + Math.sin(time * 1.5) * 0.05;
            letteringAsset.position.y = offsetY + Math.sin(time * 2.0) * 0.1;
            letteringAsset.position.z = 1.0 + Math.cos(time * 1.2) * 0.05;
            letteringAsset.rotation.x = Math.cos(time * 2.5) * 0.02;
            letteringAsset.rotation.y = Math.sin(time * 1.0) * 0.03;
            letteringAsset.rotation.z = Math.sin(time * 1.8) * 0.02;

            letteringAsset.children.forEach(child => {
                if (child.material) {
                    child.material.opacity = 1.0;
                    child.material.transparent = true;
                    child.visible = true;
                    child.renderOrder = 999;
                    child.material.depthTest = false;
                }
            });
        }

        renderer.render(scene, camera);
    }

    animate();

    // 🚢 ITB VECTOR ASSETS INTEGRATION
    if (typeof THREE.SVGLoader !== 'undefined') {
        const loader = new THREE.SVGLoader();
        const originUrl = window.location.href.includes('github.io') 
            ? 'https://mad-422160846610.github.io/itb-mockup-3d/' 
            : '';

        const svgAssets = [
            { url: originUrl + 'assets/shipGeneralCargo.svg', index: 0, scale: 0.001 },
            { url: originUrl + 'assets/shipContainer.svg', index: 2, scale: 0.001 },
            { url: originUrl + 'assets/shipBulkCarrier.svg', index: 4, scale: 0.001 },
            { url: originUrl + 'assets/letteringITB.svg', index: 6, isLettering: true, scale: 0.0018 },
            { url: originUrl + 'assets/shipHeavyLiftVessel.svg', index: 8, scale: 0.001 },
            { url: originUrl + 'assets/shipTanker.svg', index: 10, scale: 0.001 },
            { url: originUrl + 'assets/shipRoro.svg', index: 12, scale: 0.001 }
        ];

        svgAssets.forEach(asset => {
            loader.load(asset.url, (data) => {
                const paths = data.paths;
                const group = new THREE.Group();
                group.userData.isAsset = true;
                group.userData.isShip = !asset.isLettering;
                group.userData.isLettering = asset.isLettering;

                for (let i = 0; i < paths.length; i++) {
                    const path = paths[i];
                    const material = new THREE.MeshBasicMaterial({
                        color: 0xC9A227,
                        side: THREE.DoubleSide,
                        depthWrite: false,
                        transparent: true,
                        opacity: 1.0
                    });

                    const shapes = THREE.SVGLoader.createShapes(path);
                    for (let j = 0; j < shapes.length; j++) {
                        const shape = shapes[j];
                        const geometry = new THREE.ShapeGeometry(shape);
                        const mesh = new THREE.Mesh(geometry, material);
                        group.add(mesh);
                    }
                }
                
                group.scale.set(asset.scale, -asset.scale, asset.scale);
                const box = new THREE.Box3().setFromObject(group);
                const center = box.getCenter(new THREE.Vector3());
                group.position.x = -center.x;
                group.position.y = -center.y;
                group.position.z = 0.5;

                if (asset.isLettering) {
                    letteringAsset = group;
                    scene.add(group);
                } else if (stack[asset.index]) {
                    stack[asset.index].add(group);
                }
            });
        });
    }

    // Resize Handling
    window.addEventListener('resize', () => {
        const canvasContainer = document.getElementById('canvas-container');
        if (canvasContainer && window.innerWidth > 1024) {
            camera.aspect = (window.innerWidth / 2) / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth / 2, window.innerHeight);
        }
    });

    if (window.innerWidth <= 1024) {
        container.style.display = 'none';
    }

    // 🕵️ REVEAL OBSERVER
    const revealElements = document.querySelectorAll('.grid-item, .hero-text, .hero-text > *, .section-header, .about-content, .contact-grid');
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
            
            themeBtn.innerHTML = isDarkTheme 
                ? '<i class="ph ph-sun"></i>' 
                : '<i class="ph ph-moon"></i>';
            
            // Update 3D Materials
            const bgColor = isDarkTheme ? 0x0A1929 : 0xFFFFFF;
            renderer.setClearColor(bgColor);
            
            const newRingColor = isDarkTheme ? 0x0A1929 : 0xE5E7EB;
            const newWireColor = isDarkTheme ? 0x9DC3C2 : 0x0A1929;
            const newShipColor = isDarkTheme ? 0xC9A227 : 0x0A1929;
            
            stack.forEach(group => {
                group.children.forEach(child => {
                    if (child.geometry && child.geometry.type === 'PlaneGeometry' && 
                        !child.material.map && !child.material.wireframe) {
                        child.material.color.setHex(bgColor);
                    }
                    if (child.geometry && child.geometry.type === 'TorusGeometry') {
                        child.material.color.setHex(newRingColor);
                    }
                    if (child.material && child.material.wireframe) {
                        child.material.color.setHex(newWireColor);
                    }
                    
                    if (child.type === 'Group') {
                        child.children.forEach(mesh => {
                            if (mesh.material && !mesh.material.map && !mesh.material.wireframe) {
                                mesh.material.color.setHex(newShipColor);
                            }
                        });
                    }
                });
            });

            // Update Floating Branding Color
            if (letteringAsset) {
                letteringAsset.children.forEach(mesh => {
                    if (mesh.material && !mesh.material.wireframe) {
                        mesh.material.color.setHex(newShipColor);
                    }
                });
            }
        });
    }
    // 🚢 SHIP DETAIL MODAL LOGIC
    const shipsData = {
        "bulk-carrier": {
            title: "Bulk Carrier",
            utility: "Diseñados para el transporte de carga seca a granel (minerales, granos, carbón). Su estructura requiere inspecciones rigurosas de bodegas y tapas de escotilla.",
            value: "ITB asegura que la estanqueidad y limpieza de las bodegas cumplan con los estándares para evitar contaminación de la carga y daños estructurales."
        },
        "container-ship": {
            title: "Container Ship",
            utility: "Buques especializados en el transporte de contenedores estandarizados. La precisión en la estiba y el amarre es crítica para la estabilidad.",
            value: "Verificamos los sistemas de trincado y la integridad de los puntos de conexión, minimizando riesgos de pérdida de carga en alta mar."
        },
        "tanker": {
            title: "Tanker",
            utility: "Transporte de líquidos (petróleo, químicos, gas). Operan bajo normativas OCIMF extremadamente estrictas debido al riesgo ambiental.",
            value: "Nuestros inspectores evalúan la integridad de tanques y sistemas de bombeo, garantizando el cumplimiento de protocolos de seguridad internacionales."
        },
        "roro": {
            title: "Ro-Ro (Roll-on/Roll-off)",
            utility: "Buques que transportan carga rodante (vehículos, camiones). Poseen rampas integradas y requieren ventilación especializada.",
            value: "Inspeccionamos los mecanismos de rampa y sistemas de ventilación, asegurando una operación de carga y descarga fluida y segura."
        },
        "heavy-lift": {
            title: "Heavy Lift",
            utility: "Transporte de cargas sobredimensionadas o extremadamente pesadas (plantas industriales, otros buques).",
            value: "Evaluamos la capacidad de carga estructural y los puntos de izaje, garantizando que la ingeniería de transporte sea impecable."
        },
        "general-cargo": {
            title: "General Cargo",
            utility: "Buques versátiles para diversos tipos de mercancías empaquetadas o piezas sueltas.",
            value: "Optimizamos la supervisión de estiba para maximizar el uso del espacio y proteger la integridad física de cada bulto."
        },
        "gasiferos": {
            title: "Gasíferos (LPG/LNG)",
            utility: "Transporte de gas licuado de petróleo o natural a temperaturas criogénicas o presurizadas.",
            value: "ITB aporta inspectores de alta especialidad para verificar sistemas de contención de carga y gestión de vapores (Boil-off gas)."
        },
        "buques-proyecto": {
            title: "Buques Proyecto",
            utility: "Logística dedicada a componentes de infraestructura masiva (parques eólicos, plataformas).",
            value: "Coordinamos la logística técnica desde el puerto hasta la entrega, asegurando que cada pieza crítica llegue sin daños."
        },
        "dragas": {
            title: "Dragas",
            utility: "Equipos de ingeniería para la excavación y remoción de sedimentos en canales de navegación y puertos.",
            value: "Auditamos la eficiencia operativa y el estado técnico de los equipos de dragado para asegurar calados operativos seguros."
        },
        "especializados": {
            title: "Buques Especializados",
            utility: "Unidades para fines específicos como investigación, tendido de cables o buceo saturado.",
            value: "Proveemos certificaciones técnicas que garantizan que el buque puede cumplir su misión especializada bajo estándares de clase."
        }
    };

    const modal = document.getElementById('ship-modal');
    const modalClose = document.getElementById('modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalUtility = document.getElementById('modal-utility');
    const modalValue = document.getElementById('modal-value');

    const fleetItems = document.querySelectorAll('.fleet-item');

    fleetItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
            const shipKey = item.getAttribute('data-ship');
            const data = shipsData[shipKey];

            if (data) {
                modalTitle.textContent = data.title;
                modalUtility.textContent = data.utility;
                modalValue.textContent = data.value;
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scroll
            }
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scroll
        });
    }

    // Close modal on click outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close modal on Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});