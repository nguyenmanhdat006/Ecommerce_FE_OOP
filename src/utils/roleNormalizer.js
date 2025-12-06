import { jwtDecode } from "jwt-decode";

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
  if (normalized.role && normalized.role !== null) {
    // keep original raw role for detail views
    normalized.rawRole = normalized.role;
    normalized.role = normalizeRole(normalized.role);
  }
  
  // If backend doesn't provide top-level `role` or role is null, try to infer from authorityList,
  // `roles` array or `authorities` array commonly used by different backends.
  if (!normalized.role || normalized.role === null) {
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
    
    // If still no role found, try to get from JWT token if available
    if (!normalized.role || normalized.role === null) {
      try {
        const token = localStorage.getItem("access_token");
        if (token) {
          const decoded = jwtDecode(token);
          // Check common JWT claim names for role
          // Try multiple possible claim names
          const jwtRole = 
            decoded.role || 
            decoded.roles?.[0] ||
            decoded.authorities?.[0] || 
            decoded.authority?.[0] || 
            decoded.scope?.[0] ||
            decoded.userRole ||
            decoded.user_role;
          
          if (jwtRole) {
            normalized.rawRole = jwtRole;
            normalized.role = normalizeRole(jwtRole);
            console.log("Found role from JWT:", normalized.role);
          } else {
            console.warn("No role found in JWT token. Decoded token:", decoded);
          }
        }
      } catch (err) {
        // Silently fail if JWT decode fails
        console.debug("Could not decode JWT for role:", err);
      }
    }
    
    // Log warning if role is still null after all attempts
    if (!normalized.role || normalized.role === null) {
      console.warn("User role is null after normalization. User object:", normalized);
    }
  }
  
  // Normalize authorityList
  if (Array.isArray(normalized.authorityList)) {
    normalized.authorityList = normalized.authorityList.map(normalizeAuthority);
  }
  
  return normalized;
};

