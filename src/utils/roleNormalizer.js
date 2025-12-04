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
    // keep original raw role for detail views
    normalized.rawRole = normalized.role;
    normalized.role = normalizeRole(normalized.role);
  }
  
  // If backend doesn't provide top-level `role`, try to infer from authorityList,
  // `roles` array or `authorities` array commonly used by different backends.
  if (!normalized.role) {
    // prefer already-normalized authorityList
    const list = Array.isArray(normalized.authorityList)
      ? normalized.authorityList
      : Array.isArray(normalized.authorities)
      ? normalized.authorities
      : Array.isArray(normalized.roles)
      ? normalized.roles.map((r) => ({ roleCode: r }))
      : null;

    if (Array.isArray(list) && list.length > 0) {
      // try to extract a role code from first authority object or string
      const first = list[0];
      let candidate = null;
      if (typeof first === 'string') candidate = first;
      else if (first?.roleCode) candidate = first.roleCode;
      else if (first?.authority) candidate = first.authority;
      else if (first?.name) candidate = first.name;

      if (candidate) {
  normalized.rawRole = candidate;
  normalized.role = normalizeRole(candidate);
      }
    }
  }
  
  // Normalize authorityList
  if (Array.isArray(normalized.authorityList)) {
    normalized.authorityList = normalized.authorityList.map(normalizeAuthority);
  }
  
  return normalized;
};

