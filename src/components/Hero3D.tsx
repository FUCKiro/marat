import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

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

export default function Hero3D() {
  return (
    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-teal-600 to-teal-800">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Neurons />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}