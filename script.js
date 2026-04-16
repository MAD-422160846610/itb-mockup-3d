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

    // Contact Form Handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            // Simple validation
            if (!data.name || !data.email) {
                alert('Por favor completa los campos requeridos.');
                return;
            }

            // In a real implementation, you would send this to a server
            console.log('Form submitted:', data);
            
            // Show success message
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
        "LAT: 8.9833° N", "LON: 79.5167° W", 
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
    function animate() {
        requestAnimationFrame(animate);
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
            
            group.rotation.x = Math.cos(time * 2.5 + waveOffset) * 0.05;
        });

        renderer.render(scene, camera);
    }

    animate();

    // 🚢 ITB VECTOR ASSETS INTEGRATION
    // Check if SVGLoader is available
    if (typeof THREE.SVGLoader === 'undefined') {
        console.warn('SVGLoader not loaded, skipping ship assets');
    } else {
        const loader = new THREE.SVGLoader();
        const originUrl = window.location.href.includes('github.io') 
            ? 'https://mad-422160846610.github.io/itb-mockup-3d/' 
            : '';
        const cb = '?v=2';

        const svgAssets = [
            { url: originUrl + 'assets/shipGeneralCargo.svg' + cb, index: 0, scale: 0.001 },
            { url: originUrl + 'assets/shipContainer.svg' + cb, index: 2, scale: 0.001 },
            { url: originUrl + 'assets/shipBulkCarrier.svg' + cb, index: 4, scale: 0.001 },
            { url: originUrl + 'assets/logoITB.svg' + cb, index: 6, scale: 0.0015 },
            { url: originUrl + 'assets/shipHeavyLiftVessel.svg' + cb, index: 8, scale: 0.001 },
            { url: originUrl + 'assets/shipTanker.svg' + cb, index: 10, scale: 0.001 },
            { url: originUrl + 'assets/shipRoro.svg' + cb, index: 12, scale: 0.001 }
        ];

        svgAssets.forEach(asset => {
            loader.load(asset.url, (data) => {
                const paths = data.paths;
                const group = new THREE.Group();

                for (let i = 0; i < paths.length; i++) {
                    const path = paths[i];
                    const material = new THREE.MeshBasicMaterial({
                        color: 0xC9A227,
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

                group.scale.set(asset.scale, -asset.scale, asset.scale);
                
                const box = new THREE.Box3().setFromObject(group);
                const center = box.getCenter(new THREE.Vector3());
                
                group.position.x = -center.x;
                group.position.y = -center.y;
                group.position.z = 0.5;
                
                if (stack[asset.index]) {
                    stack[asset.index].add(group);
                    stack[asset.index].children.forEach(child => {
                        if (child.material && child.material.map) {
                            child.material.opacity = 0.3;
                        }
                    });
                }
            }, 
            // Error handler
            undefined,
            (error) => {
                console.warn('Failed to load SVG:', asset.url, error);
            });
        });
    }

    // Resize Handling
    window.addEventListener('resize', () => {
        // Only resize if canvas container is visible (50vw layout)
        const canvasContainer = document.getElementById('canvas-container');
        if (canvasContainer && window.innerWidth > 1024) {
            camera.aspect = (window.innerWidth / 2) / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth / 2, window.innerHeight);
        } else {
            // Hide canvas on smaller screens
            canvasContainer.style.display = 'none';
        }
    });

    // Check initial window size
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
        });
    }
});