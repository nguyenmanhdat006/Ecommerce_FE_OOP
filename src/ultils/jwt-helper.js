import { jwtDecode } from "jwt-decode";

const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";

const getToken = () => {
  return localStorage.getItem(ACCESS_KEY);
};

const getRefresh = () => {
  return localStorage.getItem(REFRESH_KEY);
};

const saveTokens = (access, refresh) => {
  localStorage.setItem(ACCESS_KEY, access);
  if (refresh) {
    localStorage.setItem(REFRESH_KEY, refresh);
  }
};

const clearTokens = () => {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
};

const isTokenValid = () => {
  const token = getToken();

  if (!token) return false;

  try {
    const { exp } = jwtDecode(token);
    if (!exp) return false;

    return exp * 1000 > Date.now(); // exp in ms
  } catch {
    return false;
  }
};

export {
  getToken,
  getRefresh,
  saveTokens,
  clearTokens,
  isTokenValid,
};
