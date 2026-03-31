import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Float, useScroll, ScrollControls } from '@react-three/drei';
import * as THREE from 'three';

// ─── Neural Core (The glowing brain-like structure) ─────────────
function NeuralCore() {
  const meshRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Gentle rotation
    meshRef.current.rotation.y = t * 0.1;
    meshRef.current.rotation.z = t * 0.05;
    
    // Mouse interaction for the core
    const { pointer } = state;
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, pointer.y * 0.4, 0.05);
    meshRef.current.rotation.y += THREE.MathUtils.lerp(0, pointer.x * 0.4, 0.05);

    // Gently pulse scale
    const scale = 1 + Math.sin(t * 2) * 0.02;
    meshRef.current.scale.set(scale, scale, scale);
  });

  return (
    <group ref={meshRef}>
      {/* Outer Wireframe Shell */}
      <mesh>
        <icosahedronGeometry args={[2.5, 4]} />
        <meshBasicMaterial 
          color="#00f0ff" 
          wireframe 
          transparent 
          opacity={0.15} 
          blending={THREE.AdditiveBlending} 
        />
      </mesh>
      
      {/* Inner Glowing Core */}
      <mesh>
        <icosahedronGeometry args={[1.8, 3]} />
        <meshBasicMaterial 
          color="#a855f7" 
          wireframe 
          transparent 
          opacity={0.3} 
          blending={THREE.AdditiveBlending} 
        />
      </mesh>

      {/* Deep inner solid core to obscure background lines */}
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color="#04040a" />
      </mesh>
    </group>
  );
}

// ─── Data Nodes (Plexus effect approximations) ─────────────
function DataNodes({ count = 100 }) {
  const linesRef = useRef();
  
  // Generate random points in a sphere
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();
    const palettes = ['#00f0ff', '#00ff88', '#a855f7'];

    for (let i = 0; i < count; i++) {
      // Random spherical distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 3 + Math.random() * 4; // Orbiting between radius 3 and 7

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      color.set(palettes[Math.floor(Math.random() * palettes.length)]);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return { positions, colors };
  }, [count]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    linesRef.current.rotation.y = t * -0.05;
    linesRef.current.rotation.x = Math.sin(t * 0.1) * 0.2;
  });

  return (
    <points ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={positions.length / 3} 
          array={positions} 
          itemSize={3} 
        />
        <bufferAttribute 
          attach="attributes-color" 
          count={colors.length / 3} 
          array={colors} 
          itemSize={3} 
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.08} 
        vertexColors 
        transparent 
        opacity={0.8} 
        sizeAttenuation 
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── Mouse Parallax Rig ─────────────
function CameraRig() {
  const { camera, pointer } = useThree();
  
  useFrame(() => {
    // Parallax effect based on pointer
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 1.5, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * 1.5, 0.05);
    camera.lookAt(0, 0, 0);
  });
  
  return null;
}

// ─── Main Component ─────────────
export default function ThreeCanvas() {
  // Mobile degradation check: fallback to heavily reduced quality if mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh', 
        zIndex: 0,
        pointerEvents: 'none',
        background: '#04040a' // Base color fallback
      }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={isMobile ? 1 : [1, 2]} // Graceful degradation for mobile pixel ratio
        gl={{ antialias: !isMobile, alpha: false, powerPreference: "high-performance" }}
      >
        <color attach="background" args={['#04040a']} />
        
        {/* Adds fog to fade elements into the distance */}
        <fog attach="fog" args={['#04040a', 5, 15]} />

        {/* Floating AI structures */}
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
          <NeuralCore />
          <DataNodes count={isMobile ? 50 : 200} />
        </Float>
        
        {/* Distant star field for depth */}
        <Stars 
          radius={12} 
          depth={20} 
          count={isMobile ? 500 : 2500} 
          factor={4} 
          saturation={1} 
          fade 
          speed={0.5} 
        />

        <CameraRig />
      </Canvas>
    </div>
  );
}
