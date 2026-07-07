'use client';

import React, { Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera, useGLTF } from '@react-three/drei';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { useSettings } from '@/context/SettingsContext';
import { useTranslations } from 'next-intl';
import { trackEvent } from '@/lib/gtag';

interface UnitModelViewerProps {
  modelSrc?: string;
  imageSrc?: string;
  fallbackImageSrc?: string;
  unitName: string;
}

const Model = ({ src }: { src: string }) => {
  const { scene } = useGLTF(src);
  return <primitive object={scene} />;
};

const BoxPlaceholder = () => {
  const meshRef = React.useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#3b82f6" wireframe />
    </mesh>
  );
};

export const UnitModelViewer = ({ modelSrc, imageSrc, fallbackImageSrc, unitName }: UnitModelViewerProps) => {
  const { disable3D, setDisable3D } = useSettings();
  const [src, setSrc] = React.useState<string | undefined>(imageSrc || fallbackImageSrc);
  const t = useTranslations('ui');

  React.useEffect(() => {
    setSrc(imageSrc || fallbackImageSrc);
  }, [imageSrc, fallbackImageSrc]);

  return (
    <div className="relative w-full h-[300px] md:h-[500px] bg-slate-900/50 rounded-2xl overflow-hidden border border-white/5 shadow-2xl flex items-center justify-center">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-grid-white" />
      
      {/* Holographic scanner laser line overlay */}
      <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30 shadow-[0_0_10px_#3b82f6] animate-scan z-10 pointer-events-none" />
 
      {disable3D ? (
        /* 2D Hologram Viewer */
        <div className="relative w-full h-full flex items-center justify-center p-8 z-0 select-none">
          {/* Circular scanner overlay backdrop */}
          <div className="absolute w-[200px] h-[200px] md:w-[350px] md:h-[350px] rounded-full border border-blue-500/10 bg-blue-500/[0.01] animate-ping opacity-30 pointer-events-none" style={{ animationDuration: '6s' }} />
          <div className="absolute w-[150px] h-[150px] md:w-[280px] md:h-[280px] rounded-full border border-dashed border-blue-500/15 animate-spin opacity-45 pointer-events-none" style={{ animationDuration: '25s' }} />
          
          {src ? (
            <motion.img
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              src={src}
              alt={unitName}
              className="max-w-[75%] max-h-[75%] object-contain filter drop-shadow-[0_0_30px_rgba(59,130,246,0.3)] select-none pointer-events-none z-10"
              onError={() => {
                // If fallback failed, try the main imageSrc
                if (src === fallbackImageSrc && imageSrc && fallbackImageSrc !== imageSrc) {
                  setSrc(imageSrc);
                } else if (src === imageSrc && fallbackImageSrc && fallbackImageSrc !== imageSrc) {
                  setSrc(fallbackImageSrc);
                }
              }}
            />
          ) : (
            <div className="text-gray-500 font-bold uppercase tracking-wider text-xs z-10">{t('noReconImage')}</div>
          )}
        </div>
      ) : (
        /* 3D Scene */
        <Suspense fallback={
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        }>
          <Canvas shadows={{ type: THREE.PCFShadowMap }} gl={{ antialias: true, preserveDrawingBuffer: true }}>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
            <Stage environment="city" intensity={0.5} adjustCamera={1.2}>
               {modelSrc ? (
                 <Model src={modelSrc} />
               ) : (
                 <BoxPlaceholder />
               )}
            </Stage>
            <OrbitControls 
              enablePan={false} 
              enableZoom={true} 
              minPolarAngle={Math.PI / 4} 
              maxPolarAngle={Math.PI / 1.5} 
            />
          </Canvas>
        </Suspense>
      )}

      {/* HUD Overlays (Shared between 2D and 3D) */}
      <div className="absolute top-6 left-6 pointer-events-none z-20">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">{t('visualRecon')}</span>
          <span className="text-xl font-black text-white italic tracking-tighter uppercase">{unitName}</span>
        </div>
      </div>

      {/* Interactive 2D/3D Toggle Button */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={() => {
            const next = !disable3D;
            setDisable3D(next);
            trackEvent('toggle_3d_mode', 'preferences', next ? 'disabled' : 'enabled', undefined, {
              source: 'model_viewer',
              unit: unitName,
            });
          }}
          className="px-2.5 py-1.5 rounded-lg border border-blue-500/30 bg-slate-900/80 hover:bg-slate-800 text-[10px] font-bold text-blue-400 hover:text-white uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1.5 select-none"
        >
          {disable3D ? t('toggle3d') : t('toggle2d')}
        </button>
      </div>

      <div className="absolute bottom-6 right-6 pointer-events-none z-20">
        <div className="text-right">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
            {disable3D ? t('status2dFallback') : t('statusActive')}
          </span>
          <div className="flex gap-1 mt-1 justify-end">
            <div className="w-1 h-1 bg-blue-500 animate-pulse" />
            <div className="w-1 h-1 bg-blue-500 animate-pulse delay-75" />
            <div className="w-1 h-1 bg-blue-500 animate-pulse delay-150" />
          </div>
        </div>
      </div>

      {/* Interactive Hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full border border-white/10 bg-black/40 backdrop-blur-sm text-[9px] text-gray-500 uppercase font-bold tracking-[0.2em] z-20">
        {disable3D ? t('holographicReconView') : t('interactive3dPreview')}
      </div>
    </div>
  );
};
