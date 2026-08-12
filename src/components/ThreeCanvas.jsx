import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';
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

// Helper to generate node positions outside component render
function generateDataNodes(count) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const color = new THREE.Color();
  const palettes = ['#00f0ff', '#00ff88', '#a855f7'];

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const radius = 3 + Math.random() * 4;

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);

    color.set(palettes[Math.floor(Math.random() * palettes.length)]);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  return { positions, colors };
}

// ─── Data Nodes (Plexus effect approximations) ─────────────
function DataNodes({ count = 100 }) {
  const linesRef = useRef();
  
  const { positions, colors } = useMemo(() => generateDataNodes(count), [count]);

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

// ─── Cursor Trail (Energy trail following the mouse) ─────────────
function CursorTrail() {
  const pointsRef = useRef();
  const { viewport, pointer } = useThree();
  const count = 30; // Number of trail segments
  
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    return [pos, col];
  }, [count]);

  const history = useRef(new Array(count).fill({ x: 0, y: 0 }));

  useFrame(() => {
    // Convert normalized pointer [-1, 1] to world coordinates
    const targetX = (pointer.x * viewport.width) / 2;
    const targetY = (pointer.y * viewport.height) / 2;
    
    // Smoothly follow the mouse
    const head = history.current[0];
    const nx = head.x + (targetX - head.x) * 0.15;
    const ny = head.y + (targetY - head.y) * 0.15;

    // Shift history
    history.current.pop();
    history.current.unshift({ x: nx, y: ny });

    const colorObj = new THREE.Color('#00f0ff');

    for (let i = 0; i < count; i++) {
      const p = history.current[i];
      /* eslint-disable react-hooks/immutability */
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = 0;

      // Fade out trail
      const alpha = 1 - i / count;
      colors[i * 3] = colorObj.r * alpha;
      colors[i * 3 + 1] = colorObj.g * alpha;
      colors[i * 3 + 2] = colorObj.b * alpha;
      /* eslint-enable react-hooks/immutability */
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.geometry.attributes.color.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={count} 
          array={positions} 
          itemSize={3} 
        />
        <bufferAttribute 
          attach="attributes-color" 
          count={count} 
          array={colors} 
          itemSize={3} 
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.15} 
        vertexColors 
        transparent 
        opacity={0.6} 
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
    /* eslint-disable react-hooks/immutability */
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 1.5, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * 1.5, 0.05);
    /* eslint-enable react-hooks/immutability */
    camera.lookAt(0, 0, 0);
  });
  
  return null;
}

// ─── Main Component ─────────────
export default function ThreeCanvas() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        background: '#04040a', // Base color fallback
        opacity: 0,
        animation: 'canvasFadeIn 2s ease forwards'
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
          <DataNodes count={isMobile ? 40 : 200} />
          <CursorTrail />
        </Float>
        
        {/* Distant star field for depth */}
        <Stars 
          radius={12} 
          depth={20} 
          count={isMobile ? 300 : 2500} 
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
