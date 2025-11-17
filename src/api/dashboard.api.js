import axiosClient from './axiosClient';
import { API_BASE_URL } from './constant';

// Centralized dashboard API wrapper
export const dashboardAPI = {
  // GET /api/dashboard/kpi
  getKpi: () => axiosClient.get('/api/dashboard/kpi'),

  // POST /api/dashboard/refresh (no body)
  refresh: () => axiosClient.post('/api/dashboard/refresh'),

  // Provide WS URL (uses env fallback)
  wsUrl: () => {
    const base = API_BASE_URL || 'http://localhost:8080';
    // Ensure correct ws scheme
    const url = new URL(base);
    const protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${url.host}/ws/dashboard`;
  }
};

export default dashboardAPI;
