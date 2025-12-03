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
    // Prefer explicit websocket env var (supports wss://)
    const wsEnv = import.meta.env.VITE_WEBSOCKET_URL;
    if (wsEnv) {
      const base = wsEnv.replace(/\/$/, "");
      // ensure scheme is ws/wss
      const wsBase = base.replace(/^http/, 'ws');
      return `${wsBase}/ws/dashboard`;
    }

    // Fallback to API_BASE_URL (derive ws scheme) or localhost
    const base = API_BASE_URL || 'http://localhost:8080';
    const url = new URL(base);
    const protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${url.host}/ws/dashboard`;
  }
};

export default dashboardAPI;
