"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";

const OoredooSpaceHero = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const waveGroupRef = useRef<THREE.Group>();
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup with space-like atmosphere
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 5, 50);
    sceneRef.current = scene;

    // Camera setup for immersive space view
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 8);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create wave groups
    const waveGroup = new THREE.Group();
    waveGroupRef.current = waveGroup;
    scene.add(waveGroup);

    // Create flowing ocean-like waves
    const createOceanWave = (width: number, height: number, segments: number, amplitude: number, frequency: number) => {
      const waveGeometry = new THREE.PlaneGeometry(width, height, segments, segments);
      const waveMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          mouseX: { value: 0 },
          mouseY: { value: 0 },
          amplitude: { value: amplitude },
          frequency: { value: frequency },
        },
        vertexShader: `
          uniform float time;
          uniform float mouseX;
          uniform float mouseY;
          uniform float amplitude;
          uniform float frequency;
          varying vec2 vUv;
          varying float vWave;
          varying vec3 vPosition;
          
          void main() {
            vUv = uv;
            vPosition = position;
            vec3 pos = position;
            
            // Create ocean wave patterns
            float wave1 = sin(pos.x * frequency + time * 2.0) * amplitude;
            float wave2 = sin(pos.y * frequency * 0.8 + time * 1.5) * amplitude * 0.7;
            float wave3 = sin(pos.x * frequency * 2.0 + pos.y * frequency * 0.5 + time * 3.0) * amplitude * 0.3;
            float wave4 = sin(pos.x * frequency * 0.3 + pos.y * frequency * 1.5 + time * 1.0) * amplitude * 0.5;
            
            // Mouse ripple effect
            float mouseDistance = distance(pos.xy, vec2(mouseX * 10.0, mouseY * 10.0));
            float mouseWave = sin(mouseDistance * 0.5 - time * 4.0) * amplitude * 0.8 / (1.0 + mouseDistance * 0.05);
            
            float totalWave = wave1 + wave2 + wave3 + wave4 + mouseWave;
            pos.z += totalWave;
            
            vWave = totalWave;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          varying vec2 vUv;
          varying float vWave;
          varying vec3 vPosition;
          
          void main() {
            float waveIntensity = (vWave + 1.0) * 0.5;
            
            // Ocean wave colors
            vec3 redColor = vec3(0.9, 0.1, 0.1);
            vec3 whiteColor = vec3(1.0, 1.0, 1.0);
            vec3 darkRed = vec3(0.2, 0.05, 0.05);
            vec3 deepRed = vec3(0.1, 0.02, 0.02);
            
            // Create wave foam effect
            float foam = smoothstep(0.7, 1.0, waveIntensity);
            
            // Base wave color
            vec3 baseColor = mix(deepRed, redColor, waveIntensity);
            
            // Add foam/white caps
            vec3 finalColor = mix(baseColor, whiteColor, foam * 0.8);
            
            // Add flowing highlights
            float highlight = sin(vUv.x * 20.0 + time * 3.0) * sin(vUv.y * 15.0 + time * 2.0);
            highlight = smoothstep(0.3, 0.8, highlight);
            finalColor += redColor * highlight * waveIntensity * 0.3;
            
            float alpha = 0.7 + waveIntensity * 0.3;
            gl_FragColor = vec4(finalColor, alpha);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide,
      });

      const waveMesh = new THREE.Mesh(waveGeometry, waveMaterial);
      return waveMesh;
    };

    // Create 3D technology waves
    const create3DTechWaves = () => {
      const waveGroup = new THREE.Group();

      // Create concentric wave rings with technology patterns
      for (let i = 0; i < 12; i++) {
        const radius = 2 + i * 1.2;
        const segments = 64;

        const waveGeometry = new THREE.RingGeometry(radius, radius + 0.15, segments, 1);
        const waveMaterial = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            mouseX: { value: 0 },
            mouseY: { value: 0 },
            waveIndex: { value: i },
          },
          vertexShader: `
            uniform float time;
            uniform float mouseX;
            uniform float mouseY;
            uniform float waveIndex;
            varying vec2 vUv;
            varying float vWave;
            varying float vIntensity;
            
            void main() {
              vUv = uv;
              vec3 pos = position;
              
              // Create technology wave patterns
              float angle = atan(pos.y, pos.x);
              float distance = length(pos.xy);
              
              // Digital signal waves
              float digitalWave1 = sin(angle * 16.0 + time * 3.0 + waveIndex * 0.5) * 0.4;
              float digitalWave2 = sin(angle * 32.0 + time * 2.0 + waveIndex * 0.3) * 0.3;
              float digitalWave3 = sin(angle * 8.0 + time * 4.0 + waveIndex * 0.7) * 0.2;
              
              // Frequency modulation
              float freqMod = sin(distance * 5.0 + time * 2.5 + waveIndex * 0.4) * 0.3;
              
              // Mouse interaction ripples
              float mouseDistance = distance(pos.xy, vec2(mouseX * 3.0, mouseY * 3.0));
              float mouseWave = sin(mouseDistance * 2.0 - time * 5.0) * 0.5 / (1.0 + mouseDistance * 0.2);
              
              // Pulsing transmission effect
              float pulse = sin(time * 3.0 + waveIndex * 0.6) * 0.3 + 0.7;
              
              float totalWave = (digitalWave1 + digitalWave2 + digitalWave3 + freqMod + mouseWave) * pulse;
              pos.z += totalWave;
              
              vWave = totalWave;
              vIntensity = pulse;
              
              gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
          `,
          fragmentShader: `
            uniform float time;
            uniform float waveIndex;
            varying vec2 vUv;
            varying float vWave;
            varying float vIntensity;
            
            void main() {
              float intensity = abs(vWave) * 2.0;
              
              // 5G technology colors
         // 5G technology colors
          // 5G technology colors
          vec3 redColor = vec3(0.929, 0.110, 0.141);  // ED1C24
          vec3 whiteColor = vec3(1.0, 1.0, 1.0);
          vec3 darkRed = vec3(0.2, 0.05, 0.05);
          vec3 brightRed = vec3(1.0, 0.2, 0.2); 
              
              // Create digital pattern
              float digitalPattern = sin(vUv.x * 50.0 + time * 4.0) * sin(vUv.y * 30.0 + time * 3.0);
              digitalPattern = step(0.3, digitalPattern);
              
              // Signal strength visualization
              float signalStrength = sin(time * 2.0 + waveIndex * 0.5) * 0.3 + 0.7;
              
              vec3 baseColor = mix(darkRed, redColor, intensity);
              vec3 finalColor = mix(baseColor, whiteColor, digitalPattern * intensity * 0.6);
              
              // Add signal glow
              finalColor += brightRed * signalStrength * intensity * 0.4;
              
              // Transmission effect
              float transmission = sin(time * 5.0 + waveIndex * 0.8) * 0.2 + 0.8;
              finalColor *= transmission;
              
              float alpha = (0.5 + intensity * 0.4) * vIntensity;
              gl_FragColor = vec4(finalColor, alpha);
            }
          `,
          transparent: true,
          side: THREE.DoubleSide,
        });

        const waveMesh = new THREE.Mesh(waveGeometry, waveMaterial);
        waveMesh.rotation.x = Math.PI / 2;
        waveMesh.position.y = Math.sin(i * 0.3) * 0.3;
        waveMesh.position.z = Math.cos(i * 0.2) * 0.2;

        waveGroup.add(waveMesh);
      }

      return waveGroup;
    };

    // Add 3D technology waves
    const techWaves = create3DTechWaves();
    waveGroup.add(techWaves);

    // Create signal towers/antennas
    const createSignalTower = (position: THREE.Vector3, height: number) => {
      const towerGroup = new THREE.Group();

      // Tower base
      const baseGeometry = new THREE.CylinderGeometry(0.2, 0.3, height, 8);
      const baseMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
        },
        vertexShader: `
          uniform float time;
          varying vec3 vPosition;
          
          void main() {
            vPosition = position;
            vec3 pos = position;
            
            // Signal pulsing
            float pulse = sin(time * 3.0 + pos.y * 2.0) * 0.05 + 1.0;
            pos.x *= pulse;
            pos.z *= pulse;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          varying vec3 vPosition;
          
          void main() {
            float pulse = sin(time * 4.0 + vPosition.y * 3.0) * 0.3 + 0.7;
            vec3 redColor = vec3(0.9, 0.1, 0.1);
            vec3 whiteColor = vec3(1.0, 1.0, 1.0);
            
            vec3 finalColor = mix(redColor, whiteColor, pulse);
            
            gl_FragColor = vec4(finalColor, 0.8);
          }
        `,
        transparent: true,
      });

      const towerMesh = new THREE.Mesh(baseGeometry, baseMaterial);
      towerMesh.position.y = height / 2;
      towerGroup.add(towerMesh);

      // Signal emissions
      for (let i = 0; i < 3; i++) {
        const emissionGeometry = new THREE.RingGeometry(0.5 + i * 0.3, 0.6 + i * 0.3, 16, 1);
        const emissionMaterial = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            emissionIndex: { value: i },
          },
          vertexShader: `
            uniform float time;
            uniform float emissionIndex;
            
            void main() {
              vec3 pos = position;
              
              // Expanding emission
              float expansion = sin(time * 2.0 + emissionIndex * 0.7) * 0.2 + 1.0;
              pos.xy *= expansion;
              
              gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
          `,
          fragmentShader: `
            uniform float time;
            uniform float emissionIndex;
            
            void main() {
              float pulse = sin(time * 3.0 + emissionIndex * 0.8) * 0.4 + 0.6;
              vec3 redColor = vec3(0.9, 0.1, 0.1);
              
              gl_FragColor = vec4(redColor, pulse * 0.3);
            }
          `,
          transparent: true,
        });

        const emissionMesh = new THREE.Mesh(emissionGeometry, emissionMaterial);
        emissionMesh.position.y = height + 0.5;
        emissionMesh.rotation.x = Math.PI / 2;
        towerGroup.add(emissionMesh);
      }

      towerGroup.position.copy(position);
      return towerGroup;
    };

    // Add signal towers
    const tower1 = createSignalTower(new THREE.Vector3(-8, -2, -3), 3);
    const tower2 = createSignalTower(new THREE.Vector3(8, -2, -3), 3);
    const tower3 = createSignalTower(new THREE.Vector3(0, -2, -8), 2.5);

    waveGroup.add(tower1);
    waveGroup.add(tower2);
    waveGroup.add(tower3);

    // Create additional wave layers for depth
    const createVerticalWave = (width: number, height: number, position: THREE.Vector3, rotation: THREE.Euler) => {
      const waveGeometry = new THREE.PlaneGeometry(width, height, 32, 32);
      const waveMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          mouseX: { value: 0 },
          mouseY: { value: 0 },
        },
        vertexShader: `
          uniform float time;
          uniform float mouseX;
          uniform float mouseY;
          varying vec2 vUv;
          varying float vWave;
          
          void main() {
            vUv = uv;
            vec3 pos = position;
            
            // Create vertical wave patterns
            float wave1 = sin(pos.y * 0.5 + time * 1.5) * 0.8;
            float wave2 = sin(pos.x * 0.3 + time * 2.0) * 0.6;
            float wave3 = sin(pos.y * 0.8 + pos.x * 0.2 + time * 2.5) * 0.4;
            
            // Mouse interaction
            float mouseDistance = distance(pos.xy, vec2(mouseX * 3.0, mouseY * 3.0));
            float mouseWave = sin(mouseDistance * 2.0 - time * 4.0) * 0.5 / (1.0 + mouseDistance * 0.1);
            
            float totalWave = wave1 + wave2 + wave3 + mouseWave;
            pos.z += totalWave;
            
            vWave = totalWave;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          varying vec2 vUv;
          varying float vWave;
          
          void main() {
            float intensity = (vWave + 1.0) * 0.5;
            
            vec3 redColor = vec3(0.9, 0.1, 0.1);
            vec3 whiteColor = vec3(1.0, 1.0, 1.0);
            vec3 darkRed = vec3(0.15, 0.03, 0.03);
            
            // Create flowing wave pattern
            float flow = sin(vUv.y * 10.0 + time * 2.0) * sin(vUv.x * 8.0 + time * 1.5);
            flow = smoothstep(-0.2, 0.2, flow);
            
            vec3 finalColor = mix(darkRed, redColor, intensity);
            finalColor = mix(finalColor, whiteColor, flow * intensity * 0.5);
            
            // Add depth fade
            float fade = 1.0 - abs(vUv.y - 0.5) * 2.0;
            finalColor *= fade;
            
            float alpha = 0.4 + intensity * 0.3;
            gl_FragColor = vec4(finalColor, alpha * fade);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide,
      });

      const waveMesh = new THREE.Mesh(waveGeometry, waveMaterial);
      waveMesh.position.copy(position);
      waveMesh.rotation.copy(rotation);
      return waveMesh;
    };

    // Add vertical wave walls
    const verticalWave1 = createVerticalWave(30, 20, new THREE.Vector3(-10, 0, -5), new THREE.Euler(0, Math.PI / 4, 0));
    const verticalWave2 = createVerticalWave(30, 20, new THREE.Vector3(10, 0, -5), new THREE.Euler(0, -Math.PI / 4, 0));
    const verticalWave3 = createVerticalWave(25, 15, new THREE.Vector3(0, 0, -10), new THREE.Euler(0, 0, 0));

    waveGroup.add(verticalWave1);
    waveGroup.add(verticalWave2);
    waveGroup.add(verticalWave3);

    // Create flowing particle streams
    const createParticleStream = (count: number, range: number) => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const sizes = new Float32Array(count);

      for (let i = 0; i < count; i++) {
        // Create spiral patterns
        const angle = (i / count) * Math.PI * 8;
        const radius = Math.random() * range;

        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = Math.sin(angle) * radius;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

        // Ooredoo colors
        const isRed = Math.random() > 0.3;
        colors[i * 3] = isRed ? 0.9 : 1.0;
        colors[i * 3 + 1] = isRed ? 0.1 : 1.0;
        colors[i * 3 + 2] = isRed ? 0.1 : 1.0;

        sizes[i] = Math.random() * 0.5 + 0.1;
      }

      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
        },
        vertexShader: `
          uniform float time;
          attribute float size;
          varying vec3 vColor;
          
          void main() {
            vColor = color;
            
            vec3 pos = position;
            pos.y += sin(time * 2.0 + pos.x * 0.1) * 0.5;
            pos.x += cos(time * 1.5 + pos.y * 0.1) * 0.3;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          
          void main() {
            float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
            float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
            
            gl_FragColor = vec4(vColor, alpha * 0.8);
          }
        `,
        transparent: true,
        vertexColors: true,
      });

      return new THREE.Points(geometry, material);
    };

    // Add multiple particle streams
    const particles1 = createParticleStream(800, 12);
    const particles2 = createParticleStream(600, 18);
    const particles3 = createParticleStream(400, 25);

    scene.add(particles1);
    scene.add(particles2);
    scene.add(particles3);

    // Add space-like ambient lighting
    const ambientLight = new THREE.AmbientLight(0x1a1a2e, 0.3);
    scene.add(ambientLight);

    // Add dramatic directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Add red accent light for Ooredoo branding
    const redLight = new THREE.PointLight(0xdc2626, 1, 30);
    redLight.position.set(-5, 5, 3);
    scene.add(redLight);

    // Mouse interaction
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      const time = Date.now() * 0.001;

      // Update wave materials and tech waves
      waveGroup.children.forEach((child, index) => {
        if (child instanceof THREE.Group) {
          // Update tech waves group
          child.children.forEach((wave, waveIndex) => {
            if (wave instanceof THREE.Mesh) {
              const material = wave.material as THREE.ShaderMaterial;
              if (material.uniforms.time) {
                material.uniforms.time.value = time + waveIndex * 0.2;
              }
              if (material.uniforms.mouseX) {
                material.uniforms.mouseX.value = mouseRef.current.x;
              }
              if (material.uniforms.mouseY) {
                material.uniforms.mouseY.value = mouseRef.current.y;
              }
              if (material.uniforms.emissionIndex) {
                material.uniforms.emissionIndex.value = waveIndex;
              }
            }
          });
        } else if (child instanceof THREE.Mesh) {
          const material = child.material as THREE.ShaderMaterial;
          if (material.uniforms.time) {
            material.uniforms.time.value = time + index * 0.2;
          }
          if (material.uniforms.mouseX) {
            material.uniforms.mouseX.value = mouseRef.current.x;
          }
          if (material.uniforms.mouseY) {
            material.uniforms.mouseY.value = mouseRef.current.y;
          }
        }
      });

      // Update particle materials
      [particles1, particles2, particles3].forEach((particles) => {
        const material = particles.material as THREE.ShaderMaterial;
        if (material.uniforms.time) {
          material.uniforms.time.value = time;
        }
      });

      // Rotate wave group for dynamic movement
      waveGroup.rotation.y += 0.002;
      waveGroup.rotation.z = Math.sin(time * 0.5) * 0.05;

      // Smooth camera movement based on mouse
      if (cameraRef.current) {
        const targetX = mouseRef.current.x * 1.5;
        const targetY = mouseRef.current.y * 1.5;

        cameraRef.current.position.x += (targetX - cameraRef.current.position.x) * 0.05;
        cameraRef.current.position.y += (targetY + 2 - cameraRef.current.position.y) * 0.05;
        cameraRef.current.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    };

    // Event listeners
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    });

    animate();
    setIsLoaded(true);

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* 3D Space Background */}
      <div ref={mountRef} className="absolute inset-0 z-0" />

      {/* Floating Stars Background */}
      <div className="absolute inset-0 z-5">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center px-4">
        <div className={`transition-all duration-3000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"} `}>
          <div className="flex items-center gap-12">
            {/* 5G dans un cercle rouge */}
            <div className="mb-12 relative ">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-transparent to-red-600/20 rounded-full blur-3xl animate-pulse"></div>

              {/* Cercle rouge avec 5G */}
              <div className="relative mx-auto w-48 h-48  md:w-56 md:h-56 mb-8 ">
                <div className="absolute inset-0 border-4 border-[#ED1C24] rounded-full animate-pulse bg-white"></div>
                <div className="absolute inset-2 border-2 border-red-400/50 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }}></div>
                <div className="absolute inset-4 border border-red-300/30 rounded-full animate-pulse" style={{ animationDelay: "1s" }}></div>

                <div className="absolute inset-0 flex items-center justify-center ">
                  <span className="text-6xl md:text-7xl font-bold bg-[#ED1C24] bg-clip-text text-transparent">5G</span>
                </div>

                {/* Ondulations autour du cercle */}
                <div className="absolute inset-0 rounded-full border-2 border-red-500/30 animate-ping"></div>
                <div className="absolute inset-0 rounded-full border border-red-400/20 animate-ping" style={{ animationDelay: "1s" }}></div>
              </div>

              <div className="h-1 w-48 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto animate-pulse"></div>
            </div>

            {/* Nouveau texte principal */}
            <div className="mb-12 relative">
              <div className="absolute -inset-10 bg-gradient-to-r from-red-500/10 via-white/5 to-red-500/10 rounded-full blur-2xl animate-pulse"></div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 relative text-center leading-tight">
                <span className="text-white">Vivez la</span>
                <span className="text-[#ED1C24]"> Vitesse</span>
                <span className="text-white"> du</span>
                <span className="text-[#ED1C24]"> Futur</span>
              </h2>
              <p className="text-xl md:text-2xl text-white/90 mb-4 font-light text-center">
                La <span className="text-[#ED1C24] font-semibold">5G</span> est <span className="text-[#ED1C24] font-semibold">Désormais</span> Entre
                Vos <span className="text-[#ED1C24] font-semibold">Mains</span>
              </p>
            </div>
          </div>

          {/* Métriques 5G */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {[
              { value: "10x", label: "Plus Rapide", color: "text-[#ED1C24]" },
              { value: "1ms", label: "Latence", color: "text-white" },
              { value: "∞", label: "Possibilités", color: "text-[#ED1C24]" },
            ].map((metric, index) => (
              <div key={index} className="text-center group">
                <div className="relative">
                  <div className={`text-4xl md:text-5xl font-bold ${metric.color} mb-2 group-hover:scale-110 transition-transform duration-300`}>
                    {metric.value}
                  </div>
                  <div className="text-sm md:text-base text-white/70 uppercase tracking-wider">{metric.label}</div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 z-20 bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-red-500 mx-auto mb-6"></div>
              <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border border-red-500/30 mx-auto"></div>
            </div>
            <p className="text-white text-lg mb-2">Activation de la 5G...</p>
            <p className="text-white/60">Connexion ultra-rapide en cours</p>
          </div>
        </div>
      )}

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default OoredooSpaceHero;
