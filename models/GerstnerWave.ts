export interface GerstnerWaveParams {
  amplitude: number;
  wavelength: number;
  direction: [number, number];
  steepness: number;
  numPoints: number;
}

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface GerstnerWaveResult {
  points: [number, number, number][];
}

export const defaultWaveParams: GerstnerWaveParams = {
  amplitude: 0.5,
  wavelength: 4.0,
  direction: [1.0, 0.0],
  steepness: 0.5,
  numPoints: 900
}; 