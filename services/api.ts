// import axios from 'axios';
// import { GerstnerWaveParams, GerstnerWaveResult } from '../models/GerstnerWave';

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export const calculateGerstnerWave = async (params: GerstnerWaveParams): Promise<GerstnerWaveResult> => {
//   try {
//     const response = await api.post<GerstnerWaveResult>('/gerstner', params);
//     return response.data;
//   } catch (error) {
//     console.error('Ошибка при вызове API:', error);
//     throw error;
//   }
// };

// export const checkHealth = async (): Promise<string> => {
//   try {
//     const response = await api.get<string>('/health');
//     return response.data;
//   } catch (error) {
//     console.error('Ошибка при проверке состояния сервера:', error);
//     throw error;
//   }
// }; 