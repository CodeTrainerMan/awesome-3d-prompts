'use client';

import { Component, Suspense, useEffect, type RefObject, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { Bounds, ContactShadows, OrbitControls, useAnimations, useGLTF } from '@react-three/drei';
import type { OrbitControls as OrbitControlsRef } from 'three-stdlib';
import * as THREE from 'three';

type SceneProps = {
  url: string;
  autoRotate: boolean;
  controlsRef: RefObject<OrbitControlsRef | null>;
};

function GltfModel({ url }: { url: string }) {
  const { scene, animations } = useGLTF(url);
  const { actions, names } = useAnimations(animations, scene);

  useEffect(() => {
    scene.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [scene]);

  useEffect(() => {
    if (!names.length) return;
    const clip = actions[names[0]];
    clip?.reset().fadeIn(0.4).play();
    return () => {
      clip?.fadeOut(0.2).stop();
    };
  }, [actions, names]);

  return <primitive object={scene} />;
}

class SceneErrorBoundary extends Component<{ children: ReactNode; onError?: () => void }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError?.();
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="grid h-full place-items-center px-6 text-center">
          <div>
            <p className="text-sm font-medium text-neutral-700">模型加载失败</p>
            <p className="mt-1 text-xs text-neutral-500">该文件可能尚未上传或格式不受支持</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function ModelScene({ url, autoRotate, controlsRef }: SceneProps) {
  return (
    <SceneErrorBoundary>
      <Canvas
        shadows
        dpr={[1, 1.8]}
        camera={{ fov: 40, position: [0, 0.6, 3.2], near: 0.01, far: 500 }}
        frameloop={autoRotate ? 'always' : 'demand'}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
        }}
        className="!h-full !w-full"
      >
        <hemisphereLight args={['#ffffff', '#b8c0cc', 1.1]} />
        <ambientLight intensity={0.55} />
        <directionalLight
          position={[3.5, 5, 4]}
          intensity={2.4}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0005}
        />
        <directionalLight position={[-4, 2.5, -3]} intensity={0.8} />

        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.15} key={url}>
            <GltfModel url={url} />
          </Bounds>
        </Suspense>

        <ContactShadows position={[0, -1, 0]} opacity={0.32} scale={12} blur={2.6} far={4} resolution={512} />

        <OrbitControls
          ref={controlsRef}
          makeDefault
          autoRotate={autoRotate}
          autoRotateSpeed={1.2}
          enableDamping={false}
          enablePan
          minDistance={0.4}
          maxDistance={60}
        />
      </Canvas>
    </SceneErrorBoundary>
  );
}
