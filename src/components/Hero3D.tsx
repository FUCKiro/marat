import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function Model() {
  const gltf = useGLTF('https://res.cloudinary.com/dlc5g3cjb/image/upload/v1736356820/0823_dodo_01_cd2gbb.glb');
  const modelRef = useRef<THREE.Group>(null);

  return (
    <primitive 
      object={gltf.scene} 
      ref={modelRef}
      scale={0.3}
      position={[0, 0, 0]}
    />
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-teal-600 to-teal-800">
      <Canvas camera={{ position: [0, 1, 2], fov: 35 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Model />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={2}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
}