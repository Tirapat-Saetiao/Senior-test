// Application Configuration Constants

// ✅ Allowed email domains for user authentication
export const ALLOWED_DOMAINS = ["@lamduan.mfu.ac.th", "@mfu.ac.th","tanatchapatomm@gmail.com"];

// ✅ Google OAuth Client ID
export const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID ;

// ✅ User type mappings
export const USER_TYPES = {
  STUDENT: 'student',
  STAFF: 'staff',
  ADMIN: 'admin',
  UNKNOWN: 'unknown'
};

// ✅ Domain to user type mapping
export const DOMAIN_USER_TYPE_MAP = {
  '@lamduan.mfu.ac.th': USER_TYPES.STUDENT,
  'tanatchapatomm@gmail.com': USER_TYPES.STAFF
};

// ✅ Utility functions
export const authUtils = {
  /**
   * Check if email is from allowed domain
   * @param {string} email - Email to validate
   * @returns {boolean} - True if email domain is allowed
   */
  isEmailAllowed: (email) => {
    if (!email) return false;
    return ALLOWED_DOMAINS.some((domain) => email.endsWith(domain));
  },

  /**
   * Get user type based on email domain
   * @param {string} email - User email
   * @returns {string} - User type (student/staff/unknown)
   */
  getUserType: (email) => {
    if (!email) return USER_TYPES.UNKNOWN;
    
    for (const [domain, userType] of Object.entries(DOMAIN_USER_TYPE_MAP)) {
      if (email.endsWith(domain)) {
        return userType;
      }
    }
    return USER_TYPES.UNKNOWN;
  },

  /**
   * Get display name for user type
   * @param {string} userType - User type
   * @returns {string} - Display name
   */
  getUserDisplayName: (userType) => {
    const displayNames = {
      [USER_TYPES.STUDENT]: 'Student',
      [USER_TYPES.STAFF]: 'Staff',
      [USER_TYPES.ADMIN]: 'Admin',
      [USER_TYPES.UNKNOWN]: 'Unknown'
    };
    return displayNames[userType] || 'Unknown';
  }
};

// ✅ API Configuration
/*export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || '',
  TIMEOUT: 10000
};*/

// ✅ UI Messages
export const MESSAGES = {
  ACCESS_DENIED: "Access Denied: Only @lamduan.mfu.ac.th or @mfu.ac.th emails can log in.",
  LOGIN_SUCCESS: "Login successful!",
  LOGOUT_SUCCESS: "Logged out successfully",
  INVALID_EMAIL: "Please use an email ending with @lamduan.mfu.ac.th (students) or @mfu.ac.th (staff)."
};
