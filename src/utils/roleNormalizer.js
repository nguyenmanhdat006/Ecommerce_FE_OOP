/**
 * Normalizes role from backend format (ROLE_ADMIN, ROLE_USER) to frontend format (ADMIN, USER)
 * @param {string} role - Role string from backend (e.g., "ROLE_ADMIN", "ROLE_USER")
 * @returns {string} - Normalized role (e.g., "ADMIN", "USER")
 */
export const normalizeRole = (role) => {
  if (!role || typeof role !== "string") return role;
  
  // Remove "ROLE_" prefix if present
  if (role.startsWith("ROLE_")) {
    return role.replace("ROLE_", "");
  }
  
  return role;
};

/**
 * Normalizes authority object from backend format
 * @param {Object} authority - Authority object with roleCode and authority fields
 * @returns {Object} - Normalized authority object
 */
export const normalizeAuthority = (authority) => {
  if (!authority || typeof authority !== "object") return authority;
  
  return {
    ...authority,
    roleCode: normalizeRole(authority.roleCode),
    authority: normalizeRole(authority.authority),
  };
};

/**
 * Normalizes user object from backend format
 * Normalizes role and authorityList fields
 * @param {Object} user - User object from backend
 * @returns {Object} - Normalized user object
 */
export const normalizeUser = (user) => {
  if (!user || typeof user !== "object") return user;
  
  const normalized = { ...user };
  
  // Normalize role
  if (normalized.role) {
    normalized.role = normalizeRole(normalized.role);
  }
  
  // Normalize authorityList
  if (Array.isArray(normalized.authorityList)) {
    normalized.authorityList = normalized.authorityList.map(normalizeAuthority);
  }
  
  return normalized;
};

