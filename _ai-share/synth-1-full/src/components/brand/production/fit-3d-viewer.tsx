'use client';

import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';

interface Fit3DViewerProps {
  modelUrl: string;
  tensionMapUrl?: string;
  className?: string;
}

function Model({ modelUrl, tensionMapUrl }: { modelUrl: string; tensionMapUrl?: string }) {
  const { scene } = useGLTF(modelUrl, true); // Draco compression enabled by default in useGLTF when passing true or string for draco path, wait, useGLTF(url, useDraco)

  const tensionTexture = useTexture(
    tensionMapUrl ||
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
  ); // 1x1 transparent if not provided

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const material = child.material as THREE.MeshStandardMaterial;
          if (tensionMapUrl) {
            material.emissiveMap = tensionTexture;
            material.emissive = new THREE.Color(0xffffff);
            material.emissiveIntensity = 1;
            material.needsUpdate = true;
          } else {
            material.emissiveMap = null;
            material.emissive = new THREE.Color(0x000000);
            material.needsUpdate = true;
          }
        }
      });
    }
  }, [scene, tensionTexture, tensionMapUrl]);

  return <primitive object={scene} />;
}

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="border-accent-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"></div>
        <p className="text-text-secondary mt-2 text-xs font-medium">Загрузка 3D...</p>
      </div>
    </Html>
  );
}

export function Fit3DViewer({
  modelUrl,
  tensionMapUrl,
  className = 'w-full h-full min-h-[400px]',
}: Fit3DViewerProps) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 1, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />
        <Suspense fallback={<Loader />}>
          <Model modelUrl={modelUrl} tensionMapUrl={tensionMapUrl} />
        </Suspense>
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
}

useGLTF.preload('/models/placeholder.glb');
