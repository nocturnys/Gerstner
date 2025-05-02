import React from 'react';
import Head from 'next/head';
import OceanParticlesEffect from '../components/OceanParticlesEffect';

export default function Waves() {
  return (
    <>
      <Head>
        <title>Gerstner Wave Visualization</title>
        <meta name="description" content="Визуализация волн Герстнера с эффектом частиц и круговыми волнами" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="fixed top-0 left-0 w-full z-10 bg-transparent">
        <div className="container mx-auto p-4 flex items-center">
          <div className="font-bold text-white text-center text-2xl">
            Gerstner Wave Visualization
          </div>
          <div></div>
        </div>
      </div>
      
      <OceanParticlesEffect />
    </>
  );
} 