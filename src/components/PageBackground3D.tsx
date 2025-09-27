import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface Props {
  pattern: 'neurons' | 'circles' | 'waves' | 'grid';
  color?: string;
}

function Neurons() {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!groupRef.current) return;
    
    const animate = () => {
      if (groupRef.current) {
        groupRef.current.rotation.y += 0.001;
      }
      requestAnimationFrame(animate);
    };
    
    animate();
  }, []);

  return (
    <group ref={groupRef}>
      <Sphere args={[2, 32, 32]}>
        <meshPhongMaterial
          color="#4fd1c5"
          transparent={true}
          opacity={0.15}
          wireframe
        />
      </Sphere>
      {Array.from({ length: 150 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.random() * 4 - 2,
            Math.random() * 4 - 2,
            Math.random() * 4 - 2,
          ]}
        >
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshPhongMaterial color="#4fd1c5" />
        </mesh>
      ))}
    </group>
  );
}

function Circles() {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!groupRef.current) return;
    
    const animate = () => {
      if (groupRef.current) {
        groupRef.current.rotation.z += 0.001;
      }
      requestAnimationFrame(animate);
    };
    
    animate();
  }, []);

  return (
    <group ref={groupRef}>
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={i} position={[0, 0, -i * 0.5]}>
          <ringGeometry args={[1 + i * 0.2, 1.1 + i * 0.2, 64]} />
          <meshPhongMaterial color="#4fd1c5" transparent opacity={0.1} />
        </mesh>
      ))}
    </group>
  );
}

function Waves() {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!groupRef.current) return;
    
    const animate = () => {
      if (groupRef.current) {
        groupRef.current.rotation.x += 0.001;
      }
      requestAnimationFrame(animate);
    };
    
    animate();
  }, []);

  return (
    <group ref={groupRef}>
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={i} position={[0, -1 + i * 0.1, 0]}>
          <torusGeometry args={[1.5, 0.02, 16, 100]} />
          <meshPhongMaterial color="#4fd1c5" transparent opacity={0.1} />
        </mesh>
      ))}
    </group>
  );
}

function Grid() {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!groupRef.current) return;
    
    const animate = () => {
      if (groupRef.current) {
        groupRef.current.rotation.y += 0.001;
      }
      requestAnimationFrame(animate);
    };
    
    animate();
  }, []);

  return (
    <group ref={groupRef}>
      {Array.from({ length: 10 }).map((_, i) => 
        Array.from({ length: 10 }).map((_, j) => (
          <mesh key={`${i}-${j}`} position={[i - 4.5, j - 4.5, 0]}>
            <boxGeometry args={[0.05, 0.05, 0.05]} />
            <meshPhongMaterial color="#4fd1c5" />
          </mesh>
        ))
      )}
    </group>
  );
}

export default function PageBackground3D({ pattern, color = '#4fd1c5' }: Props) {
  const patterns = {
    neurons: Neurons,
    circles: Circles,
    waves: Waves,
    grid: Grid
  };

  const Pattern = patterns[pattern];

  return (
    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-teal-600 to-teal-800">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Pattern />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}