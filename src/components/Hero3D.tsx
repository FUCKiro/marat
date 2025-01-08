import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function NeuralNetwork() {
  const groupRef = useRef<THREE.Group>(null);

  // Create fixed nodes positions
  const nodes = Array.from({ length: 30 }, (_, i) => {
    const theta = (i / 30) * Math.PI * 2;
    const y = Math.sin(i * 0.5) * 1.5;
    const radius = 2 + Math.cos(i * 0.5) * 0.5;
    return {
      position: [
        Math.cos(theta) * radius,
        y,
        Math.sin(theta) * radius
      ] as [number, number, number],
      connections: Array.from({ length: 3 }, () => 
        Math.floor(Math.random() * 30)
      )
    };
  });

  return (
    <group ref={groupRef}>
      {/* Nodes */}
      {nodes.map((node, i) => (
        <mesh key={`node-${i}`} position={node.position}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshPhongMaterial color="#4fd1c5" />
        </mesh>
      ))}

      {/* Connections */}
      {nodes.map((node, i) => 
        node.connections.map((targetIndex, j) => (
          <line key={`connection-${i}-${j}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([
                  ...node.position,
                  ...nodes[targetIndex].position
                ])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#4fd1c5" opacity={0.2} transparent />
          </line>
        ))
      )}
    </group>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-teal-600 to-teal-800">
      <Canvas camera={{ position: [0, 0, 8] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <NeuralNetwork />
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