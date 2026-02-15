export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
export const USE_MOCK = String(import.meta.env.VITE_USE_MOCK || 'true').toLowerCase() === 'true';
