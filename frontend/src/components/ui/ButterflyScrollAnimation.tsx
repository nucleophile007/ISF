'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

function ButterflyModel() {
  const ref = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/butterfly.glb');

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y = scrollY * 0.002;
      ref.current.position.y = -scrollY * 0.002;
      ref.current.position.x = Math.sin(scrollY * 0.002) * 1.5;
    }
  });

  return <primitive object={scene} ref={ref} scale={2.5} />;
}

export default function ButterflyScrollAnimation() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 1, 5], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} />
        <ButterflyModel />
      </Canvas>
    </div>
  );
}
