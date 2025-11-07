document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // --- 1. Custom Cursor ---
    const cursor = document.querySelector('.cursor');
    const magneticButtons = document.querySelectorAll('.magnetic-btn');
    const interactiveElements = document.querySelectorAll('a, button, .skill-card, .project-card');

    window.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            duration: 0.3,
            x: e.clientX,
            y: e.clientY,
            ease: 'power3.out'
        });
    });

    // Grow on hover
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-grow');
        });

        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-grow');
        });
    });

    // Global fallback — shrink if mouse leaves window
    document.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-grow');
    });

    // --- 2. Magnetic Buttons ---
    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', function (e) {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - (rect.left + rect.width / 2);
            const y = e.clientY - (rect.top + rect.height / 2);

            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.5,
                ease: 'power3.out'
            });
        });

        btn.addEventListener('mouseleave', function () {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });

    // --- 3. Hero Text Animation ---
    gsap.to('.hero-title span', {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.5
    });

    // --- 4. Scroll-Triggered Animations ---
    const revealElements = document.querySelectorAll('.reveal-up');
    revealElements.forEach(el => {
        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            delay: parseFloat(el.style.transitionDelay) || 0
        });
    });

    // --- 5. Horizontal Scroll Project Gallery ---
    const gallery = document.querySelector('.project-gallery');
    const scrollSection = document.querySelector('.horizontal-scroll-section');

    if (gallery && scrollSection) {
        gsap.to(gallery, {
            x: () => -(gallery.scrollWidth - scrollSection.offsetWidth),
            ease: 'none',
            scrollTrigger: {
                trigger: scrollSection,
                start: 'top top',
                end: () => `+=${gallery.scrollWidth - scrollSection.offsetWidth}`,
                scrub: true,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true
            }
        });
    }


    // --- 6. three.js Background ---
    let scene, camera, renderer, particles, controls;
    let mouseX = 0, mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    function initThree() {
        const canvas = document.getElementById('bg-canvas');

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 1000;

        const particleCount = 5000;
        const particlesGeometry = new THREE.BufferGeometry();
        const posArray = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 2000;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: 1.5,
            color: 0x888888,
            transparent: true,
            blending: THREE.AdditiveBlending
        });

        particles = new THREE.Points(particlesGeometry, particleMaterial);
        scene.add(particles);

        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        document.addEventListener('mousemove', onDocumentMouseMove, false);
        window.addEventListener('resize', onWindowResize, false);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onDocumentMouseMove(event) {
        mouseX = (event.clientX - windowHalfX) * 0.1;
        mouseY = (event.clientY - windowHalfY) * 0.1;
    }

    function animate() {
        requestAnimationFrame(animate);

        const time = Date.now() * 0.00005;

        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        particles.rotation.y = time * 0.5;

        renderer.render(scene, camera);
    }

    initThree();
    animate();

    // --- 7. Send Form Message to Discord
    document.getElementById("contact-form").addEventListener("submit", async function (e) {
        e.preventDefault();
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();
        const status = document.getElementById("form-status");

        status.textContent = "Sending...";

        try {
            const response = await fetch("https://eoqih2cuoy6927o.m.pipedream.net", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, message })
            });

            if (response.ok) {
                status.textContent = "✅ Message sent successfully!";
                e.target.reset();
            } else {
                status.textContent = "❌ Failed to send message. Try again later.";
            }
        } catch (error) {
            console.error(error);
            status.textContent = "⚠️ Network error. Please try again.";
        }
    });


});