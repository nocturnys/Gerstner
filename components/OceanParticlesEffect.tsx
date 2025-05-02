import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei/core/OrbitControls';
import * as THREE from 'three';

// Компонент, создающий волновой эффект
const WaveParticlesEffect = ({ count = 100, waveStrength = 1.5 }) => {
  const particles = useRef<THREE.Points>(null);
  const orbits = useRef<THREE.LineSegments>(null);
  
  // Структура данных для частиц и их орбит
  const data = useMemo(() => {
    // Данные для частиц
    const particlePositions = new Float32Array(count * 3);
    const particleSizes = new Float32Array(count);
    const particleColors = new Float32Array(count * 3);
    
    // Данные для орбит
    const orbitVertices: number[] = [];
    const orbitColors: number[] = [];
    const orbitIndices: number[] = [];
    
    // Данные для анимации
    const centers = new Float32Array(count * 2); // Центры орбит (x, y)
    const radii = new Float32Array(count); // Радиусы орбит
    const speeds = new Float32Array(count); // Скорость движения
    const phases = new Float32Array(count); // Начальная фаза
    const layerInfo = new Float32Array(count); // Информация о слое частицы
    
    // Количество вертикальных слоев
    const layers = 20;
    
    // Распределение частиц по слоям (больше в верхней части)
    const particles_per_layer = [];
    let total_particles = 0;
    
    // Распределяем частицы по слоям - больше в верхних слоях
    for (let i = 0; i < layers; i++) {
      // Используем экспоненциальное распределение для концентрации частиц в верхних слоях
      const ratio = Math.pow(0.85, i);
      particles_per_layer[i] = Math.floor(ratio * count / 10);
      total_particles += particles_per_layer[i];
    }
    
    // Корректируем, чтобы общее число частиц соответствовало указанному
    const scaling_factor = count / total_particles;
    total_particles = 0;
    for (let i = 0; i < layers; i++) {
      particles_per_layer[i] = Math.floor(particles_per_layer[i] * scaling_factor);
      total_particles += particles_per_layer[i];
    }
    
    // Если остались неиспользованные частицы, добавляем их к верхнему слою
    particles_per_layer[0] += count - total_particles;
    
    let pointIndex = 0;
    
    // Ширина экрана в координатах Three.js
    const screenWidth = 30;
    
    // Для каждого слоя
    for (let layer = 0; layer < layers; layer++) {
      const y = 5 - layer * 0.6; // Распределяем слои по вертикали более плотно
      const layerPointCount = particles_per_layer[layer];
      
      // Размер окружности зависит от слоя - верхние слои имеют большие окружности
      // Это определяет "мощность" волны
      const baseRadius = 0.2 + (1 - layer / layers) * 2.2 * waveStrength;
      
      // Создаем частицы в текущем слое
      for (let i = 0; i < layerPointCount && pointIndex < count; i++) {
        // Равномерно распределяем частицы по ширине экрана
        const xPosition = -screenWidth / 2 + (i / layerPointCount) * screenWidth;
        
        // Добавляем небольшое случайное смещение для более естественного вида
        const cx = xPosition + (Math.random() * 0.3 - 0.15);
        const cy = y + (Math.random() * 0.2 - 0.1);
        
        centers[pointIndex * 2] = cx;
        centers[pointIndex * 2 + 1] = cy;
        
        // Размер окружности варьируется вокруг базового радиуса с небольшой случайностью
        const circleRadius = baseRadius * (0.85 + Math.random() * 0.3);
        radii[pointIndex] = circleRadius;
        
        // Скорость частиц - верхние слои имеют слегка разную скорость для создания волны
        const baseSpeed = 0.2 + (1 - layer / layers) * 0.15;
        speeds[pointIndex] = baseSpeed * (0.9 + Math.random() * 0.2);
        
        // Фаза начинается с разных значений, зависящих от X-координаты
        // Это создает эффект волны, движущейся слева направо
        phases[pointIndex] = (cx / screenWidth) * Math.PI * 8 + Math.random() * 0.2;
        
        // Запоминаем слой частицы для анимации
        layerInfo[pointIndex] = layer;
        
        // Начальное положение частицы на орбите
        const angle = phases[pointIndex];
        particlePositions[pointIndex * 3] = cx + Math.cos(angle) * circleRadius;
        particlePositions[pointIndex * 3 + 1] = cy + Math.sin(angle) * circleRadius;
        particlePositions[pointIndex * 3 + 2] = -3; // Фиксированная Z-координата для всех частиц
        
        // Размер частицы - варьируется от слоя
        const layerRatio = layer / layers;
        // Увеличиваем размер частиц, особенно в верхних слоях
        particleSizes[pointIndex] = 0.12 + layerRatio * 0.08;
        
        // Цвет частицы - верхние слои ярче
        // Увеличиваем яркость частиц для большей заметности
        const brightness = 10.85 + (1 - layerRatio) * 0.3;
        const r = 0.3 * brightness;
        const g = 0.7 * brightness;
        const b = 1.0 * brightness;
        
        particleColors[pointIndex * 3] = r;
        particleColors[pointIndex * 3 + 1] = g;
        particleColors[pointIndex * 3 + 2] = b;
        
        // Создаем орбиту (окружность) для этой частицы
        const segments = 32; // Меньше сегментов для оптимизации
        
        // Цвет орбиты зависит от слоя, но делаем менее насыщенным
        const orbitColor = new THREE.Color(r * 0.2, g * 0.2, b * 0.3);
        
        const orbitStartIndex = orbitVertices.length / 3;
        
        for (let s = 0; s <= segments; s++) {
          const segAngle = (s / segments) * Math.PI * 2;
          const ox = cx + Math.cos(segAngle) * circleRadius;
          const oy = cy + Math.sin(segAngle) * circleRadius;
          const oz = -3.05; // Немного позади частиц
          
          orbitVertices.push(ox, oy, oz);
          orbitColors.push(orbitColor.r, orbitColor.g, orbitColor.b);
          
          if (s < segments) {
            orbitIndices.push(orbitStartIndex + s, orbitStartIndex + s + 1);
          }
        }
        
        pointIndex++;
      }
    }
    
    return {
      count: pointIndex,
      particles: {
        positions: particlePositions, 
        sizes: particleSizes, 
        colors: particleColors
      },
      orbits: {
        vertices: orbitVertices,
        colors: orbitColors,
        indices: orbitIndices
      },
      animation: {
        centers,
        radii,
        speeds,
        phases,
        layerInfo
      }
    };
  }, [count, waveStrength]);
  
  // Инициализируем геометрию частиц
  useEffect(() => {
    if (particles.current) {
      const geometry = particles.current.geometry;
      
      geometry.setAttribute(
        'position', 
        new THREE.BufferAttribute(data.particles.positions, 3)
      );
      geometry.setAttribute(
        'size', 
        new THREE.BufferAttribute(data.particles.sizes, 1)
      );
      geometry.setAttribute(
        'color', 
        new THREE.BufferAttribute(data.particles.colors, 3)
      );
    }
  }, [data]);
  
  // Текстура частицы
  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const context = canvas.getContext('2d');
    
    if (context) {
      const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.3, 'rgba(200, 220, 255, 1.0)');
      gradient.addColorStop(1, 'rgba(120, 180, 255, 0)');
      
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(16, 16, 16, 0, Math.PI * 2);
      context.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);
  
  // Анимация движения частиц по окружностям, создающая волновой эффект
  useFrame(({ clock }) => {
    if (!particles.current) return;
    
    const time = clock.getElapsedTime();
    const positions = particles.current.geometry.attributes.position.array as Float32Array;
    
    // Скорость распространения волны
    const waveSpeed = 1.6;
    // Длина волны - определяет, сколько волн видно одновременно
    const wavelength = 12;
    // Ширина экрана (такая же как при генерации частиц)
    const screenWidth = 27;
    
    for (let i = 0; i < data.count; i++) {
      const i3 = i * 3;
      const i2 = i * 2;
      
      // Центр орбиты
      const cx = data.animation.centers[i2];
      const cy = data.animation.centers[i2 + 1];
      
      // Радиус и скорость
      const radius = data.animation.radii[i];
      const layer = data.animation.layerInfo[i];
      
      // Создаем волновое движение, где фаза зависит от горизонтальной позиции
      // Это создает эффект волны, движущейся горизонтально
      const wavePhase = (cx + screenWidth/2) / wavelength;
      
      // Угол движения частицы по окружности зависит от:
      // 1. Времени - обеспечивает движение
      // 2. Горизонтальной позиции - создает волновой фронт
      // 3. Вертикальной позиции (слоя) - для небольшого смещения по вертикали
      const angle = time * waveSpeed + wavePhase * Math.PI * 2 - layer * 0.05;
      
      // Позиция частицы на окружности
      positions[i3] = cx + Math.cos(angle) * radius;
      positions[i3 + 1] = cy + Math.sin(angle) * radius;
    }
    
    particles.current.geometry.attributes.position.needsUpdate = true;
  });
  
  // Создаем орбиты (окружности)
  const orbitGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    
    geometry.setIndex(data.orbits.indices);
    geometry.setAttribute(
      'position', 
      new THREE.Float32BufferAttribute(data.orbits.vertices, 3)
    );
    geometry.setAttribute(
      'color', 
      new THREE.Float32BufferAttribute(data.orbits.colors, 3)
    );
    
    return geometry;
  }, [data]);
  
  // Пульсация яркости орбит для создания эффекта волны
  useFrame(({ clock }) => {
    if (!orbits.current) return;
    
    const time = clock.getElapsedTime();
    const material = orbits.current.material as THREE.LineBasicMaterial;
    
    // Более выраженная пульсация для орбит, но с меньшей прозрачностью
    material.opacity = 0.06 + Math.sin(time * 0.3) * 0.02;
  });
  
  return (
    <group>
      {/* Орбиты */}
      <lineSegments ref={orbits}>
        <primitive object={orbitGeometry} attach="geometry" />
        <lineBasicMaterial 
          attach="material" 
          vertexColors 
          transparent
          opacity={0.06}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
      
      {/* Частицы */}
      <points ref={particles}>
        <bufferGeometry />
        <pointsMaterial 
          size={0.2} 
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          map={particleTexture}
        />
      </points>
    </group>
  );
};

// Компонент ползунка для регулировки мощности волны
interface WaveStrengthSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const WaveStrengthSlider: React.FC<WaveStrengthSliderProps> = ({ value, onChange }) => {
  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center bg-black bg-opacity-30 p-4 rounded-lg">
      <label htmlFor="waveStrength" className="text-white text-sm mb-2">
        
      </label>
      <input
        id="waveStrength"
        type="range"
        min="0.1"
        max="0.5"
        step="0.05"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-64 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
      />
      <div className="text-white text-xs mt-1">
        {value.toFixed(2)}
      </div>
    </div>
  );
};

// Основной компонент визуализации
const OceanParticlesEffect: React.FC = () => {
  // Используем состояние для контроля силы волны
  const [waveStrength, setWaveStrength] = useState(0.3);

  return (
    <div className="w-full h-screen bg-gradient-to-b from-slate-900 to-cyan-900 relative">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <WaveParticlesEffect count={1200} waveStrength={waveStrength} />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false}/>
      </Canvas>
      <WaveStrengthSlider value={waveStrength} onChange={setWaveStrength} />
    </div>
  );
};

export default OceanParticlesEffect; 