import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from 'react-three-fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { GerstnerWaveResult } from '../models/GerstnerWave';

interface WaveMeshProps {
  waveData: GerstnerWaveResult | null;
}

const WaveMesh: React.FC<WaveMeshProps> = ({ waveData }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);

  useEffect(() => {
    if (!waveData || !waveData.points.length) return;

    // Создаем геометрию из полученных точек
    const geo = new THREE.BufferGeometry();
    
    // Конвертируем массив точек [x, y, z][] в плоский массив координат
    const vertices = new Float32Array(waveData.points.flatMap(p => p));
    geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    
    // Создаем индексы для треугольников
    const indices: number[] = [];
    const size = Math.sqrt(waveData.points.length);
    
    for (let i = 0; i < size - 1; i++) {
      for (let j = 0; j < size - 1; j++) {
        const a = i * size + j;
        const b = i * size + j + 1;
        const c = (i + 1) * size + j;
        const d = (i + 1) * size + j + 1;
        
        // Добавляем два треугольника для каждой ячейки сетки
        indices.push(a, b, d);
        indices.push(a, d, c);
      }
    }
    
    geo.setIndex(indices);
    geo.computeVertexNormals();
    setGeometry(geo);
  }, [waveData]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.001;
    }
  });

  if (!geometry) return null;

  return (
    <mesh ref={meshRef}>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial 
        color="#3b82f6" 
        wireframe={false} 
        side={THREE.DoubleSide}
        roughness={0.3}
        metalness={1.0}
      />
    </mesh>
  );
};

interface GerstnerWaveVisualizationProps {
  waveData: GerstnerWaveResult | null;
}

const GerstnerWaveVisualization: React.FC<GerstnerWaveVisualizationProps> = ({ waveData }) => {
  return (
    <div className="w-full h-[500px] bg-slate-500 rounded-lg shadow-lg">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <WaveMesh waveData={waveData} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        <gridHelper args={[10, 10, "#666666", "#444444"]} />
        <axesHelper args={[5]} />
      </Canvas>
    </div>
  );
};

export default GerstnerWaveVisualization; 