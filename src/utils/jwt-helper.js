import { jwtDecode } from "jwt-decode";
import { normalizeUser } from "./roleNormalizer";

const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";

const getToken = () => {
  return localStorage.getItem(ACCESS_KEY);
};

const getRefresh = () => {
  return localStorage.getItem(REFRESH_KEY);
};

const saveToken = (access, refresh) => {
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
const saveUser = (user) => {
  // Normalize user data before saving
  const normalizedUser = normalizeUser(user);
  localStorage.setItem("user", JSON.stringify(normalizedUser));
};

const getUser = () => {
  const user = localStorage.getItem("user");

  if (!user || user === "undefined" || user === "null") return null;

  try {
    const parsedUser = JSON.parse(user);
    // Normalize user data when retrieving (in case of old data format)
    return normalizeUser(parsedUser);
  } catch (err) {
    console.error("Invalid user JSON:", err);
    return null;
  }
};
const clearUser = () => {
  localStorage.removeItem("user");
};

export {
  getToken,
  getRefresh,
  saveToken,
  clearTokens,
  isTokenValid,
  saveUser,
  getUser,
  clearUser,
};
