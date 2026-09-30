import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import { useRef, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import * as THREE from 'three';

interface Props {
  pattern: 'neurons' | 'circles' | 'waves' | 'grid';
  color?: string;
}

type Axis = 'x' | 'y' | 'z';

function useSpin(axis: Axis) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation[axis] += 0.001;
    }
  });
  return groupRef;
}

function Neurons({ count }: { count: number }) {
  const groupRef = useSpin('y');
  const instancedRef = useRef<THREE.InstancedMesh>(null);

  const positions = useMemo(
    () =>
      Array.from({ length: count }, () => [
        Math.random() * 4 - 2,
        Math.random() * 4 - 2,
        Math.random() * 4 - 2,
      ] as const),
    [count]
  );

  useLayoutEffect(() => {
    const mesh = instancedRef.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    positions.forEach(([x, y, z], i) => {
      dummy.position.set(x, y, z);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [positions]);

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
      <instancedMesh ref={instancedRef} args={[undefined, undefined, count]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshPhongMaterial color="#4fd1c5" />
      </instancedMesh>
    </group>
  );
}

function Circles() {
  const groupRef = useSpin('z');

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
  const groupRef = useSpin('x');

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
  const groupRef = useSpin('y');

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

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

function useIsActive(ref: React.RefObject<HTMLElement>) {
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(() => document.visibilityState === 'visible');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  useEffect(() => {
    const onChange = () => setTabVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onChange);
    return () => document.removeEventListener('visibilitychange', onChange);
  }, []);

  return inView && tabVisible;
}

export default function PageBackground3D({ pattern }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isActive = useIsActive(containerRef);

  const frameloop = reducedMotion ? 'demand' : isActive ? 'always' : 'never';

  return (
    <div ref={containerRef} className="absolute inset-0 -z-10 bg-gradient-to-br from-teal-600 to-teal-800">
      <Canvas
        camera={{ position: [0, 0, 5] }}
        dpr={[1, 1.5]}
        gl={{ antialias: false }}
        frameloop={frameloop}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        {pattern === 'neurons' && <Neurons count={isMobile ? 60 : 150} />}
        {pattern === 'circles' && <Circles />}
        {pattern === 'waves' && <Waves />}
        {pattern === 'grid' && <Grid />}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={!reducedMotion}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
