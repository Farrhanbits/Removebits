import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for objects that react to scroll
    const scrollGroup = new THREE.Group();
    scene.add(scrollGroup);

    // 1. Central 3D Floating Geometric Orb (Icosahedron Wireframe + Inner Core)
    const geom = new THREE.IcosahedronGeometry(7, 1);
    const wireMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      roughness: 0.2,
      metalness: 0.8,
    });
    const icosahedron = new THREE.Mesh(geom, wireMat);
    icosahedron.position.set(12, 2, -6);
    scrollGroup.add(icosahedron);

    // Secondary Floating Polyhedron on Left
    const geom2 = new THREE.TorusGeometry(5, 1.2, 16, 50);
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0xc084fc,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    });
    const torus = new THREE.Mesh(geom2, torusMat);
    torus.position.set(-14, -8, -10);
    scrollGroup.add(torus);

    // Floating Ring
    const ringGeom = new THREE.RingGeometry(8.5, 8.8, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
    });
    const ring = new THREE.Mesh(ringGeom, ringMat);
    ring.rotation.x = Math.PI / 3;
    ring.position.set(12, 2, -6);
    scrollGroup.add(ring);

    // 2. Starfield / Particle Constellation
    const particleCount = 700;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const purpleColor = new THREE.Color(0xa855f7);
    const violetColor = new THREE.Color(0xc084fc);
    const deepPurple = new THREE.Color(0x7e22ce);

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      positions[idx] = (Math.random() - 0.5) * 80;
      positions[idx + 1] = (Math.random() - 0.5) * 80;
      positions[idx + 2] = (Math.random() - 0.5) * 60;

      const mixed = Math.random() > 0.5 ? purpleColor : (Math.random() > 0.3 ? violetColor : deepPurple);
      colors[idx] = mixed.r;
      colors[idx + 1] = mixed.g;
      colors[idx + 2] = mixed.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 3. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const purpleLight = new THREE.PointLight(0xa855f7, 4, 60);
    purpleLight.position.set(10, 10, 10);
    scene.add(purpleLight);

    const violetLight = new THREE.PointLight(0xc084fc, 3, 50);
    violetLight.position.set(-15, -10, 5);
    scene.add(violetLight);

    // Dynamic mouse and scroll tracking
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetScrollY = 0;
    let currentScrollY = 0;

    const onMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const onScroll = () => {
      targetScrollY = window.scrollY;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', onResize);

    // Animation Loop
    let reqId;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Smooth scroll lerp
      currentScrollY += (targetScrollY - currentScrollY) * 0.08;

      // 3D rotations
      icosahedron.rotation.x = elapsedTime * 0.15;
      icosahedron.rotation.y = elapsedTime * 0.2;
      ring.rotation.z = elapsedTime * 0.1;

      torus.rotation.x = elapsedTime * 0.12;
      torus.rotation.y = elapsedTime * 0.18;

      particles.rotation.y = elapsedTime * 0.03;
      particles.rotation.x = elapsedTime * 0.015;

      // Scroll effect on 3D objects
      const scrollFactor = currentScrollY * 0.003;
      scrollGroup.position.y = scrollFactor * 4;
      scrollGroup.rotation.y = scrollFactor * 0.5;
      scrollGroup.rotation.z = scrollFactor * 0.2;

      // Camera parallax
      camera.position.x = mouseX * 2;
      camera.position.y = -mouseY * 2 - currentScrollY * 0.004;
      camera.lookAt(0, -currentScrollY * 0.004, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden"
      aria-hidden="true"
    />
  );
};
