import React, { useState } from 'react';
import { GerstnerWaveParams, defaultWaveParams } from '../models/GerstnerWave';

interface GerstnerWaveFormProps {
  onSubmit: (params: GerstnerWaveParams) => void;
  isLoading: boolean;
}

const GerstnerWaveForm: React.FC<GerstnerWaveFormProps> = ({ onSubmit, isLoading }) => {
  const [params, setParams] = useState<GerstnerWaveParams>({...defaultWaveParams});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(params);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'directionX' || name === 'directionY') {
      const dirIndex = name === 'directionX' ? 0 : 1;
      const newDirection = [...params.direction];
      newDirection[dirIndex] = parseFloat(value) || 0;
      
      setParams(prev => ({
        ...prev,
        direction: newDirection as [number, number]
      }));
    } else {
      setParams(prev => ({
        ...prev,
        [name]: name === 'numPoints' ? parseInt(value, 10) : parseFloat(value)
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amplitude">
            Амплитуда
          </label>
          <input 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="amplitude"
            name="amplitude"
            type="number"
            step="0.1"
            value={params.amplitude}
            onChange={handleChange}
            min="0.1"
            max="2.0"
          />
          <p className="text-gray-600 text-xs italic">От 0.1 до 2.0</p>
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="wavelength">
            Длина волны
          </label>
          <input 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="wavelength"
            name="wavelength"
            type="number"
            step="0.5"
            value={params.wavelength}
            onChange={handleChange}
            min="1.0"
            max="10.0"
          />
          <p className="text-gray-600 text-xs italic">От 1.0 до 10.0</p>
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="directionX">
            Направление X
          </label>
          <input 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="directionX"
            name="directionX"
            type="number"
            step="0.1"
            value={params.direction[0]}
            onChange={handleChange}
            min="-1.0"
            max="1.0"
          />
          <p className="text-gray-600 text-xs italic">От -1.0 до 1.0</p>
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="directionY">
            Направление Y
          </label>
          <input 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="directionY"
            name="directionY"
            type="number"
            step="0.1"
            value={params.direction[1]}
            onChange={handleChange}
            min="-1.0"
            max="1.0"
          />
          <p className="text-gray-600 text-xs italic">От -1.0 до 1.0</p>
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="steepness">
            Крутизна
          </label>
          <input 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="steepness"
            name="steepness"
            type="number"
            step="0.05"
            value={params.steepness}
            onChange={handleChange}
            min="0.0"
            max="1.0"
          />
          <p className="text-gray-600 text-xs italic">От 0.0 до 1.0</p>
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="numPoints">
            Количество точек
          </label>
          <input 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="numPoints"
            name="numPoints"
            type="number"
            step="100"
            value={params.numPoints}
            onChange={handleChange}
            min="100"
            max="2500"
          />
          <p className="text-gray-600 text-xs italic">От 100 до 2500</p>
        </div>
      </div>
      
      <div className="flex items-center justify-center">
        <button
          className={`bg-ocean-blue hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Вычисление...' : 'Рассчитать волну'}
        </button>
      </div>
    </form>
  );
};

export default GerstnerWaveForm; 